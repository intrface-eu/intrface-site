export const navItems = [
  { label: "Overview", href: "/" },
  { label: "Philosophy", href: "/philosophy" },
  { label: "Product", href: "/product" },
  { label: "Learn", href: "/learn" },
  { label: "Consulting", href: "/consulting" },
  { label: "Install", href: "/install" },
] as const;

export const repositoryUrl = "https://github.com/basicalex/agent-ops-cockpit";

export const homepage = {
  highlights: [
    "aoc-init writes the agent rules into the repo's AGENTS.md",
    "aoc opens the project's Herdr workspace",
    "aoc-omp starts omp with the project's context attached",
    "aoc-memory-link gives each repo one memory folder",
  ],
  pillars: [
    {
      title: "Rules live in the repo",
      body: "aoc-init keeps a managed block in AGENTS.md and leaves your own lines under \"## Project rules\".",
    },
    {
      title: "Workers never commit",
      body: "The planning session reviews each worker's diff, runs the tests and makes the commit itself.",
    },
    {
      title: "One contract for every agent",
      body: "aoc-contract-install puts one communication contract in ~/.config/aoc: plain words, facts once, no filler.",
    },
  ],
  proof: [
    "The Claude policy and herdr-orchestrate skill in the repo are the ones Intrface runs on its own machines.",
    "aoc-dispatch takes GitHub issues labeled agent-ready one at a time, runs each in a Herdr pane, and labels the result for review.",
    "aoc-init deletes files left behind by tools AOC no longer ships.",
  ],
  audience: [
    {
      title: "Developers",
      body: "For people who want coding agents in the terminal, with rules and memory they can read as plain files.",
      cta: "/install",
    },
    {
      title: "Learners",
      body: "For people learning to split work between a planning model and the agents that write the code.",
      cta: "/learn",
    },
    {
      title: "Teams",
      body: "For teams that want written agent rules, reviewed diffs and one owner for every commit.",
      cta: "/consulting",
    },
  ],
} as const;

export const philosophyPoints = [
  {
    title: "Structure over prompt improvisation",
    body: "Coding with machines should be a workflow, not a string of disconnected requests. Rules, decisions and open work should outlast any one conversation.",
  },
  {
    title: "Context and memory are files",
    body: "Project rules live in AGENTS.md. Agent memory lives in ~/.aoc/memory/<repo>/. You can read, diff and edit both.",
  },
  {
    title: "The terminal is the control surface",
    body: "Herdr gives each agent its own pane and shows whether it is working or idle. Nothing hides behind a browser layer.",
  },
  {
    title: "Plan with one model, build with another",
    body: "The main Claude session plans, splits and reviews the work. omp workers write the code, so the strongest model spends its time on judgment.",
  },
] as const;

export const philosophyPrinciples = [
  "Human-machine coding should be strategic, not theatrical.",
  "Operator control matters more than feature spectacle.",
  "A serious workflow must survive across sessions, machines, and projects.",
] as const;

export const productSections = [
  {
    title: "Project rules",
    body: "aoc-init writes a managed block into AGENTS.md, keeps your lines under \"## Project rules\", and installs the omp extensions, skills and agents the repo's manifest selects.",
  },
  {
    title: "Workspace",
    body: "aoc opens or focuses the project's Herdr workspace. Herdr owns the tabs, panes and agent status. aoc services opens a second workspace for long-lived shells.",
  },
  {
    title: "Agents",
    body: "aoc-omp starts omp with a short context capsule from aoc-handshake. Inside an AOC project, plain omp does the same.",
  },
  {
    title: "Orchestration",
    body: "From Claude Code, the herdr-orchestrate skill sends written packets to omp workers in their own tabs. Inside omp, /master on runs the same idea with gated tools.",
  },
  {
    title: "Memory",
    body: "aoc-memory-link moves Claude Code's memory for a repo into ~/.aoc/memory/<repo>/ and links it back. Rerun it after moving the repo and it relinks.",
  },
  {
    title: "Harness setup",
    body: "aoc-claude-install writes the agent policy for Claude Code, the machine-wide ~/AGENTS.md, and a Codex config if none exists.",
  },
] as const;

export const productFlow = [
  "Run aoc-init in the repo to write the agent rules and install omp's tools.",
  "Run aoc to open the project's Herdr workspace.",
  "Plan in Claude Code; herdr-orchestrate hands each slice to an omp worker in its own tab.",
  "Review each diff, run the tests and commit from the planning session.",
] as const;

export const learnTracks = [
  "How a planning session splits work into packets with separate file scopes",
  "How AGENTS.md and a shared memory folder carry context between sessions",
  "Move from ad hoc prompting toward structured development workflows",
  "Adopt AOC as a practical learning environment rather than just a repo to skim",
] as const;

export const learnAudience = [
  "Solo developers moving beyond browser-chat coding",
  "Developers running Claude Code, omp or Codex side by side",
  "Teams who need a teachable model for agentic development practice",
] as const;

export const consultingOffers = [
  "Agentic coding workflow design",
  "Setting up Herdr, omp and Claude Code on a team's machines",
  "Writing agent rules and packet templates for your repos",
  "Training on the planner-and-workers flow",
] as const;

export const consultingOutcomes = [
  "A clearer operating model for how teams should work with coding agents",
  "Agent rules that live in your repos, not in someone's chat history",
  "Memory and context that carry over between sessions and machines",
] as const;

export const installSteps = [
  "Run the bootstrap script, or ./install.sh from a local clone.",
  "Run aoc-doctor and fix anything it marks required.",
  "In your project, run aoc-init.",
  "Run aoc to open the workspace, then code in the omp pane.",
] as const;

export const installNotes = [
  "AOC runs on Linux, macOS or WSL and needs Herdr, omp, Git and Bun.",
  "install.sh also copies the Claude policy and skills into ~/.claude; set AOC_CLAUDE_DIR to put them elsewhere.",
  "aoc-init adds project files without overwriting work already there.",
] as const;
