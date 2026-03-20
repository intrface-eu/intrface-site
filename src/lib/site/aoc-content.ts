export const aocLinks = {
  github: "https://github.com/basicalex/agent-ops-cockpit",
  docs: "https://github.com/basicalex/agent-ops-cockpit/tree/main/docs",
  install:
    "https://raw.githubusercontent.com/basicalex/agent-ops-cockpit/main/install/bootstrap.sh",
} as const;

export const aocPainPoints = [
  "Lost context across sessions and tools",
  "Manual copy-pasting between chats, notes, and code",
  "No durable project memory for architectural decisions",
  "Fragmented workflow across terminal, file manager, and task tracking",
] as const;

export const aocArchitecture = [
  {
    title: "Context",
    path: ".aoc/context.md",
    description:
      "Reactive project facts and structure maps that keep the workspace aware of the repo it is operating inside.",
  },
  {
    title: "Memory",
    path: ".aoc/memory.md",
    description:
      "Persistent architectural memory that records decisions, constraints, and durable project knowledge over time.",
  },
  {
    title: "Tasks",
    path: "tasks.json / Taskmaster",
    description:
      "Dynamic work tracking with tags, subtasks, status, and terminal-native task operations for active execution.",
  },
] as const;

export const aocWorkspace = [
  "Yazi file manager",
  "PI agent runtime pane",
  "Taskmaster TUI",
  "Widget / utility panes",
  "Zellij-based layout foundation",
] as const;

export const aocCapabilities = [
  "PI-only runtime with persistent project awareness",
  "Native Taskmaster TUI for task and subtask management",
  "RLM tooling for large codebase analysis",
  "Agent skills for repeatable workflows",
  "Yazi integration for file navigation inside the cockpit",
  "Custom layouts and AOC modes for different operator needs",
  "Alt+C control pane for configuration and optional integrations",
] as const;

export const aocQuickStart = [
  "curl -fsSL https://raw.githubusercontent.com/basicalex/agent-ops-cockpit/main/install/bootstrap.sh | bash",
  "aoc-doctor",
  "cd ~/your-project && aoc",
] as const;

export const aocEvolution = [
  "Strengthen the workspace foundation around Zellij, PI, and Taskmaster",
  "Deepen context and memory systems for longer-running projects",
  "Refine the PI runtime and operator controls",
  "Expand skills, layouts, and large-codebase workflows",
] as const;
