"use server";

import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import { getTranslations } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";

/**
 * Contact form transport.
 *
 * The form posts here; this sends the submission to Convex (`contact:submitContact`)
 * when configured, otherwise directly to Resend.
 *
 * Convex takes priority when `NEXT_PUBLIC_CONVEX_URL` (or `CONVEX_URL`) is set.
 * Otherwise, Resend uses `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, and
 * `CONTACT_EMAIL_FROM`. When neither transport is configured, the action returns
 * `unconfigured` and the form falls back to `mailto:`.
 */

export type ContactFieldName = "name" | "email" | "message";

export type ContactActionResult =
  /** Stored. */
  | { status: "sent" }
  /** Field-level problems, keyed by input name. */
  | { status: "invalid"; errors: Partial<Record<ContactFieldName, string>> }
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
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const submitContactRef = makeFunctionReference<"mutation">("contact:submitContact");

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
  const topic = field(formData, "topic", LIMITS.subject);
  const locale = field(formData, "locale", LIMITS.locale);

  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations({ locale: resolvedLocale, namespace: "ContactForm" });

  const errors: Partial<Record<ContactFieldName, string>> = {};
  if (name.length < 2) errors.name = t("errorName");
  if (!EMAIL_PATTERN.test(email)) errors.email = t("errorEmail");
  if (message.length < 10) errors.message = t("errorMessage");

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors };
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
        message,
        company: company || undefined,
        locale: locale || undefined,
      });

      return { status: "sent" };
    } catch (error) {
      console.error("[contact] Convex submission failed", error);
      return { status: "failed" };
    }
  }

  const resend = resendConfig();
  if (!resend) {
    return { status: "unconfigured" };
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    topic ? `Topic: ${topic}` : null,
    `Locale: ${resolvedLocale}`,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resend.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resend.from,
        to: [resend.to],
        reply_to: email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error("[contact] Resend submission failed", response.status, await response.text());
      return { status: "failed" };
    }

    return { status: "sent" };
  } catch (error) {
    console.error("[contact] Resend submission failed", error);
    return { status: "failed" };
  }
}
