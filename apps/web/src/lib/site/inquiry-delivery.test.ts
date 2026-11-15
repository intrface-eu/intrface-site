import { describe, expect, mock, test } from "bun:test";
import { deliverInquiry, type MailResult } from "@/lib/site/inquiry-delivery";
import type { PrismInquiryResult } from "@/lib/site/prism-inquiry";

// Synthetic only: the store and the mail are plain functions; nothing is sent.
const stored: PrismInquiryResult = { kind: "stored", inquiryId: "inq_1", duplicate: false };
const notStored: PrismInquiryResult = { kind: "not_stored", reason: "Prism 503 not_persisted" };
const limited: PrismInquiryResult = { kind: "rate_limited", retryAfterSeconds: 120 };

function steps(store: PrismInquiryResult | null, mailResult: MailResult | null) {
  const mail = mock<(line: string) => Promise<MailResult>>(async () => mailResult as MailResult);
  const alert = mock<(error: string) => Promise<boolean>>(async () => true);
  return {
    mail,
    alert,
    run: () =>
      deliverInquiry({
        store: store ? async () => store : null,
        mail: mailResult ? mail : null,
        alert,
      }),
  };
}

describe("deliverInquiry", () => {
  test("stored in Prism and emailed: captured by Prism", async () => {
    const s = steps(stored, { ok: true });
    expect(await s.run()).toEqual({ status: "sent", capture: "prism", inquiryId: "inq_1", duplicate: false, mailed: true });
    expect(s.mail.mock.calls[0][0]).toBe("Prism: stored as inq_1");
    expect(s.alert).not.toHaveBeenCalled();
  });

  test("stored in Prism, email failed: still captured, no alert", async () => {
    const s = steps(stored, { ok: false, error: "Resend 500" });
    expect(await s.run()).toMatchObject({ status: "sent", capture: "prism", mailed: false });
    expect(s.alert).not.toHaveBeenCalled();
  });

  test("Prism failed, email accepted: email-only capture, marked as the only copy", async () => {
    const s = steps(notStored, { ok: true });
    expect(await s.run()).toEqual({ status: "sent", capture: "email", prism: "Prism 503 not_persisted" });
    expect(s.mail.mock.calls[0][0]).toBe("Prism: NOT stored; this email is the only copy");
  });

  test("Prism off, email accepted: email-only capture, as before this change", async () => {
    const s = steps(null, { ok: true });
    expect(await s.run()).toEqual({ status: "sent", capture: "email", prism: "off" });
    expect(s.mail.mock.calls[0][0]).toBe("Prism: intake off; this email is the only copy");
  });

  test("Prism throttled: no email and no alert, the visitor waits", async () => {
    const s = steps(limited, { ok: true });
    expect(await s.run()).toEqual({ status: "throttled", retryAfterSeconds: 120 });
    expect(s.mail).not.toHaveBeenCalled();
    expect(s.alert).not.toHaveBeenCalled();
  });

  test("both failed: alert and failed", async () => {
    const s = steps(notStored, { ok: false, error: "Resend 500" });
    expect(await s.run()).toEqual({ status: "failed", prism: "Prism 503 not_persisted", mail: "Resend 500" });
    expect(s.alert).toHaveBeenCalledTimes(1);
    expect(s.alert.mock.calls[0][0]).toContain("Resend 500");
  });

  test("Prism off, email failed: alert and failed", async () => {
    const s = steps(null, { ok: false, error: "Resend 422" });
    expect(await s.run()).toMatchObject({ status: "failed", prism: "off" });
    expect(s.alert).toHaveBeenCalledTimes(1);
  });

  test("Prism stored, no email configured: captured", async () => {
    const s = steps(stored, null);
    expect(await s.run()).toMatchObject({ status: "sent", capture: "prism", mailed: false });
  });

  test("Prism failed, no email configured: alert and failed, never unconfigured", async () => {
    const s = steps(notStored, null);
    expect((await s.run()).status).toBe("failed");
    expect(s.alert).toHaveBeenCalledTimes(1);
  });

  test("nothing configured: unconfigured, so the form hands over to mailto", async () => {
    const s = steps(null, null);
    expect(await s.run()).toEqual({ status: "unconfigured" });
    expect(s.alert).not.toHaveBeenCalled();
  });

  test("the mail line is the same on every attempt of one submission", async () => {
    const lines: string[] = [];
    for (const reason of ["Prism 503 not_persisted", "network: timeout"]) {
      const s = steps({ kind: "not_stored", reason }, { ok: true });
      await s.run();
      lines.push(s.mail.mock.calls[0][0]);
    }
    expect(lines[0]).toBe(lines[1]);
  });
});
