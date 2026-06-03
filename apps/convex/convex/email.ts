import { v } from "convex/values";
import { action } from "./_generated/server";

/**
 * Resend email integration for Intrface contact forms.
 *
 * To activate:
 * 1. Set RESEND_API_KEY in your Convex dashboard environment variables
 * 2. Set RESEND_FROM_EMAIL (e.g. "hello@intrface.eu")
 * 3. Deploy: bunx convex deploy
 */

export const sendContactEmail = action({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    company: v.optional(v.string()),
    locale: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Stub: wire in Resend here once credentials are configured
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({...});

    return { success: true, id: "stub" };
  },
});
