import type { CSSProperties, HTMLAttributes } from "react";

type AnimatedMarkProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Drawn size in px, written to the box so the space is reserved before paint. */
  size?: number;
  /** Run the compose entrance and the ambient tilt. Off for marks below the fold. */
  animate?: boolean;
};

const BIG_STAR_PATH =
  "M500,0c0,276.14-223.86,500-500,500,276.14,0,500,223.86,500,500,0-276.14,223.86-500,500-500-276.14,0-500-223.86-500-500Z";

const SMALL_STAR_PATH =
  "M202.17,96.48c0,69.04-55.97,125-125,125,69.04,0,125,55.97,125,125,0-69.04,55.97-125,125-125-69.04,0-125-55.97-125-125Z";

/**
 * The intrface mark, inlined so it costs no request and can take its colour
 * from `currentColor` on paper or on an ink band.
 *
 * Each star gets its own stack of wrappers — interaction, ambient, entrance —
 * so the three layers of motion compose instead of overwriting one another.
 * All of it is CSS; see `.brand-mark` in globals.css. Nothing branches on the
 * client, so the server markup is the same for every visitor.
 */
export function AnimatedMark({
  size = 26,
  animate = true,
  className,
  style,
  ...props
}: AnimatedMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={["brand-mark", "shrink-0", animate ? "" : "brand-mark--static", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      style={{ ...style, "--bm-size": `${size}px` } as CSSProperties}
      {...props}
    >
      <span className="brand-mark__star">
        <span className="brand-mark__star-tilt">
          <span className="brand-mark__star-enter">
            <svg className="brand-mark__glyph" viewBox="0 0 1000 1000">
              <path d={BIG_STAR_PATH} />
            </svg>
          </span>
        </span>
      </span>

      <span className="brand-mark__spark">
        <span className="brand-mark__spark-tilt">
          <span className="brand-mark__spark-enter">
            <svg className="brand-mark__glyph" viewBox="0 0 1000 1000">
              <path d={SMALL_STAR_PATH} />
            </svg>
          </span>
        </span>
      </span>
    </span>
  );
}
