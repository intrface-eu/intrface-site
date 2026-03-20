export const typography = {
  family: {
    primary: '"Google Sans Flex", "Inter", "Segoe UI", sans-serif',
    mono: '"Geist Mono", "SFMono-Regular", monospace',
  },
  roles: {
    display: "type-display",
    heading: "type-heading",
    sectionLabel: "type-section-label",
    bodyLg: "type-body-lg",
    body: "type-body",
    meta: "type-meta",
  },
} as const;

export type TypographyRole = keyof typeof typography.roles;
