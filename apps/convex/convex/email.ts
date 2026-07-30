import { v } from "convex/values";
import { Resend } from "resend";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Operator notification for one contact submission.
 *
 * Ordering matters: `contact.submitContact` writes the row first and schedules
 * this action second, so a Resend outage — or a missing key — never loses a
 * message. This action therefore never throws. Every path ends in
 * `contact.recordDelivery`, which marks the row `sent` or `failed` with a
 * reason, and the message itself stays readable in the table either way.
 *
 * Environment (Convex dashboard → Settings → Environment Variables):
 *   RESEND_API_KEY     required for delivery; without it the row is stored,
 *                      marked `failed`, and nothing is sent.
 *   RESEND_FROM_EMAIL  optional sender override. Must stay on a subdomain:
 *                      the root intrface.eu SPF and MX belong to Google
 *                      Workspace and must not gain a second sender.
 *   CONTACT_TO_EMAIL   optional recipient override.
 */

const DEFAULT_FROM = "Intrface site <notifications@send.intrface.eu>";
const DEFAULT_TO = "hello@intrface.eu";

/** Plain text on purpose: this is an operator notification, not marketing. */
function body(args: {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  locale?: string;
  submissionId: string;
}): string {
  return [
    `Name:     ${args.name}`,
    `Email:    ${args.email}`,
    `Company:  ${args.company || "—"}`,
    `Topic:    ${args.subject}`,
    `Locale:   ${args.locale || "—"}`,
    `Received: ${new Date().toISOString()}`,
    `Ref:      ${args.submissionId}`,
    "",
    "Message",
    "-------",
    args.message,
    "",
    "Reply to this email and the answer goes straight back to the sender.",
  ].join("\n");
}

function reason(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error.";
  }
}

export const sendContactEmail = internalAction({
  args: {
    submissionId: v.id("contactSubmissions"),
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    company: v.optional(v.string()),
    locale: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      await ctx.runMutation(internal.contact.recordDelivery, {
        submissionId: args.submissionId,
        status: "failed",
        error: "RESEND_API_KEY is not set. The submission is stored but was not delivered.",
      });
      return { delivered: false as const, reason: "no-api-key" };
    }

    const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
    const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;

    try {
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from,
        to,
        // A reply lands with the visitor, not in this mailbox.
        replyTo: args.email,
        subject: args.subject,
        text: body({ ...args, submissionId: args.submissionId }),
      });

      if (error) {
        await ctx.runMutation(internal.contact.recordDelivery, {
          submissionId: args.submissionId,
          status: "failed",
          error: reason(error),
        });
        return { delivered: false as const, reason: reason(error) };
      }

      await ctx.runMutation(internal.contact.recordDelivery, {
        submissionId: args.submissionId,
        status: "sent",
      });
      return { delivered: true as const, id: data?.id };
    } catch (error) {
      await ctx.runMutation(internal.contact.recordDelivery, {
        submissionId: args.submissionId,
        status: "failed",
        error: reason(error),
      });
      return { delivered: false as const, reason: reason(error) };
    }
  },
});
