import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    locale: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed")
    ),
    createdAt: v.number(),
    /** When the notification actually left Resend. */
    deliveredAt: v.optional(v.number()),
    /** Why delivery failed, so a `failed` row can be retried by hand. */
    deliveryError: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),
});
