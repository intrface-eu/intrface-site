import { TactileButton } from "@intrface/web";

/**
 * Icons come in as nodes, so a preview can pass a bare SVG. Importing them
 * from the icon package's barrel here would pull several thousand modules
 * into the preview build — the components import them by name instead.
 */
const ArrowRight = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Primary = () => (
  <TactileButton href="/work" trailingIcon={<ArrowRight />}>
    See where each system stands
  </TactileButton>
);

export const Secondary = () => (
  <TactileButton href="#contact" variant="secondary">
    Start a system review
  </TactileButton>
);

export const Loading = () => (
  <TactileButton href="#contact" loading>
    Sending the message
  </TactileButton>
);
