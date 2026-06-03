import { voyagerAgents } from "@/lib/site/voyager/product-model";
import { AgentMarker } from "../primitives/agent-marker";

const layerLabels = ["Place graph", "Civic layer", "Business layer", "Cultural layer", "Community layer", "Scout memory"];

export function AtlasLayerStack() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-rule bg-card p-5" style={{ boxShadow: "var(--shadow-elevated)" }}>
      <div className="absolute inset-0 opacity-70" aria-hidden="true" style={{ background: "radial-gradient(circle at 22% 18%, rgba(249,115,22,0.16), transparent 32%), radial-gradient(circle at 74% 24%, rgba(14,165,233,0.14), transparent 30%), radial-gradient(circle at 62% 78%, rgba(225,29,72,0.12), transparent 34%)" }} />
      <div className="relative aspect-[16/11] overflow-hidden rounded-[1.25rem] border border-rule bg-panel">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(15,27,43,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(15,27,43,0.055) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute left-[10%] top-[20%] h-[50%] w-[64%] -rotate-6 rounded-[2rem] border border-foreground/10 bg-background/70 shadow-sm" />
        <div className="absolute left-[17%] top-[27%] h-[48%] w-[64%] -rotate-3 rounded-[2rem] border border-foreground/10 bg-card/78 shadow-sm" />
        <div className="absolute left-[24%] top-[34%] h-[46%] w-[64%] rounded-[2rem] border border-foreground/10 bg-background/82 shadow-sm" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 440" fill="none" aria-hidden="true">
          <path d="M92 298 C 160 222, 236 250, 303 180 S 442 120, 548 184" stroke="#0F1B2B" strokeOpacity="0.22" strokeWidth="3" strokeDasharray="8 10" strokeLinecap="round" />
          <path d="M126 118 C 212 98, 256 142, 322 124 C 404 102, 478 86, 534 132" stroke="#8B5CF6" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="absolute left-[18%] top-[36%]"><AgentMarker id="voyager" className="h-16 w-14" /></div>
        <div className="absolute left-[46%] top-[25%]"><AgentMarker id="nexus" className="h-16 w-14" /></div>
        <div className="absolute left-[62%] top-[44%]"><AgentMarker id="guardian" className="h-16 w-14" /></div>
        <div className="absolute left-[36%] top-[58%]"><AgentMarker id="vita" className="h-16 w-14" /></div>
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {layerLabels.map((label) => (
            <div key={label} className="rounded-full border border-rule bg-card/80 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted backdrop-blur">{label}</div>
          ))}
        </div>
      </div>
      <div className="relative mt-4 grid gap-2 sm:grid-cols-4">
        {voyagerAgents.map((agent) => (
          <div key={agent.id} className="rounded-xl border border-rule bg-background px-3 py-2">
            <p className="text-xs font-semibold" style={{ color: agent.color }}>{agent.name}</p>
            <p className="mt-0.5 text-[0.68rem] uppercase tracking-[0.12em] text-muted">{agent.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
