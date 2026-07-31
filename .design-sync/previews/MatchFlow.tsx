import { MatchFlow } from "@intrface/web";

export const FundingMatch = () => (
  <MatchFlow
    steps={[
      { name: "Read the calls as they publish", body: "Agents pull EU funding calls as they appear, instead of waiting for someone to check a portal." },
      { name: "Turn each into a record", body: "Deadlines, budget, eligibility and region become fields a machine can compare." },
      { name: "Match against the organisation", body: "Sector, size and location decide what is worth reading — and the match says why." },
      { name: "Put it in front of the right person", body: "One dataset, read four ways: admin, consultant, corporate, director." },
    ]}
  />
);
