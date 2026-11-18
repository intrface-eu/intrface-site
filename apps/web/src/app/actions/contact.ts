"use server";

import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { alertDeliveryFailure, sendContactMail } from "@/lib/site/contact-delivery";
import { failingContactFields, type ContactFieldName } from "@/lib/site/contact-rules";
import { INTAKE_NEEDS, isIntakeBudget, isIntakeTiming } from "@/lib/site/intake";
import { deliverInquiry } from "@/lib/site/inquiry-delivery";
import { isSubmissionId, newSubmissionId, sourcePathFrom } from "@/lib/site/inquiry-identity";
import { CONTACT_RATE_LIMIT, clientKey, createRateLimiter } from "@/lib/site/inquiry-rate-limit";
import { prismInquiryConfig, storeInquiry } from "@/lib/site/prism-inquiry";

/**
 * Contact form transport.
 *
 * Order, after the honeypot, validation and the in-memory rate limit:
 *
 * 1. Convex (`contact:submitContact`), when `NEXT_PUBLIC_CONVEX_URL` or
 *    `CONVEX_URL` is set. Kept as it was: a durable store with its own
 *    scheduled email. Production sets neither (Convex was never deployed for
 *    the site), so this path is dormant, not removed.
 * 2. Otherwise Prism inquiry intake (`prism-inquiry.ts`), when
 *    `PRISM_INQUIRY_ENABLED=1` and its credentials are set, then the Resend
 *    owner email (`RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`).
 *    `inquiry-delivery.ts` holds the rules: success only when Prism stored the
 *    inquiry or Resend accepted the email; a Prism 429 stops here; when both
 *    fail the operator gets an urgent Prism notify alert.
 * 3. Nothing configured: `unconfigured`, and the form falls back to mailto.
 *
 * The visitor sees the same "received" either way. Where the inquiry actually
 * landed (`capture: "prism"` or `"email"`) is logged and written into the
 * owner email, so an email-only inquiry is never mistaken for one Prism is
 * following up.
 */

// No `export type { ... }` here: Next's server-action transform treats a
// re-export in a "use server" file as a value, and the module then throws
// "ContactFieldName is not defined" on every submit. Import it from
// `lib/site/contact-rules` instead.

export type ContactActionResult =
  /** Stored, or delivered to the owner's inbox. */
  | { status: "sent" }
  /** Field-level problems, keyed by input name. */
  | { status: "invalid"; errors: Partial<Record<ContactFieldName, string>> }
  /** Too many submissions just now; try again after this many seconds. */
  | { status: "throttled"; retryAfterSeconds: number }
  /** No backend configured in this environment — the caller should use mailto. */
  | { status: "unconfigured" }
  /** The backend was reachable-in-principle but the write failed. */
  | { status: "failed" };

const LIMITS = {
  name: 120,
  email: 200,
  company: 160,
  subject: 120,
  message: 5000,
  locale: 12,
  sourcePath: 600,
  submissionId: 80,
} as const;

const submitContactRef = makeFunctionReference<"mutation">("contact:submitContact");

/** One per server instance; see `inquiry-rate-limit.ts` for what it does and does not stop. */
const rateLimit = createRateLimiter(CONTACT_RATE_LIMIT);

function field(formData: FormData, name: string, limit: number): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

/** The posted locale, or the default when the form was rendered without one. */
function resolveLocale(value: string): AppLocale {
  return routing.locales.includes(value as AppLocale) ? (value as AppLocale) : routing.defaultLocale;
}

function deploymentUrl(): string {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
  return url.trim().replace(/\/$/, "");
}

function resendConfig(): { apiKey: string; from: string; to: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_EMAIL_FROM?.trim();
  const to = process.env.CONTACT_EMAIL_TO?.trim();

  return apiKey && from && to ? { apiKey, from, to } : null;
}

