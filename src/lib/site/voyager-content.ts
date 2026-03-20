export const voyagerLinks = {
  contact: "mailto:hello@intrface.eu?subject=Voyager%20partnership",
  projects: "/#projects",
} as const;

export const voyagerAudience = [
  {
    title: "For destinations and agencies",
    text: "Voyager gives destination operators a platform for managing tourism content, discovery flows, and region-level visitor guidance.",
  },
  {
    title: "For businesses",
    text: "Businesses gain entity-specific service context, operational visibility, and AI assistance tied to their own presence inside the destination system.",
  },
  {
    title: "For travelers and scouts",
    text: "Travel becomes exploratory rather than passive through map-led discovery, location-aware guidance, and immersive attraction interactions.",
  },
] as const;

export const voyagerAgents = [
  {
    name: "Voyager",
    persona: "The Guide",
    domain: "Agencies",
    summary:
      "Regional guidance, itinerary support, and agency-level tourism intelligence for broad destination exploration.",
  },
  {
    name: "Nexus",
    persona: "The Concierge",
    domain: "Businesses",
    summary:
      "Business-specific service context for menus, reservations, and localized visitor interaction.",
  },
  {
    name: "Guardian",
    persona: "The Historian",
    domain: "Attractions",
    summary:
      "Attraction-focused context, cultural storytelling, and gamified Scout interactions for meaningful on-site engagement.",
  },
] as const;

export const voyagerScoutPillars = [
  "Gamified exploration built around Scout discovery",
  "Map, compass, and camera flows instead of static page browsing",
  "Location-aware interactions that make place part of the product logic",
  "A more meaningful travel experience than simple listings and recommendations",
] as const;

export const voyagerMapLayer = [
  "Unified map presets and geospatial configuration",
  "Attractions, businesses, and agencies represented as mapped entities",
  "Discovery and navigation workflows connected to user context",
  "Location-aware routing and activation for map- and agent-driven journeys",
] as const;

export const voyagerOperations = [
  "Multilingual content management with broad language coverage",
  "Scraping and ingestion workflows for tourism content discovery",
  "Role-aware operations for agencies, businesses, and admins",
  "B2B2C structure connecting operators with end-user exploration",
] as const;

export const voyagerStakeholders = [
  "Agencies",
  "Businesses",
  "Attractions",
  "Users / Scouts",
] as const;

export const voyagerProof = [
  {
    label: "Multi-agent architecture",
    text: "Voyager, Nexus, and Guardian are implemented as domain-specific agents with their own configuration, knowledge, and entity context.",
  },
  {
    label: "Route-aware context switching",
    text: "Agency, business, and attraction routes activate the relevant agent and keep chat behavior tied to entity context.",
  },
  {
    label: "Knowledge-aware system",
    text: "Scraped content is chunked, embedded, and retrieved through vector search so responses can draw from structured tourism information.",
  },
] as const;

export const voyagerTech = [
  "Next.js 15 + TypeScript",
  "Convex realtime backend and vector search",
  "WorkOS authentication",
  "Mastra + Gemini for agent orchestration",
  "next-intl multilingual support",
  "Scraper service for content ingestion",
] as const;
