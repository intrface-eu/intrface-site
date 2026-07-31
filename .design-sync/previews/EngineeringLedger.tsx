import { EngineeringLedger } from "@intrface/web";

export const Voyager = () => (
  <EngineeringLedger
    entries={[
      {
        title: "One database, many businesses, no leaks",
        body: "The tourist board and every business share one dataset, so a single leak ends the pilot. Permissions run through a grant cache, and a test fails the build on any route that reads data without checking.",
      },
      {
        title: "Answers stay grounded in the client's own content",
        body: "The host answers from the menu, the hours and the notices the business publishes — not from a general model's memory of the town.",
      },
      {
        title: "Scraping and pedestrian routing run as our own services",
        body: "Third-party routing could not answer the questions a guest asks on foot, so the routing is ours and the data behind it is ours to correct.",
      },
    ]}
  />
);
