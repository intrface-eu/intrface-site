import { expect, spyOn, test } from "bun:test";
import { settleSubmission } from "@/lib/site/settle-submission";

test("a rejected call becomes uncertain instead of throwing", async () => {
  const quiet = spyOn(console, "error").mockImplementation(() => {});
  expect(await settleSubmission(() => Promise.reject(new TypeError("Failed to fetch")))).toEqual({ status: "uncertain" });
  quiet.mockRestore();
});

test("a settled call passes its result through", async () => {
  expect(await settleSubmission(async () => ({ status: "sent" as const }))).toEqual({ status: "sent" });
});
