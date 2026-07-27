import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Public entry point for the website contact form.
 *
 * The web app calls this over HTTP (`ConvexHttpClient`) from a Next.js server
 * action, so the payload is already validated there. Validate again here: this
 * is a public function and anyone can call it.
 *
 * The row lands as `pending`. Delivery is a separate step — `email.sendContactEmail`
 * runs after the write so a Resend outage never loses a submission.
 */

const MAX = {
  name: 120,
  email: 200,
  company: 160,
  subject: 120,
  message: 5000,
  locale: 12,
} as const;

function clean(value: string | undefined, limit: number): string {
  return (value ?? "").trim().slice(0, limit);
}

export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    company: v.optional(v.string()),
    locale: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const name = clean(args.name, MAX.name);
    const email = clean(args.email, MAX.email);
    const subject = clean(args.subject, MAX.subject) || "Website enquiry";
    const message = clean(args.message, MAX.message);
    const company = clean(args.company, MAX.company);
    const locale = clean(args.locale, MAX.locale);

    if (name.length < 2) throw new Error("A name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("A valid email address is required.");
    if (message.length < 10) throw new Error("A message is required.");

    const id = await ctx.db.insert("contactSubmissions", {
      name,
      email,
      subject,
      message,
      company: company || undefined,
      locale: locale || undefined,
      status: "pending",
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, api.email.sendContactEmail, {
      name,
      email,
      subject,
      message,
      company: company || undefined,
      locale: locale || undefined,
    });

    return { id };
  },
});
