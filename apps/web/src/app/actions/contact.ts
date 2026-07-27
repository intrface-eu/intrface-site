"use server";

import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import { getTranslations } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";

/**
 * Contact form transport.
 *
 * The form posts here; this sends the submission to Convex (`contact:submitContact`,
 * which writes `contactSubmissions` and schedules the Resend action).
 *
 * The deployment URL is read at request time from `NEXT_PUBLIC_CONVEX_URL`
 * (falling back to `CONVEX_URL`, the name Convex writes into `apps/convex/.env.local`).
 * When neither is set the action returns `unconfigured` and the form falls back to
 * `mailto:` — nothing here throws at import time, so the build never depends on env.
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

  const t = await getTranslations({ locale: resolveLocale(locale), namespace: "ContactForm" });

  const errors: Partial<Record<ContactFieldName, string>> = {};
  if (name.length < 2) errors.name = t("errorName");
  if (!EMAIL_PATTERN.test(email)) errors.email = t("errorEmail");
  if (message.length < 10) errors.message = t("errorMessage");

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors };
  }

  const url = deploymentUrl();
  if (!url) {
    return { status: "unconfigured" };
  }

  const subject = topic ? t("subjectWithTopic", { topic, name }) : t("subjectFallback");

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
