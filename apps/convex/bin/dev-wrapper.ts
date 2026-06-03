#!/usr/bin/env bun
/**
 * Convex dev wrapper — gracefully handles missing project configuration.
 *
 * If no convex project is linked, prints a helpful message instead of
 * hanging on interactive setup inside the Turborepo TUI.
 */

import { existsSync } from "fs";
import { spawn } from "child_process";

const convexJson = "./convex.json";
const hasDeployKey = process.env.CONVEX_DEPLOY_KEY;

if (!existsSync(convexJson) && !hasDeployKey) {
  console.log("⚡  Convex backend not yet configured.");
  console.log("");
  console.log("   To set up:");
  console.log("   1. bunx convex login");
  console.log("   2. bunx convex dev (interactive setup)");
  console.log("   3. Then run bun dev to start all services together");
  console.log("");
  process.exit(0);
}

const child = spawn("bunx", ["convex", "dev"], {
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
