/**
 * The answers the intake form offers, by stable key. Labels live in the
 * message files under `ContactForm.needs`, `ContactForm.timings` and
 * `ContactForm.budgets`, keyed the same way; the server action accepts only
 * these keys, so a forged value never reaches the mail.
 *
 * `?need=<key>` on /services preselects a need, and each service row's
 * "Start with this" does the same without leaving the page.
 */
export const INTAKE_NEEDS = [
  "business-site",
  "place-app",
  "web-app",
  "public-service",
  "care",
  "review",
] as const;

export const INTAKE_TIMINGS = ["soon", "quarter", "year", "unsure"] as const;

export const INTAKE_BUDGETS = ["under-5k", "5k-15k", "15k-50k", "over-50k", "unsure"] as const;

export type IntakeNeed = (typeof INTAKE_NEEDS)[number];
export type IntakeTiming = (typeof INTAKE_TIMINGS)[number];
export type IntakeBudget = (typeof INTAKE_BUDGETS)[number];

export function isIntakeNeed(value: unknown): value is IntakeNeed {
  return INTAKE_NEEDS.includes(value as IntakeNeed);
}

export function isIntakeTiming(value: unknown): value is IntakeTiming {
  return INTAKE_TIMINGS.includes(value as IntakeTiming);
}

export function isIntakeBudget(value: unknown): value is IntakeBudget {
  return INTAKE_BUDGETS.includes(value as IntakeBudget);
}
