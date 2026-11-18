import { describe, expect, test } from "bun:test";
import { CONTACT_RATE_LIMIT, clientKey, createRateLimiter } from "@/lib/site/inquiry-rate-limit";
import { isSubmissionId, newSubmissionId, sourcePathFrom, submissionIdFor } from "@/lib/site/inquiry-identity";

describe("submission ids", () => {
  test("a new id passes the contract's pattern", () => {
    expect(isSubmissionId(newSubmissionId())).toBe(true);
  });

  test("forged or malformed ids are refused", () => {
    for (const value of ["short", "has space here", "a".repeat(81), "../../etc", 42, null]) {
      expect(isSubmissionId(value)).toBe(false);
    }
  });

  test("an unchanged entry keeps its id, an edited one gets a new id", () => {
    let n = 0;
    const make = () => `web-synthetic-${++n}`;
    const first = submissionIdFor(null, "entry-a", make);
    expect(submissionIdFor(first, "entry-a", make).id).toBe(first.id);
    expect(submissionIdFor(first, "entry-b", make).id).not.toBe(first.id);
  });
});

describe("sourcePathFrom", () => {
  test("keeps the path and a valid need only", () => {
    expect(sourcePathFrom("/hr/services?need=workflow-discovery&utm_source=x&fbclid=y#start")).toBe(
      "/hr/services?need=workflow-discovery",
    );
    expect(sourcePathFrom("/en/services?need=not-a-need&ref=z")).toBe("/en/services");
  });

  test("refuses anything that is not a same-site path", () => {
    for (const value of ["https://evil.example.test/x", "//evil.example.test/x", "services", "/\\evil", ""]) {
      expect(sourcePathFrom(value)).toBe("");
    }
  });
});

describe("rate limit", () => {
  const options = { ...CONTACT_RATE_LIMIT, perClient: 2, overall: 3 };

  test("a client over its limit waits until its oldest entry leaves the window", () => {
    let now = 0;
    const check = createRateLimiter({ ...options, now: () => now });
    expect(check("a", "s1").ok).toBe(true);
    now = 60_000;
    expect(check("a", "s2").ok).toBe(true);
    expect(check("a", "s3")).toEqual({ ok: false, retryAfterSeconds: 540 });
    now = options.windowMs;
    expect(check("a", "s3").ok).toBe(true);
  });

  test("a retry of the same submission is not counted again", () => {
    const check = createRateLimiter({ ...options, now: () => 0 });
    expect(check("a", "s1").ok).toBe(true);
    expect(check("a", "s1").ok).toBe(true);
    expect(check("a", "s1").ok).toBe(true);
    expect(check("a", "s2").ok).toBe(true);
  });

  test("the instance-wide limit holds across clients", () => {
    const check = createRateLimiter({ ...options, now: () => 0 });
    expect(check("a", "s1").ok).toBe(true);
    expect(check("b", "s2").ok).toBe(true);
    expect(check("c", "s3").ok).toBe(true);
    expect(check("d", "s4").ok).toBe(false);
  });

  test("client keys are stable and do not contain the address", async () => {
    const key = await clientKey("192.0.2.10");
    expect(key).toBe(await clientKey("192.0.2.10"));
    expect(key).not.toContain("192.0.2.10");
    expect(key).not.toBe(await clientKey("192.0.2.11"));
  });
});
