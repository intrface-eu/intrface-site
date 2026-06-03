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
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),
});
