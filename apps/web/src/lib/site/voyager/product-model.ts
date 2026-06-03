export type VoyagerAgentId = "voyager" | "nexus" | "guardian" | "vita";

export type VoyagerAgentDefinition = {
  id: VoyagerAgentId;
  name: string;
  role: string;
  surface: string;
  color: string;
};

export const voyagerAgents = [
  {
    id: "voyager",
    name: "Voyager",
    role: "Destination Guide",
    surface: "Agencies / cities / regions",
    color: "#F97316",
  },
  {
    id: "nexus",
    name: "Nexus",
    role: "Business Concierge",
    surface: "Businesses / venues",
    color: "#0EA5E9",
  },
  {
    id: "guardian",
    name: "Guardian",
    role: "Cultural Historian",
    surface: "Attractions / landmarks",
    color: "#10B981",
  },
  {
    id: "vita",
    name: "Vita",
    role: "Community Specialist",
    surface: "Organizations / communities / events",
    color: "#E11D48",
  },
] as const satisfies readonly VoyagerAgentDefinition[];

export const voyagerStakeholderSurfaces = [
  "Agencies",
  "Businesses",
  "Attractions",
  "Organizations",
  "Users / Scouts",
] as const;
