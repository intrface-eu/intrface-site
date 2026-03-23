export const navItems = [
  { label: "Overview", href: "/" },
  { label: "Philosophy", href: "/philosophy" },
  { label: "Product", href: "/product" },
  { label: "Learn", href: "/learn" },
  { label: "Consulting", href: "/consulting" },
  { label: "Install", href: "/install" },
] as const;

export const homepage = {
  highlights: [
    "Terminal-first AI workspace",
    "Local-model friendly and low-overhead",
    "Structured, strategic agentic coding",
    "Built from lived daily development practice",
  ],
  pillars: [
    {
      title: "No messy GUIs",
      body: "AOC stays close to the terminal and the project itself, so the interface supports work instead of interrupting it.",
    },
    {
      title: "No online requirement",
      body: "AOC is compatible with local-first setups and can work with local models, giving developers more control over where and how they operate.",
    },
    {
      title: "No subscription logic",
      body: "The value is in the workflow, continuity, and operator discipline—not in locking serious coding behind cloud product mechanics.",
    },
  ],
  proof: [
    "Persistent project context, memory, and task state stored in-repo",
    "Zellij-based cockpit layout with Yazi, PI runtime, Pulse, and Taskmaster",
    "Built from real daily use as the development environment behind Intrface work",
  ],
  audience: [
    {
      title: "Developers",
      body: "For people who want agentic coding to feel strategic, structured, and grounded in the machine they actually control.",
      cta: "/install",
    },
    {
      title: "Learners",
      body: "For people who want to learn modern human-machine coding interaction through serious tooling rather than prompt theater.",
      cta: "/learn",
    },
    {
      title: "Teams",
      body: "For organizations exploring continuity, memory, operator control, and local-first adoption paths for coding agents.",
      cta: "/consulting",
    },
  ],
} as const;

export const philosophyPoints = [
  {
    title: "Structure over prompt improvisation",
    body: "AOC starts from the belief that coding with machines should be a workflow, not a string of disconnected requests. The system is designed so context, decisions, and active work survive beyond one interaction.",
  },
  {
    title: "Continuity as infrastructure",
    body: "Context, memory, and tasks are not side notes. They are core operating layers that keep the machine aligned with the project as work evolves.",
  },
  {
    title: "Terminal-native seriousness",
    body: "The terminal remains the strongest environment for disciplined development. AOC treats it as a control surface rather than something to be abstracted away behind a glossy GUI.",
  },
  {
    title: "Local-first compatibility",
    body: "Developers need freedom to work with local models, constrained hardware, and offline-friendly workflows. AOC is shaped to respect those realities instead of assuming cloud dependence.",
  },
] as const;

export const philosophyPrinciples = [
  "Human-machine coding should be strategic, not theatrical.",
  "Operator control matters more than feature spectacle.",
  "A serious workflow must survive across sessions, machines, and projects.",
] as const;

export const productSections = [
  {
    title: "Context",
    body: "AOC keeps reactive project facts and structure available through .aoc/context.md so the workspace remains project-aware.",
  },
  {
    title: "Memory",
    body: "Architectural decisions and durable project knowledge live in .aoc/memory.md instead of disappearing between sessions.",
  },
  {
    title: "Tasks",
    body: "Taskmaster gives AOC a native work-tracking surface inside the same cockpit as coding and file navigation.",
  },
  {
    title: "Runtime",
    body: "PI runs as the coding runtime inside a Zellij-based workspace alongside Yazi, Pulse, and operator controls.",
  },
] as const;

export const productFlow = [
  "Enter a project and launch AOC inside the repo itself.",
  "Navigate files in Yazi while the PI runtime stays project-aware in parallel.",
  "Track work through Taskmaster without losing the coding surface.",
  "Retain continuity through context and memory artifacts that live with the project.",
] as const;

export const learnTracks = [
  "Learn the terminal-first / local-first thesis behind serious agentic coding",
  "Understand how context, memory, and tasks create continuity",
  "Move from ad hoc prompting toward structured development workflows",
  "Adopt AOC as a practical learning environment rather than just a repo to skim",
] as const;

export const learnAudience = [
  "Solo developers moving beyond browser-chat coding",
  "Technical operators exploring local-first AI workflows",
  "Teams who need a teachable model for agentic development practice",
] as const;

export const consultingOffers = [
  "Agentic coding workflow design",
  "AOC-guided team enablement",
  "Local-first AI development setup strategy",
  "Operator training for structured human-machine collaboration",
] as const;

export const consultingOutcomes = [
  "A clearer operating model for how teams should work with coding agents",
  "Practical local-first and low-overhead adoption paths",
  "A stronger continuity layer around context, memory, and work tracking",
] as const;

export const installSteps = [
  "Run the bootstrap installer or use a local clone workflow from the AOC repository.",
  "Verify the environment with aoc-doctor.",
  "Start AOC inside a project and operate through Yazi, PI, and Taskmaster.",
  "Use Alt+C to configure optional integrations and operator controls.",
] as const;

export const installNotes = [
  "AOC is designed to work from normal machines, not only from premium cloud setups.",
  "The workflow remains useful whether you operate with local models or other supported runtime paths.",
  "The point is to begin serious coding quickly, with structure already in place.",
] as const;
