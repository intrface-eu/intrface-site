import type { ComponentType } from "react";
import type { FragmentKey } from "@/lib/site/interfaces";
import { CaptureFragment } from "./capture-fragment";
import { FundaFragment } from "./funda-fragment";
import { IndexFragment } from "./index-fragment";
import { MidiflowFragment } from "./midiflow-fragment";
import { PatchbayFragment } from "./patchbay-fragment";
import { PolisFragment } from "./polis-fragment";
import { VoyagerFragment } from "./voyager-fragment";

/**
 * Fragment key to component. Every fragment takes `{ slug }`; the capture
 * fragment serves both client sites and reads which one from the slug.
 */
export const FRAGMENTS: Record<FragmentKey, ComponentType<{ slug: string }>> = {
  voyager: VoyagerFragment,
  index: IndexFragment,
  midiflow: MidiflowFragment,
  patchbay: PatchbayFragment,
  polis: PolisFragment,
  funda: FundaFragment,
  capture: CaptureFragment as ComponentType<{ slug: string }>,
};
