import { ContractLedger } from "@intrface/web";

export const OnDisk = () => (
  <ContractLedger
    artifacts={[
      { file: "AGENTS.md", description: "How agents work in this repository, and what they may not do." },
      { file: "DESIGN.md", description: "Tokens, type scale, component rules, and the do-not list." },
      { file: "context.md", description: "The current shape of the repository, generated and never hand-written." },
      { file: "tasks.json", description: "What is open, what is done, and who decided." },
    ]}
    title="The contract, on disk"
  />
);
