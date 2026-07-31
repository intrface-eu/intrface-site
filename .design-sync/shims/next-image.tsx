/**
 * Stands in for `next/image` when the components are bundled outside Next.
 *
 * The real component needs the Next image loader and its runtime config; in a
 * preview card or a design built with this system there is neither, so it
 * renders a plain `<img>` and drops the props that only mean something to the
 * optimizer (`priority`, `sizes`, `quality`, `placeholder`, `loader`). Layout
 * props are preserved, because they are what the surrounding CSS reacts to.
 */
import type { CSSProperties, ImgHTMLAttributes } from "react";

type NextImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  src: string | { src: string; width?: number; height?: number };
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: string;
  blurDataURL?: string;
  loader?: unknown;
  unoptimized?: boolean;
};

export default function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority: _priority,
  quality: _quality,
  sizes: _sizes,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  loader: _loader,
  unoptimized: _unoptimized,
  style,
  ...rest
}: NextImageProps) {
  const resolved = typeof src === "string" ? src : src.src;
  const fillStyle: CSSProperties | undefined = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
    : undefined;

  return (
    // biome-ignore lint/a11y/useAltText: alt comes through from the caller
    <img
      {...rest}
      alt={alt}
      height={fill ? undefined : height}
      src={resolved}
      style={{ ...fillStyle, ...style }}
      width={fill ? undefined : width}
    />
  );
}
