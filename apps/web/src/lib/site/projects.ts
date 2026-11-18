export type ProjectKey = "velum" | "voyager";

type Project = {
  name: string;
  href: string;
  liveUrl: string;
  desktop: string;
  detail: string;
  mobile: string;
};

/** Only public, owner-approved projects belong in this screenshot collection. */
export const PROJECTS: Record<ProjectKey, Project> = {
  velum: {
    name: "Velum",
    href: "/work/velum",
    liveUrl: "https://velum-winebar.com",
    desktop: "/proof/projects/velum/desktop.webp",
    detail: "/proof/projects/velum/detail.webp",
    mobile: "/proof/projects/velum/mobile.webp",
  },
  voyager: {
    name: "Voyager",
    href: "/work/voyager",
    liveUrl: "https://voyager.intrface.eu",
    desktop: "/proof/projects/voyager/desktop-2026-09-26.webp",
    detail: "/proof/projects/voyager/detail.webp",
    mobile: "/proof/projects/voyager/mobile-2026-09-26.webp",
  },
};

export const SELECTED_PROJECTS = ["velum", "voyager"] as const;
export const CLIENT_PROJECTS = ["velum"] as const;
export const DESKTOP_CAPTURE = { width: 1440, height: 1000 };
export const MOBILE_CAPTURE = { width: 390, height: 844 };
