import { OperatingRule } from "@intrface/web";

export const TheRule = () => (
  <OperatingRule
    clauses={[
      { text: "Agents propose", detail: "A worker produces a change and a report. That is the whole of its authority." },
      { text: "A person signs off", detail: "The change is re-read and the checks are run before it lands." },
      { text: "Workers never push", detail: "There is no path from agent output to your branch that skips a person." },
    ]}
    label="The rule"
    rule="Agents propose; a person signs off. Workers never push."
  />
);
