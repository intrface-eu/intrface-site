import type { ComponentType } from "react";
import type { CellSlug, FragmentProps, WorkFragmentProps } from "@/lib/site/interfaces";
import { IndexFragment } from "./index-fragment";
import { PolisFragment } from "./polis-fragment";
import { VoyagerFragment } from "./voyager-fragment";
import { WorkFragment } from "./work-fragment";

/**
 * Cell slug to fragment. Three cells take `FragmentProps`; the work cell
 * takes `WorkFragmentProps`, because the shell owns its current piece. The
 * work fragment imports its own pieces.
 */
export const FRAGMENTS: Record<Exclude<CellSlug, "work">, ComponentType<FragmentProps>> & {
  work: ComponentType<WorkFragmentProps>;
} = {
  voyager: VoyagerFragment,
  index: IndexFragment,
  polis: PolisFragment,
  work: WorkFragment,
};
