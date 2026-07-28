import type { SVGProps } from "react";

type AnimatedMarkProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  /** Drawn size in px, written to width/height so the box is reserved before paint. */
  size?: number;
  /** Run the compose-on-mount entrance. Off for marks that sit below the fold. */
  animate?: boolean;
};

/**
 * The intrface mark, inlined so it costs no request and can take its colour
 * from `currentColor` on paper or on an ink band.
 *
 * Both shapes are closed fills, not outlines, so there is nothing to draw with
 * a stroke. The entrance instead turns each star into place and fades it in —
 * see `.brand-mark` in globals.css. Pure CSS, once per mount, no loop.
 */
export function AnimatedMark({ size = 26, animate = true, className, ...props }: AnimatedMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={["shrink-0", animate ? "brand-mark" : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      fill="currentColor"
      focusable="false"
      height={size}
      viewBox="0 0 1000 1000"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M500,0c0,276.14-223.86,500-500,500,276.14,0,500,223.86,500,500,0-276.14,223.86-500,500-500-276.14,0-500-223.86-500-500Z" />
      <path
        className="brand-mark__spark"
        d="M202.17,96.48c0,69.04-55.97,125-125,125,69.04,0,125,55.97,125,125,0-69.04,55.97-125,125-125-69.04,0-125-55.97-125-125Z"
      />
    </svg>
  );
}
