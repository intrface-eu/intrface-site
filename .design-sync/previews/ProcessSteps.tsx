import { ProcessSteps } from "@intrface/web";

export const Engagement = () => (
  <ProcessSteps
    steps={[
      {
        label: "Map what runs today",
        description: "We read the system you already have and write down what it does, in plain words.",
        status: "complete",
      },
      {
        label: "Scope one slice",
        description: "The smallest change that pays for itself, written as a scope you keep.",
        status: "active",
      },
      {
        label: "Build with agents",
        description: "Agents work against the written rules in your project. They propose; a person signs off.",
        status: "pending",
      },
      {
        label: "Hand it over",
        description: "The repository, the task ledger, the deploy and its check output are yours.",
        status: "pending",
      },
    ]}
  />
);

export const WithoutStatus = () => (
  <ProcessSteps
    steps={[
      { label: "Agents propose", description: "Workers run in parallel against the written rules. They never push." },
      { label: "A person signs off", description: "The change is re-read and the checks are run before any of it lands." },
    ]}
  />
);
