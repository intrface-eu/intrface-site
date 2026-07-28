export const typography = {
  family: {
    primary: '"Google Sans Flex", "Inter", "Segoe UI", sans-serif',
    mono: '"Geist Mono", "SFMono-Regular", monospace',
  },
  /** The role scale, top to bottom. See the table in root DESIGN.md. */
  roles: {
    display: "type-display",
    heading: "type-heading",
    subheading: "type-subheading",
    title: "type-title",
    bodyLg: "type-body-lg",
    body: "type-body",
    bodySm: "type-body-sm",
    caption: "type-caption",
    meta: "type-meta",
    sectionLabel: "type-section-label",
    data: "type-data",
  },
} as const;

export type TypographyRole = keyof typeof typography.roles;
