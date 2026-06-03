import type { VoyagerAgentId } from "@/lib/site/voyager/product-model";
import { voyagerAgentColors, voyagerPalette } from "./voyager-tokens";

const labels: Record<VoyagerAgentId, string> = {
  voyager: "Destination agent marker",
  nexus: "Business agent marker",
  guardian: "Attraction agent marker",
  vita: "Organization agent marker",
};

export function AgentMarker({ id, className }: { id: VoyagerAgentId; className?: string }) {
  const color = voyagerAgentColors[id];

  return (
    <svg viewBox="0 0 120 136" role="img" aria-label={labels[id]} className={className} fill="none">
      <path
        d="M60 12c-24.3 0-44 19.7-44 44 0 30.2 31.4 55.9 39.5 72.1a5 5 0 0 0 9 0C72.6 111.9 104 86.2 104 56c0-24.3-19.7-44-44-44Z"
        fill={color}
      />
      <circle cx="60" cy="56" r="25" fill={voyagerPalette.ivory} />
      <circle cx="60" cy="56" r="11" fill={color} opacity="0.86" />
      <circle cx="60" cy="56" r="38" stroke={color} strokeOpacity="0.18" strokeWidth="10" />
      <circle cx="60" cy="56" r="46" stroke={color} strokeOpacity="0.22" strokeWidth="3" strokeDasharray="7 9" />
    </svg>
  );
}
