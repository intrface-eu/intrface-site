import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/** A capture of one of our interfaces, as it runs. */
export type Screen = {
  src: string;
  alt: string;
};

/** Desktop captures are 1440 × 900 at 2x; phone captures 390 × 844 at 2x. */
const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

/** The live state beside the name: a dot and a word. */
export function InterfaceStatus({ children, tone = "live" }: { children: ReactNode; tone?: "live" | "test" | "soon" }) {
  return (
    <span className="iface-status" data-tone={tone}>
      <span aria-hidden="true" className="iface-status__dot" />
      {children}
    </span>
  );
}

/**
 * The desktop screen with the phone over its near corner. The desktop shows
 * the product's face, the phone the product in use (the Voyager atlas, the
 * AgroPulse grove, the Polis report), so the two are never the same page.
 */
export function InterfaceFigure({
  desktop,
  phone,
  priority = false,
  sizes = "(min-width: 1024px) 64vw, 100vw",
}: {
  desktop: Screen;
  phone?: Screen;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className="iface-figure">
      <div className="iface-screen">
        <Image
          {...DESKTOP}
          alt={desktop.alt}
          className="iface-screen__image"
          preload={priority}
          sizes={sizes}
          src={desktop.src}
        />
      </div>
      {phone ? (
        <div className="iface-phone">
          <Image
            {...PHONE}
            alt={phone.alt}
            className="iface-phone__image"
            preload={priority}
            sizes="(min-width: 1024px) 15vw, 36vw"
            src={phone.src}
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * One interface, large, on open paper: the screens take most of the width
 * and run off the page edge on their side; the name, the status, one line
 * and the way in sit in a narrow column beside them. `side` is where the
 * screens go. `lead` sets the screens across the full width with the text
 * under them, for the first row on a page. `figure` replaces the desktop and
 * phone pair when a row shows something else, such as two client sites.
 */
export function InterfaceRow({
  heading,
  status,
  line,
  actions,
  desktop,
  phone,
  figure,
  side = "end",
  lead = false,
  priority = false,
  id,
  style,
}: {
  heading: ReactNode;
  status?: ReactNode;
  line: ReactNode;
  actions?: ReactNode;
  desktop?: Screen;
  phone?: Screen;
  figure?: ReactNode;
  side?: "start" | "end";
  lead?: boolean;
  priority?: boolean;
  id?: string;
  style?: CSSProperties;
}) {
  return (
    <article className="iface-row" data-lead={lead ? "" : undefined} data-side={side} id={id} style={style}>
      <div className="iface-row__figure">
        {figure ??
          (desktop ? (
            <InterfaceFigure
              desktop={desktop}
              phone={phone}
              priority={priority}
              sizes={lead ? "(min-width: 1024px) 84vw, 100vw" : undefined}
            />
          ) : null)}
      </div>
      <div className="iface-row__text">
        <div className="iface-row__title">
          {heading}
          {status}
        </div>
        <div className="iface-row__body">
          <p className="type-body-lg iface-row__line">{line}</p>
          {actions ? <div className="iface-row__actions">{actions}</div> : null}
        </div>
      </div>
    </article>
  );
}

/**
 * Two live sites, the second lower and over the first from 1024px; side by
 * side below. Each screen links to its site.
 */
export function InterfaceDuo({
  shots,
  className = "",
}: {
  shots: readonly (Screen & { href: string })[];
  className?: string;
}) {
  return (
    <div className={`iface-duo ${className}`}>
      {shots.map(({ href, src, alt }) => (
        <a className="iface-screen iface-duo__shot" href={href} key={href}>
          <Image
            {...DESKTOP}
            alt={alt}
            className="iface-screen__image"
            sizes="(min-width: 1024px) 34vw, 50vw"
            src={src}
          />
        </a>
      ))}
    </div>
  );
}
