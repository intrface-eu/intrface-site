import {
  IconBrain,
  IconBuildingBank,
  IconCamera,
  IconCheck,
  IconCircleDot,
  IconCompass,
  IconFileText,
  IconMap2,
  IconRoute,
  IconSearch,
  IconTerminal2,
} from "@tabler/icons-react";

type ProductVariant = "voyager" | "funda" | "aoc";

type ProductArtifactProps = {
  variant: ProductVariant;
  compact?: boolean;
};

const productAccent: Record<ProductVariant, string> = {
  voyager: "#10b981",
  funda: "#e11d48",
  aoc: "#0ea5e9",
};

export function ProductArtifact({ variant, compact = false }: ProductArtifactProps) {
  if (variant === "voyager") {
    return <VoyagerArtifact compact={compact} />;
  }

  if (variant === "funda") {
    return <FundaArtifact compact={compact} />;
  }

  return <AocArtifact compact={compact} />;
}

export function ProductWorldsMosaic() {
  return (
    <div className="relative overflow-hidden rounded-[2.75rem] border border-black/10 bg-white/60 p-3 shadow-[0_45px_120px_-70px_rgba(15,23,41,.55)] sm:p-4">
      <div className="pointer-events-none absolute inset-0 halftone-field opacity-45 [--halftone-color:var(--intrface-ink)] [--halftone-size:30px]" data-drift="true" aria-hidden="true" />
      <div className="relative grid gap-3 lg:grid-cols-[1.05fr_.95fr]">
        <ProductArtifact variant="voyager" compact />
        <div className="grid gap-3">
          <ProductArtifact variant="funda" compact />
          <ProductArtifact variant="aoc" compact />
        </div>
      </div>
      <div className="pointer-events-none absolute left-[44%] top-[45%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-950/10" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[44%] top-[45%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-950/6" aria-hidden="true" />
    </div>
  );
}

export function CapabilityConstellation() {
  const capabilities = [
    { label: "AI agents", icon: IconBrain, tone: "text-emerald-700" },
    { label: "Realtime workflow", icon: IconRoute, tone: "text-rose-700" },
    { label: "Search + memory", icon: IconSearch, tone: "text-sky-700" },
    { label: "Geospatial layers", icon: IconMap2, tone: "text-emerald-700" },
    { label: "Role-aware ops", icon: IconBuildingBank, tone: "text-rose-700" },
    { label: "Operator tooling", icon: IconTerminal2, tone: "text-sky-700" },
  ] as const;

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-black/10 bg-white/70 p-5 shadow-[0_30px_90px_-62px_rgba(15,23,41,.5)]">
      <div className="pointer-events-none absolute inset-0 halftone-field opacity-35 [--halftone-color:var(--intrface-ink)] [--halftone-size:28px]" aria-hidden="true" />
      <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability) => {
          const Icon = capability.icon;
          return (
            <div key={capability.label} className="artifact-card rounded-[1.5rem] p-5">
              <Icon className={`h-5 w-5 ${capability.tone}`} />
              <p className="mt-4 text-sm font-semibold tracking-[-.02em] text-slate-950">{capability.label}</p>
              <div className="mt-3 h-1.5 rounded-full bg-slate-950/8">
                <div className="h-full w-2/3 rounded-full bg-current opacity-35" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function VoyagerArtifact({ compact = false }: { compact?: boolean }) {
  return (
    <div className="surface-artifact relative min-h-[18rem] overflow-hidden rounded-[2rem] p-5 [--artifact-accent:#10b981] [--halftone-color:#065f46] [--ripple-color:#10b981]">
      <ArtifactBackplate />
      <div className="relative h-full rounded-[1.5rem] border border-emerald-950/10 bg-white/62 p-4">
        <div className="absolute inset-4 rounded-[999px] border border-emerald-700/20" />
        <div className="absolute inset-10 rounded-[999px] border border-dashed border-emerald-700/20" />
        <span className="ripple-ring left-[18%] top-[33%] h-24 w-24" data-pulse="true" />
        <span className="ripple-ring left-[18%] top-[33%] h-36 w-36" data-pulse="true" data-delay="1" />
        <div className="absolute left-[20%] top-[39%] flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-emerald-600 text-white shadow-lg">
          <IconCircleDot className="h-5 w-5" />
        </div>
        <div className="absolute right-6 top-6 rounded-full bg-amber-500/12 px-3 py-1 text-xs font-semibold text-amber-800">culture signal</div>
        <div className="absolute bottom-6 left-6 grid gap-2 text-xs font-semibold text-emerald-950">
          {(compact ? ["places", "events"] : ["scout", "map", "agents"]).map((item) => <span key={item} className="rounded-full border border-emerald-950/10 bg-white/75 px-3 py-1">{item}</span>)}
        </div>
        <div className="absolute bottom-6 right-6 rounded-2xl border border-emerald-950/10 bg-white/85 p-3 text-xs text-emerald-950 shadow-sm">
          <div className="flex items-center gap-2 font-semibold"><IconMap2 className="h-4 w-4 text-emerald-700" /> live atlas</div>
          {!compact ? <p className="mt-2 max-w-36 text-emerald-950/70">layered city intelligence with agent routing</p> : null}
        </div>
      </div>
    </div>
  );
}

export function FundaArtifact({ compact = false }: { compact?: boolean }) {
  const rows = ["Eligibility", "Documents", "Deadline", "Review"] as const;

  return (
    <div className="surface-artifact relative min-h-[18rem] overflow-hidden rounded-[2rem] p-5 [--artifact-accent:#e11d48] [--halftone-color:#9f1239] [--ripple-color:#e11d48]">
      <ArtifactBackplate />
      <div className="relative grid h-full gap-3 rounded-[1.5rem] border border-rose-950/10 bg-white/68 p-4 sm:grid-cols-[1fr_.72fr]">
        <div className="rounded-[1.25rem] border border-rose-950/10 bg-[#fffaf7] p-4">
          <div className="flex items-center justify-between border-b border-rose-950/10 pb-3">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-rose-700">match rank</p>
            <span className="rounded-full bg-rose-600/10 px-3 py-1 text-xs font-semibold text-rose-700">92%</span>
          </div>
          <div className="mt-4 space-y-3">
            {[78, 63, 88].map((width, index) => (
              <div key={width} className="rounded-2xl border border-rose-950/8 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <IconBuildingBank className="h-4 w-4 text-rose-700" />
                  <div className="h-2 flex-1 rounded-full bg-rose-950/10">
                    <div className="h-full rounded-full bg-rose-600/45" style={{ width: `${width}%` }} />
                  </div>
                </div>
                {!compact && index === 0 ? <p className="mt-2 text-xs text-rose-950/62">grant fit + eligibility evidence</p> : null}
              </div>
            ))}
          </div>
        </div>
        <div className="relative space-y-2">
          <span className="ripple-ring left-4 top-12 h-24 w-24" data-pulse="true" />
          {rows.map((row, index) => (
            <div key={row} className="relative flex items-center gap-2 rounded-xl border border-rose-950/10 bg-white/82 px-3 py-2 text-xs font-semibold text-rose-950 shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600/10 text-rose-700">{index + 1}</span>
              {row}
            </div>
          ))}
          <div className="rounded-xl border border-rose-950/10 bg-rose-600/10 px-3 py-3 text-xs font-semibold text-rose-800">workflow ready</div>
        </div>
      </div>
    </div>
  );
}

export function AocArtifact({ compact = false }: { compact?: boolean }) {
  const panes = ["context.md", "memory", "tasks", "repo"] as const;

  return (
    <div className="surface-artifact-dark relative min-h-[18rem] overflow-hidden rounded-[2rem] p-5 text-white [--artifact-accent:#0ea5e9] [--halftone-color:#7dd3fc] [--ripple-color:#38bdf8]">
      <div className="pointer-events-none absolute inset-0 halftone-field opacity-20 [--halftone-size:22px]" data-drift="true" aria-hidden="true" />
      <span className="ripple-ring right-10 top-8 h-28 w-28" data-pulse="true" />
      <span className="ripple-ring right-10 top-8 h-44 w-44" data-pulse="true" data-delay="1" />
      <div className="relative grid h-full gap-3 rounded-[1.5rem] border border-white/10 bg-white/[.05] p-3 sm:grid-cols-[.82fr_1.18fr]">
        <div className="rounded-[1.15rem] border border-sky-300/20 bg-black/35 p-4 font-mono text-xs text-sky-100">
          <p className="text-sky-300">$ aoc</p>
          <p className="mt-4 text-white/70">loading context...</p>
          <p className="text-white/70">syncing tasks...</p>
          <p className="text-emerald-300">ready</p>
          {!compact ? <p className="mt-5 text-white/45">agent ops cockpit</p> : null}
        </div>
        <div className="grid gap-2">
          {panes.map((pane, index) => (
            <div key={pane} className="rounded-xl border border-white/10 bg-white/[.07] px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-white/82"><IconFileText className="h-4 w-4 text-sky-300" /> {pane}</span>
                <span className="h-1.5 w-10 rounded-full bg-sky-300/35" />
              </div>
              {!compact && index === 0 ? <p className="mt-2 text-xs text-white/48">persistent project state for coding agents</p> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScoutJourneyArtifact() {
  const steps = [
    { label: "Map", icon: IconMap2 },
    { label: "Compass", icon: IconCompass },
    { label: "Camera", icon: IconCamera },
    { label: "Agent", icon: IconBrain },
  ] as const;

  return (
    <div className="surface-artifact rounded-[2rem] p-5 [--artifact-accent:#10b981] [--ripple-color:#10b981]">
      <div className="grid gap-3 sm:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="relative rounded-[1.25rem] border border-emerald-950/10 bg-white/70 p-4">
              {index < steps.length - 1 ? <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-emerald-700/25 sm:block" /> : null}
              <Icon className="h-6 w-6 text-emerald-700" />
              <p className="mt-4 text-sm font-semibold text-emerald-950">{step.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RoleMapArtifact({ roles }: { roles: readonly string[] }) {
  return (
    <div className="surface-artifact relative overflow-hidden rounded-[2rem] p-5 [--artifact-accent:#e11d48] [--ripple-color:#e11d48]">
      <div className="pointer-events-none absolute inset-0 halftone-field opacity-35 [--halftone-color:#9f1239] [--halftone-size:26px]" aria-hidden="true" />
      <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role, index) => (
          <div key={role} className="artifact-card rounded-[1.35rem] p-4 [--artifact-accent:#e11d48]">
            <div className="flex items-center gap-2 text-sm font-semibold text-rose-950">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600/10 text-xs text-rose-700">{index + 1}</span>
              {role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TerminalFlowArtifact() {
  const layers = ["context", "memory", "tasks"] as const;

  return (
    <div className="surface-artifact-dark rounded-[2rem] p-5 [--artifact-accent:#0ea5e9] [--ripple-color:#38bdf8]">
      <div className="grid gap-4 lg:grid-cols-[.95fr_1.05fr]">
        <div className="rounded-[1.25rem] border border-white/10 bg-black/40 p-4 font-mono text-xs text-white/72">
          <p className="text-sky-300">$ aoc-stm handoff</p>
          <p className="mt-3">archived current draft</p>
          <p className="text-emerald-300">handoff snapshot ready</p>
          <p className="mt-4 text-sky-300">$ tm list</p>
          <p>next task promoted</p>
        </div>
        <div className="grid gap-3">
          {layers.map((layer) => (
            <div key={layer} className="rounded-[1.15rem] border border-white/10 bg-white/[.07] p-4">
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                {layer}
                <IconCheck className="h-4 w-4 text-emerald-300" />
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-sky-300/45" /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArtifactBackplate() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 halftone-field opacity-35 [--halftone-size:24px]" data-drift="true" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/50 blur-2xl" aria-hidden="true" />
    </>
  );
}

export { productAccent };
