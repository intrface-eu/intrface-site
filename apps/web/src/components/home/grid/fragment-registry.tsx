import type { ComponentType } from "react";
import type { CellSlug, FragmentProps } from "@/lib/site/interfaces";
import { AstyleMarineFragment } from "./astyle-marine-fragment";
import { FundaFragment } from "./funda-fragment";
import { IndexFragment } from "./index-fragment";
import { MidiflowFragment } from "./midiflow-fragment";
import { PatchbayFragment } from "./patchbay-fragment";
import { PolisFragment } from "./polis-fragment";
import { VelumFragment } from "./velum-fragment";
import { VoyagerFragment } from "./voyager-fragment";

/** Cell slug to fragment, for all eight cells. */
export const FRAGMENTS: Record<CellSlug, ComponentType<FragmentProps>> = {
  voyager: VoyagerFragment,
  index: IndexFragment,
  polis: PolisFragment,
  midiflow: MidiflowFragment,
  patchbay: PatchbayFragment,
  funda: FundaFragment,
  velum: VelumFragment,
  astyleMarine: AstyleMarineFragment,
};
