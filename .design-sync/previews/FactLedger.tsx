import { FactLedger } from "@intrface/web";

export const About = () => (
  <FactLedger
    facts={[
      { term: "Company", value: "INTRFACE — IT consulting and business development" },
      { term: "Who you work with", value: "Alex Bašić — engineer and director. One person, not a rotating team." },
      { term: "Based", value: "Dalmatinska 34, Vrsar, Istria. Working across the EU." },
      { term: "Languages", value: "Croatian, Italian, English" },
      { term: "Answer time", value: "One working day." },
    ]}
  />
);
