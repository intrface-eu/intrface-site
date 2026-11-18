import { expect, test } from "bun:test";
import { routing } from "@/i18n/routing";
import { INTAKE_NEEDS } from "@/lib/site/intake";
import en from "./en.json";

// Messages load per locale with no fallback (`i18n/request.ts`), so a key
// missing from one locale shows as a raw key on that locale's pages.
function keys(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) return [`${prefix}[${value.length}]`];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => keys(child, prefix ? `${prefix}.${key}` : key));
  }
  return [prefix];
}

// The namespaces the services path and the form read. (`IndexAbout` is
// English-only on purpose today, so the whole file is not compared.)
const CHECKED = ["ContactForm", "Services", "Privacy", "Metadata"] as const;
const pick = (messages: Record<string, unknown>) => Object.fromEntries(CHECKED.map((name) => [name, messages[name]]));
const reference = keys(pick(en)).sort();

test.each(routing.locales.filter((locale) => locale !== "en"))("%s has every services and form key en has", async (locale) => {
  const messages = (await import(`./${locale}.json`)).default;
  expect(keys(pick(messages)).sort()).toEqual(reference);
});

test("every intake need has a label and an ask", () => {
  for (const need of INTAKE_NEEDS) {
    expect(en.ContactForm.needs).toHaveProperty(need);
    expect(en.ContactForm.asks).toHaveProperty(need);
  }
});
