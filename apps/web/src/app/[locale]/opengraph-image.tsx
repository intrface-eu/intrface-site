import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { SITE_TAGLINE, SITE_URL } from "@/lib/site/config";
import { SHARE_CARD_ALT, SHARE_CARD_SIZE } from "@/lib/site/metadata";

export const alt = SHARE_CARD_ALT;
export const size = SHARE_CARD_SIZE;
export const contentType = "image/png";

/* Tokens, copied from globals.css because a generated image cannot read CSS
   variables. Keep them in step with the `:root` block there. */
const PAPER = "#f5f1eb";
const INK = "#0f1729";
const INK_MUTED = "#47536b";
const ACCENT = "#0f766e";
const LINE = "rgba(15, 23, 41, 0.12)";

/** The intrface mark, verbatim from `public/brand/intrface-icon.svg`. */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="M500,0c0,276.14-223.86,500-500,500,276.14,0,500,223.86,500,500,0-276.14,223.86-500,500-500-276.14,0-500-223.86-500-500Z" fill="${INK}"/><path d="M202.17,96.48c0,69.04-55.97,125-125,125,69.04,0,125,55.97,125,125,0-69.04,55.97-125,125-125-69.04,0-125-55.97-125-125Z" fill="${INK}"/></svg>`;

/**
 * The hero's halftone field, rebuilt as a flat SVG: the same four inks and the
 * same corner falloff as `.halftone-field` in globals.css, minus the drift
 * animation. Drawn as one image rather than a few hundred divs so the render
 * stays cheap.
 */
const HALFTONE = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="470" viewBox="0 0 700 470">
<defs>
<pattern id="c" width="21" height="21" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="2.3" fill="rgb(2,132,199)" fill-opacity=".7"/></pattern>
<pattern id="m" width="27" height="27" patternUnits="userSpaceOnUse"><circle cx="14" cy="11" r="2.3" fill="rgb(219,39,119)" fill-opacity=".6"/></pattern>
<pattern id="y" width="33" height="33" patternUnits="userSpaceOnUse"><circle cx="10" cy="21" r="2.5" fill="rgb(202,138,4)" fill-opacity=".7"/></pattern>
<pattern id="k" width="19" height="19" patternUnits="userSpaceOnUse"><circle cx="11" cy="8" r="3.2" fill="${INK}" fill-opacity=".75"/></pattern>
<radialGradient id="fade" cx="0.8" cy="0.2" r="0.68">
<stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="0.42" stop-color="#fff" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
</radialGradient>
<radialGradient id="fadeK" cx="0.84" cy="0.15" r="0.42">
<stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.4"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
</radialGradient>
<mask id="mA"><rect width="700" height="470" fill="url(#fade)"/></mask>
<mask id="mB"><rect width="700" height="470" fill="url(#fadeK)"/></mask>
</defs>
<g mask="url(#mA)"><rect width="700" height="470" fill="url(#c)"/><rect width="700" height="470" fill="url(#m)"/><rect width="700" height="470" fill="url(#y)"/></g>
<g mask="url(#mB)"><rect width="700" height="470" fill="url(#k)"/></g>
</svg>`;

const dataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\n/g, ""))}`;

/**
 * The share card.
 *
 * Composition: the three marks the site itself opens with — warm paper, the
 * intrface mark over a teal accent rule, and the CMYK halftone corner field —
 * carrying nothing but the wordmark, the positioning line the metadata already
 * uses, and the domain, so the card makes no claim the site does not.
 *
 * Type: satori needs TTF/OTF/WOFF font data, and this repo's brand face
 * (Google Sans Flex, via next/font) exists only as WOFF2, which satori cannot
 * parse. Rather than ship a broken render the card falls back to Geist
 * Regular, the face bundled with `next/og` — a neighbouring grotesque. Weight
 * therefore does no work here; hierarchy comes from size, colour and tracking.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active: AppLocale = routing.locales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : routing.defaultLocale;

  let tagline = SITE_TAGLINE;
  try {
    const t = await getTranslations({ locale: active, namespace: "Metadata" });
    tagline = t("tagline");
  } catch {
    // Keep the English line rather than render an empty card.
  }

  const domain = SITE_URL.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: "72px 76px",
          position: "relative",
        }}
      >
        <img
          alt=""
          height={470}
          src={dataUri(HALFTONE)}
          style={{ position: "absolute", top: -80, right: -50 }}
          width={700}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img alt="" height={46} src={dataUri(MARK)} width={46} />
          <div style={{ fontSize: 46, letterSpacing: "-0.04em", color: INK }}>intrface</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 104, height: 3, background: ACCENT, marginBottom: 34 }} />
          <div
            style={{
              display: "flex",
              fontSize: 54,
              lineHeight: 1.18,
              letterSpacing: "-0.03em",
              color: INK,
              maxWidth: 940,
            }}
          >
            {tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 26,
            fontSize: 22,
            letterSpacing: "0.13em",
            color: INK_MUTED,
          }}
        >
          <div style={{ display: "flex" }}>{domain.toUpperCase()}</div>
        </div>
      </div>
    ),
    size,
  );
}
