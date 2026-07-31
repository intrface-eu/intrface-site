import { RepoCard } from "@intrface/web";

export const OpenSource = () => (
  <RepoCard
    chips={["Apache-2.0", "Rust", "Command-line"]}
    label="Agent Ops Cockpit"
    summary="The rules our agents run under, the commands that run them, and the check in front of every change."
  />
);

export const Minimal = () => (
  <RepoCard
    label="Polis Interface"
    summary="Government data you can check: every claim resolves to a document, a seal, and a timestamp."
  />
);
