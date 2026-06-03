import type { VoyagerAgentId } from "@/lib/site/voyager/product-model";
import { AgentMarker } from "../primitives/agent-marker";

export type PublicAgent = {
  id: VoyagerAgentId;
  name: string;
  role: string;
  surface: string;
  summary: string;
  color: string;
};

export function AgentSystemGrid({ agents }: { agents: readonly PublicAgent[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {agents.map((agent) => (
        <article
          key={agent.id}
          className="group relative overflow-hidden rounded-2xl border border-rule bg-card p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-foreground/20"
          style={{ boxShadow: "var(--shadow-surface)" }}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-30"
            style={{ backgroundColor: agent.color }}
          />
          <div className="relative flex items-start justify-between gap-5">
            <div className="min-w-0 space-y-3">
              <p className="type-meta" style={{ color: agent.color }}>{agent.role}</p>
              <h3 className="text-3xl font-medium tracking-[-0.045em] text-foreground">{agent.name}</h3>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{agent.surface}</p>
            </div>
            <AgentMarker id={agent.id} className="h-16 w-14 shrink-0" />
          </div>
          <p className="type-body relative mt-6">{agent.summary}</p>
        </article>
      ))}
    </div>
  );
}
