"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type FormEvent,
} from "react";
import { IconArrowRight, IconLoader2 } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { submitContactForm, type ContactFieldName } from "@/app/actions/contact";
import { CONTACT_EMAIL } from "@/lib/site/config";

/*
 * Submitting posts to the `submitContactForm` server action, which stores the
 * message in Convex. When no Convex deployment is configured — or the write
 * fails — the form falls back to the visitor's mail client with the message
 * pre-filled, so the page works with no backend and no env var.
 */

export type ContactFormProps = {
  /** Where the mailto lands. */
  email?: string;
  /** Selectable topic chips, already translated. The first is preselected. */
  topics: readonly string[];
  /** Label on the submit button. Defaults to the translated label. */
  submitLabel?: string;
  /** Stored with the submission so replies go out in the reader's language. */
  locale?: string;
  className?: string;
};

type FieldErrors = Partial<Record<ContactFieldName, string>>;

/*
 * DESIGN.md declares `danger: #be123c` but globals.css does not expose it as a
 * variable yet. Declare it once on the form root and reference the variable
 * everywhere below, rather than reaching for a Tailwind red. Delete this when
 * the token lands in globals.css.
 */
const dangerToken = { "--form-danger": "#be123c" } as CSSProperties;

const fieldClasses =
  "w-full rounded-[var(--radius-md)] border border-rule bg-card px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/25 aria-[invalid=true]:border-[var(--form-danger)] aria-[invalid=true]:focus:border-[var(--form-danger)] aria-[invalid=true]:focus:ring-[var(--form-danger)]/25";

const labelClasses = "type-meta block";

const errorTextClasses = "text-sm font-medium leading-6 text-[var(--form-danger)]";

