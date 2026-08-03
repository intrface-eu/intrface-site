"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  type FormEvent,
} from "react";
import { IconArrowRight, IconLoader2 } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { tactileButtonClasses } from "@/components/site/tactile-button-classes";
import { submitContactForm, type ContactFieldName } from "@/app/actions/contact";
import { CONTACT_EMAIL } from "@/lib/site/config";

/*
 * Submitting posts to the `submitContactForm` server action, which stores the
 * message in Convex. When no Convex deployment is configured — or the write
 * fails — the form falls back to the visitor's mail client with the message
 * pre-filled, so the page works with no backend and no env var.
 *
 * The form carries `noValidate`: the fields keep `required` for assistive tech,
 * but the browser's own bubble is suppressed so the designed, translated error
 * states below are what a reader actually sees. The native message follows the
 * browser's locale, not the page's — a Croatian page would throw English.
 */

/**
 * Stable identities for the topic chips, in the order the `topics` prop carries
 * them. Labels are translated and cannot be matched on; `?topic=` matches these.
 * Changing the order here means changing the `topics` arrays in every message
 * file to match.
 *
 * The order also decides how the row wraps. A long label next to a short one
 * lands two chips per row at 390px in all four locales; the two long labels
 * adjacent pushes German, French and Croatian into three ragged rows.
 */
export const CONTACT_TOPIC_KEYS = [
  "business-system",
  "technical-strategy",
  "client-site",
  "civic-infrastructure",
] as const;

export type ContactTopicKey = (typeof CONTACT_TOPIC_KEYS)[number];

export type ContactFormProps = {
  /** Where the mailto lands. */
  email?: string;
  /** Selectable topic chips, already translated, ordered by `CONTACT_TOPIC_KEYS`. */
  topics: readonly string[];
  /** Label on the submit button. Defaults to the translated label. */
  submitLabel?: string;
  /** Stored with the submission so replies go out in the reader's language. */
  locale?: string;
  className?: string;
};

type FieldErrors = Partial<Record<ContactFieldName, string>>;

const fieldClasses =
  "w-full rounded-[var(--radius-md)] border border-rule-control bg-card px-4 py-3 text-base text-ink transition-colors placeholder:text-ink-muted/60 focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink aria-[invalid=true]:border-danger aria-[invalid=true]:focus:border-danger";

const labelClasses = "type-body-sm block max-w-none font-semibold text-ink";

const errorTextClasses = "text-sm font-medium leading-6 text-danger";

/** The URL is read once and never changes under us; nothing to subscribe to. */
const noSubscribe = () => () => {};

/**
 * The chip `?topic=` asks for, or none.
 *
 * The client-sites page sends people here with a topic already implied. Matched
 * against the stable key so it works in every locale, and read through
 * `useSyncExternalStore` rather than `useSearchParams` so the page hosting this
 * form is not pulled out of static rendering — the server snapshot is empty and
 * the client fills it in on hydration.
 */
function useRequestedTopic(): ContactTopicKey | "" {
  const search = useSyncExternalStore(
    noSubscribe,
    () => window.location.search,
    () => "",
  );

  return useMemo(() => {
    const requested = new URLSearchParams(search).get("topic");
    return CONTACT_TOPIC_KEYS.find((key) => key === requested) ?? "";
  }, [search]);
}

export function ContactForm({
  email = CONTACT_EMAIL,
  topics,
  submitLabel,
  locale,
  className = "",
}: ContactFormProps) {
  const t = useTranslations("ContactForm");
  const shouldReduceMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [company, setCompany] = useState("");
  // No chip is selected unless the URL asks for one. A filled pill sitting
  // under three empty fields reads as the submit control, and the topic is not
  // a required answer. `null` means "the reader has not chosen yet", so the
  // `?topic=` value still stands.
  const requestedTopic = useRequestedTopic();
  const [chosenTopic, setChosenTopic] = useState<ContactTopicKey | null>(null);
  const topicKey = chosenTopic ?? requestedTopic;
  const [message, setMessage] = useState("");

  const chips = useMemo(
    () => topics.map((label, index) => ({ key: CONTACT_TOPIC_KEYS[index], label })),
    [topics],
  );

  const topic = chips.find((chip) => chip.key === topicKey)?.label ?? "";

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

      // Only an unconfigured deployment hands the message to the mail client.
      // A transport failure remains on the page so the reader can see the error.
      if (result.status === "unconfigured") {
        setFallback("mail-client");
        window.location.href = href;
        return;
      }

      setFallback("failed");
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
          <p className="type-body mt-3 text-ink">{t("sentBody", { email })}</p>
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
    <form className={`grid gap-6 ${className}`} noValidate onSubmit={handleSubmit}>
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
          <span className="font-normal text-ink-muted">{t("companyOptional")}</span>
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
          {chips.map(({ key, label }) => (
            <label className="cursor-pointer" key={key}>
              <input
                checked={topicKey === key}
                className="peer sr-only"
                name="topic"
                onChange={() => setChosenTopic(key)}
                type="radio"
                value={label}
              />
              {/*
               * Selected reads as a marked chip, not a button: the accent
               * border and tint stay in the chip family instead of borrowing
               * the ink fill the submit control owns.
               */}
              <span className="block rounded-full border border-rule-control bg-white/70 px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                {label}
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
          <p className="type-body text-ink">
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
        {/*
         * The same treatment every other primary action gets. `TactileButton`
         * itself renders an anchor, and this one has to submit a form, so the
         * motion is mirrored here rather than faked with a link.
         */}
        <motion.button
          aria-busy={pending ? true : undefined}
          className={tactileButtonClasses("primary", pending ? "opacity-70" : "")}
          disabled={pending}
          type="submit"
          whileHover={shouldReduceMotion || pending ? undefined : { y: -2, scale: 1.015 }}
          whileTap={shouldReduceMotion || pending ? undefined : { scale: 0.975 }}
        >
          <span>{pending ? t("sending") : (submitLabel ?? t("submitLabel"))}</span>
          <span aria-hidden="true">
            {pending ? (
              <IconLoader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <IconArrowRight className="h-4 w-4" />
            )}
          </span>
        </motion.button>
        <p className="type-body-sm">
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
