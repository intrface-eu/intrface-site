export type TactileButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<TactileButtonVariant, string> = {
  primary: "bg-ink text-white shadow-xl",
  secondary: "artifact-button-secondary border border-rule bg-white/70 text-ink hover:bg-white",
  ghost: "text-ink hover:bg-ink/5",
};

/**
 * The button look, without the anchor. Use it for the rare real `<button>` —
 * a form submit — or for a server-rendered `<a>`/`<Link>`.
 *
 * It lives outside `tactile-button.tsx` on purpose: that file is a client module,
 * and a server component cannot call a function exported from one.
 */
export function tactileButtonClasses(variant: TactileButtonVariant = "primary", className = "") {
  return `artifact-button inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${variantClasses[variant]} ${className}`;
}
