import { describe, expect, test } from "bun:test";
import { inquiryBody, prismInquiryConfig, storeInquiry, type PrismInquiry } from "@/lib/site/prism-inquiry";

// Synthetic only: example.test addresses, a fake URL, and a mocked fetch.
const CONFIG = {
  url: "https://prism.example.test/api/v1/inquiries",
  token: "tok_synthetic",
  accessClientId: "cf-id-synthetic",
  accessClientSecret: "cf-secret-synthetic",
};

const INQUIRY: PrismInquiry = {
  submissionId: "web-synthetic-0001",
  needs: ["workflow-discovery", "workflow-discovery", "business-site"],
  timing: "quarter",
  locale: "hr",
  name: "Test Person",
  email: "person@example.test",
  message: "We retype every order by hand.",
  sourcePath: "/hr/services?need=workflow-discovery",
};

type Call = { url: string; init: RequestInit };

function mockFetch(responses: Array<Response | Error>) {
  const calls: Call[] = [];
  const fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    const next = responses.shift();
    if (!next) throw new Error("unexpected call");
    if (next instanceof Error) throw next;
    return next;
  }) as unknown as typeof globalThis.fetch;
  return { fetch, calls };
}

const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const noWait = { backoff: [0], sleep: async () => {} };

describe("prismInquiryConfig", () => {
  const full = {
    PRISM_INQUIRY_ENABLED: "1",
    PRISM_INQUIRY_URL: CONFIG.url,
    PRISM_INQUIRY_TOKEN: CONFIG.token,
    PRISM_ACCESS_CLIENT_ID: CONFIG.accessClientId,
    PRISM_ACCESS_CLIENT_SECRET: CONFIG.accessClientSecret,
  };

  test("off unless explicitly enabled", () => {
    expect(prismInquiryConfig({ ...full, PRISM_INQUIRY_ENABLED: undefined })).toBeNull();
    expect(prismInquiryConfig({ ...full, PRISM_INQUIRY_ENABLED: "true" })).toBeNull();
  });

  test("off when any credential is missing or the URL is not https", () => {
    expect(prismInquiryConfig({ ...full, PRISM_ACCESS_CLIENT_SECRET: "" })).toBeNull();
    expect(prismInquiryConfig({ ...full, PRISM_INQUIRY_URL: "http://prism.example.test" })).toBeNull();
  });

  test("on with everything set", () => {
    expect(prismInquiryConfig(full)).toEqual(CONFIG);
  });
});

describe("inquiryBody", () => {
  test("sends only contract fields, drops duplicate needs and empty optionals", () => {
    const body = inquiryBody(INQUIRY);
    expect(Object.keys(body).sort()).toEqual(
      ["email", "locale", "message", "name", "needs", "sourcePath", "submissionId", "timing"].sort(),
    );
    expect(body.needs).toEqual(["workflow-discovery", "business-site"]);
    expect(body).not.toHaveProperty("workspace");
  });

  test("an inquiry with no need sends an empty list", () => {
    expect(inquiryBody({ ...INQUIRY, needs: [] }).needs).toEqual([]);
  });
});

describe("storeInquiry", () => {
  test("202 is stored, with credentials only in headers", async () => {
    const { fetch, calls } = mockFetch([reply(202, { ok: true, status: "received", inquiryId: "inq_1", duplicate: false })]);
    const result = await storeInquiry(CONFIG, INQUIRY, { fetch, ...noWait });

    expect(result).toEqual({ kind: "stored", inquiryId: "inq_1", duplicate: false });
    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer tok_synthetic");
    expect(headers["CF-Access-Client-Id"]).toBe("cf-id-synthetic");
    expect(headers["CF-Access-Client-Secret"]).toBe("cf-secret-synthetic");
    expect(String(calls[0].init.body)).not.toContain("tok_synthetic");
  });

  test("200 duplicate is stored and flagged", async () => {
    const { fetch } = mockFetch([reply(200, { ok: true, status: "received", inquiryId: "inq_1", duplicate: true })]);
    expect(await storeInquiry(CONFIG, INQUIRY, { fetch, ...noWait })).toEqual({
      kind: "stored",
      inquiryId: "inq_1",
      duplicate: true,
    });
  });

  test("5xx retries once with the same submission id", async () => {
    const { fetch, calls } = mockFetch([
      reply(503, { ok: false, error: "not_persisted" }),
      reply(202, { ok: true, status: "received", inquiryId: "inq_2", duplicate: false }),
    ]);
    const result = await storeInquiry(CONFIG, INQUIRY, { fetch, ...noWait });

    expect(result.kind).toBe("stored");
    expect(calls).toHaveLength(2);
    expect(String(calls[0].init.body)).toBe(String(calls[1].init.body));
  });

  test("network failure on every attempt is not stored", async () => {
    const { fetch, calls } = mockFetch([new Error("socket hang up"), new Error("socket hang up")]);
    const result = await storeInquiry(CONFIG, INQUIRY, { fetch, ...noWait });

    expect(result).toEqual({ kind: "not_stored", reason: "network: socket hang up" });
    expect(calls).toHaveLength(2);
  });

  test("429 is reported with its wait and never retried", async () => {
    const { fetch, calls } = mockFetch([reply(429, { ok: false, error: "rate_limited", retryAfterSeconds: 90 })]);
    expect(await storeInquiry(CONFIG, INQUIRY, { fetch, ...noWait })).toEqual({
      kind: "rate_limited",
      retryAfterSeconds: 90,
    });
    expect(calls).toHaveLength(1);
  });

  test("429 without a usable wait falls back to a bounded default", async () => {
    const { fetch } = mockFetch([reply(429, { ok: false, error: "rate_limited", retryAfterSeconds: 1e9 })]);
    expect(await storeInquiry(CONFIG, INQUIRY, { fetch, ...noWait })).toEqual({
      kind: "rate_limited",
      retryAfterSeconds: 3600,
    });
  });

  test.each([400, 401, 403, 409, 413])("%i is not stored and not retried", async (status) => {
    const { fetch, calls } = mockFetch([reply(status, { ok: false, error: "x" })]);
    const result = await storeInquiry(CONFIG, INQUIRY, { fetch, ...noWait });

    expect(result.kind).toBe("not_stored");
    expect(calls).toHaveLength(1);
  });

  test("an Access login redirect is not mistaken for success", async () => {
    const { fetch } = mockFetch([new Response(null, { status: 302, headers: { Location: "https://login.example.test" } })]);
    expect((await storeInquiry(CONFIG, INQUIRY, { fetch, ...noWait })).kind).toBe("not_stored");
  });

  test("a 2xx without ok and an inquiry id is not stored", async () => {
    const { fetch } = mockFetch([reply(202, { ok: false })]);
    expect((await storeInquiry(CONFIG, INQUIRY, { fetch, ...noWait })).kind).toBe("not_stored");
  });
});
