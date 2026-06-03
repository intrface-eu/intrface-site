export const voyagerPalette = {
  ink: "#0F1B2B",
  shell: "#F7F0E8",
  shellDeep: "#EDE4D7",
  ivory: "#FFF9F0",
  slate: "#5F6B76",
  line: "rgba(15,27,43,0.11)",
  agency: "#F97316",
  business: "#0EA5E9",
  guardian: "#10B981",
  organization: "#E11D48",
  memory: "#8B5CF6",
} as const;

export const voyagerAgentColors = {
  voyager: voyagerPalette.agency,
  nexus: voyagerPalette.business,
  guardian: voyagerPalette.guardian,
  vita: voyagerPalette.organization,
} as const;
