/**
 * The three rules the contact form enforces, shared by the server action and
 * the client. The client runs them on submit so an empty or malformed entry is
 * answered without a round trip; the server runs them again and stays the
 * authority — a bypassed client never reaches the transport with bad data.
 */
export const CONTACT_RULES = {
  nameMin: 2,
  messageMin: 10,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export type ContactFieldName = "name" | "email" | "message";

/** Which required fields fail, in field order. Empty when the entry is valid. */
export function failingContactFields(values: Record<ContactFieldName, string>): ContactFieldName[] {
  const failing: ContactFieldName[] = [];
  if (values.name.trim().length < CONTACT_RULES.nameMin) failing.push("name");
  if (!CONTACT_RULES.emailPattern.test(values.email.trim())) failing.push("email");
  if (values.message.trim().length < CONTACT_RULES.messageMin) failing.push("message");
  return failing;
}
