import { CaseSection, StatBand } from "@intrface/web";

export const Paper = () => (
  <CaseSection
    intro="Each case states the status it has today, not the status it will have at launch."
    label="Engineering"
    title="Where the trust actually comes from"
    tone="paper"
  >
    <StatBand
      stats={[
        { value: "6", label: "Steps from filed document to public check" },
        { value: "0", label: "Accounts needed to check a claim" },
      ]}
    />
  </CaseSection>
);

export const Ink = () => (
  <CaseSection
    intro="Pre-launch means pre-launch. Nothing here claims users it does not have."
    label="Honest status"
    title="What is not built"
    tone="ink"
  >
    <p className="type-body">
      The code, the schema, the policy modules and the tests are real and public. The deployment is
      not.
    </p>
  </CaseSection>
);

export const WithAside = () => (
  <CaseSection
    aside={
      // HonestNote itself reads its label from next-intl, so it is not in the
      // bundle — this is the same shape, written out.
      <div className="border-l-2 border-accent pl-5">
        <p className="type-meta">Honest status</p>
        <p className="type-body-sm mt-3">
          No public body runs it. The pilot in the repository labels itself simulated.
        </p>
      </div>
    }
    label="What it is"
    title="A governance graph where every claim traces back to a document"
    tone="raised"
  >
    <p className="type-body">
      &ldquo;The council approved the budget in March&rdquo; is not a sentence here. It is an edge to
      a decision, which resolves to a filed document, which resolves to a hash, a seal, and a
      timestamp a stranger can re-check.
    </p>
  </CaseSection>
);