/** The connection's address as Vercel reports it, for the rate limit only. */
async function clientAddress(): Promise<string> {
  const list = await headers();
  return list.get("x-real-ip")?.trim() || list.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function submitContactForm(formData: FormData): Promise<ContactActionResult> {
  // Honeypot: a real person never sees this input, so anything in it is a bot.
  // Report success — a bot told it failed just retries.
  if (field(formData, "website", 200) !== "") {
    return { status: "sent" };
  }

  const name = field(formData, "name", LIMITS.name);
  const email = field(formData, "email", LIMITS.email);
  const message = field(formData, "message", LIMITS.message);
  const company = field(formData, "company", LIMITS.company);
  const locale = field(formData, "locale", LIMITS.locale);
  const postedId = field(formData, "submissionId", LIMITS.submissionId);
  const submissionId = isSubmissionId(postedId) ? postedId : newSubmissionId();
  const sourcePath = sourcePathFrom(field(formData, "sourcePath", LIMITS.sourcePath));

  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations({ locale: resolvedLocale, namespace: "ContactForm" });

  // Only known keys pass, in the form's own order, so a forged value never
  // reaches the mail. The labels are in the reader's language, as on the form.
  const posted = formData.getAll("need");
  const needs = INTAKE_NEEDS.filter((key) => posted.includes(key));
  const topic = needs.map((key) => t(`needs.${key}`)).join(", ");
  const timing = field(formData, "timing", 20);
  const budget = field(formData, "budget", 20);
  const details = [
    isIntakeTiming(timing) ? `${t("timingLabel")}: ${t(`timings.${timing}`)}` : null,
    isIntakeBudget(budget) ? `${t("budgetLabel")}: ${t(`budgets.${budget}`)}` : null,
  ].filter((line) => line !== null);
  // Timing and budget ride at the top of the message for the stores that have
  // no field for them (Convex, the Prism alert).
  const fullMessage = details.length > 0 ? [...details, "", message].join("\n") : message;

  const errors: Partial<Record<ContactFieldName, string>> = {};
  for (const failed of failingContactFields({ name, email, message })) {
    errors[failed] = t(failed === "name" ? "errorName" : failed === "email" ? "errorEmail" : "errorMessage");
  }

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors };
  }

  const limited = rateLimit(await clientKey(await clientAddress()), submissionId);
  if (!limited.ok) {
    console.warn("[contact] rate limited", { submissionId, retryAfterSeconds: limited.retryAfterSeconds });
    return { status: "throttled", retryAfterSeconds: limited.retryAfterSeconds };
  }

  const subject = topic ? t("subjectWithTopic", { topic, name }) : t("subjectFallback");
  const url = deploymentUrl();

  if (url) {
    try {
      const client = new ConvexHttpClient(url);
      await client.mutation(submitContactRef, {
        name,
        email,
        subject,
        message: fullMessage,
        company: company || undefined,
        locale: locale || undefined,
      });

      console.info("[contact] captured", { capture: "convex", submissionId });
      return { status: "sent" };
    } catch (error) {
      console.error("[contact] Convex submission failed", error);
      return { status: "failed" };
    }
  }

  const prism = prismInquiryConfig();
  const resend = resendConfig();

  const outcome = await deliverInquiry({
    store: prism
      ? () =>
          storeInquiry(prism, {
            submissionId,
            needs,
            timing: isIntakeTiming(timing) ? timing : undefined,
            budget: isIntakeBudget(budget) ? budget : undefined,
            locale: resolvedLocale,
            name,
            email,
            message,
            company: company || undefined,
            sourcePath: sourcePath || undefined,
          })
      : null,
    mail: resend
      ? (storeLine) =>
          sendContactMail({
            apiKey: resend.apiKey,
            from: resend.from,
            to: resend.to,
            replyTo: email,
            subject,
            idempotencyKey: `intrface-site-contact/${submissionId}`,
            text: [
              `Name: ${name}`,
              `Email: ${email}`,
              company ? `Company: ${company}` : null,
              topic ? `Need: ${topic}` : null,
              ...details,
              `Locale: ${resolvedLocale}`,
              sourcePath ? `Page: ${sourcePath}` : null,
              storeLine,
              "",
              message,
            ]
              .filter((line) => line !== null)
              .join("\n"),
          })
      : null,
    alert: (error) =>
      alertDeliveryFailure({ name, email, topic, company, locale: resolvedLocale, message: fullMessage }, error),
  });

  switch (outcome.status) {
    case "sent":
      console.info("[contact] captured", { submissionId, ...outcome });
      return { status: "sent" };
    case "throttled":
      console.warn("[contact] Prism rate limited", { submissionId, retryAfterSeconds: outcome.retryAfterSeconds });
      return { status: "throttled", retryAfterSeconds: outcome.retryAfterSeconds };
    case "failed":
      console.error("[contact] not captured", { submissionId, ...outcome });
      return { status: "failed" };
    case "unconfigured":
      return { status: "unconfigured" };
  }
}