export function ContactForm({
  email = CONTACT_EMAIL,
  topics,
  submitLabel,
  locale,
  className = "",
}: ContactFormProps) {
  const t = useTranslations("ContactForm");
  const [name, setName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState(topics[0] ?? "");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);
  const [fallback, setFallback] = useState<"mail-client" | "failed" | null>(null);
  const [pending, startTransition] = useTransition();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  const mailtoHref = useMemo(() => {
    const subject = topic
      ? t("subjectWithTopic", { topic, name: name || t("mailtoWebsite") })
      : t("subjectFallback");
    const body = [
      `${t("mailtoName")}: ${name}`,
      `${t("mailtoEmail")}: ${replyTo}`,
      company ? `${t("mailtoCompany")}: ${company}` : null,
      topic ? `${t("mailtoTopic")}: ${topic}` : null,
      "",
      message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [company, email, message, name, replyTo, t, topic]);

  useEffect(() => {
    if (sent) sentRef.current?.focus();
  }, [sent]);

  useEffect(() => {
    if (fallback) fallbackRef.current?.focus();
  }, [fallback]);

  function focusFirstError(next: FieldErrors) {
    if (next.name) nameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    else if (next.message) messageRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const href = mailtoHref;

    setErrors({});
    setFallback(null);

    startTransition(async () => {
      const result = await submitContactForm(data);

      if (result.status === "sent") {
        setSent(true);
        setName("");
        setReplyTo("");
        setCompany("");
        setMessage("");
        return;
      }

      if (result.status === "invalid") {
        setErrors(result.errors);
        focusFirstError(result.errors);
        return;
      }

      // No deployment configured, or the write failed: hand the message to the
      // visitor's mail client and leave a visible link in case nothing opens.
      setFallback(result.status === "unconfigured" ? "mail-client" : "failed");
      window.location.href = href;
    });
  }

  if (sent) {
    return (
      <div className={`grid gap-4 ${className}`}>
        <div
          className="rounded-[var(--radius-lg)] border border-rule bg-card p-6"
          ref={sentRef}
          role="status"
          tabIndex={-1}
        >
          <p className="type-section-label">{t("sentLabel")}</p>
          <p className="mt-3 text-base leading-7 text-ink">{t("sentBody", { email })}</p>
        </div>
        <div>
          <button
            className={tactileButtonClasses("secondary")}
            onClick={() => setSent(false)}
            type="button"
          >
            <span>{t("writeAnother")}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className={`grid gap-6 ${className}`}
      noValidate={false}
      onSubmit={handleSubmit}
      style={dangerToken}
    >
      {locale ? <input name="locale" type="hidden" value={locale} /> : null}

      {/* Honeypot. Off-screen, skipped by keyboard, hidden from assistive tech. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">{t("honeypotLabel")}</label>
        <input
          autoComplete="off"
          id="contact-website"
          name="website"
          tabIndex={-1}
          type="text"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className={labelClasses} htmlFor="contact-name">
            {t("nameLabel")}
          </label>
          <input
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            aria-invalid={errors.name ? true : undefined}
            autoComplete="name"
            className={fieldClasses}
            id="contact-name"
            name="name"
            onChange={(event) => setName(event.target.value)}
            ref={nameRef}
            required
            type="text"
            value={name}
          />
          {errors.name ? (
            <p className={errorTextClasses} id="contact-name-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label className={labelClasses} htmlFor="contact-email">
            {t("emailLabel")}
          </label>
          <input
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            aria-invalid={errors.email ? true : undefined}
            autoComplete="email"
            className={fieldClasses}
            id="contact-email"
            name="email"
            onChange={(event) => setReplyTo(event.target.value)}
            ref={emailRef}
            required
            type="email"
            value={replyTo}
          />
          {errors.email ? (
            <p className={errorTextClasses} id="contact-email-error">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2">
        <label className={labelClasses} htmlFor="contact-company">
          {t("companyLabel")}{" "}
          <span className="lowercase tracking-normal">{t("companyOptional")}</span>
        </label>
        <input
          autoComplete="organization"
          className={fieldClasses}
          id="contact-company"
          name="company"
          onChange={(event) => setCompany(event.target.value)}
          type="text"
          value={company}
        />
      </div>

      <fieldset className="grid gap-3">
        <legend className={labelClasses}>{t("topicLabel")}</legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((value) => (
            <label className="cursor-pointer" key={value}>
              <input
                checked={topic === value}
                className="peer sr-only"
                name="topic"
                onChange={() => setTopic(value)}
                type="radio"
                value={value}
              />
              <span className="block rounded-full border border-rule bg-white/70 px-4 py-2 text-sm font-medium text-ink-muted transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                {value}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label className={labelClasses} htmlFor="contact-message">
          {t("messageLabel")}
        </label>
        <textarea
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          aria-invalid={errors.message ? true : undefined}
          className={`${fieldClasses} min-h-40 resize-y leading-7`}
          id="contact-message"
          name="message"
          onChange={(event) => setMessage(event.target.value)}
          ref={messageRef}
          required
          value={message}
        />
        {errors.message ? (
          <p className={errorTextClasses} id="contact-message-error">
            {errors.message}
          </p>
        ) : null}
      </div>

      {fallback ? (
        <div
          className="rounded-[var(--radius-md)] border border-rule bg-card p-5"
          ref={fallbackRef}
          role="alert"
          tabIndex={-1}
        >
          <p className="text-base leading-7 text-ink">
            {fallback === "failed" ? t("fallbackFailed") : t("fallbackMailClient")}{" "}
            {t.rich("fallbackTail", {
              email,
              mail: (chunks) => (
                <a className="font-semibold text-accent hover:underline" href={mailtoHref}>
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          aria-busy={pending ? true : undefined}
          className={tactileButtonClasses("primary", pending ? "opacity-70" : "")}
          disabled={pending}
          type="submit"
        >
          <span>{pending ? t("sending") : (submitLabel ?? t("submitLabel"))}</span>
          <span aria-hidden="true">
            {pending ? (
              <IconLoader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <IconArrowRight className="h-4 w-4" />
            )}
          </span>
        </button>
        <p className="type-body text-sm">
          {t.rich("mailNote", {
            email,
            mail: (chunks) => (
              <a className="font-semibold text-accent hover:underline" href={`mailto:${email}`}>
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </form>
  );
}
