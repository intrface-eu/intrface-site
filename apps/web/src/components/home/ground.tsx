import { GroundPointer } from "@/components/home/ground-pointer";
import { VectorGround } from "@/components/home/vector-ground";

/**
 * The ground the home and about pages stand on.
 *
 * The site's halftone stops being decoration on one section and becomes the
 * pattern of the world: one fixed field, two dot layers at different cells,
 * screen angles and alphas, behind every sheet on the page. It is the page
 * background for the home and about pages — the layout keeps its plain paper,
 * and every other page keeps its bands.
 *
 * Nothing here reads or writes layout. The layers move three ways, and each
 * element carries exactly one of them so the transforms compose instead of
 * fighting:
 *
 * - the outer layer takes the pointer (CSS `translate` from two custom
 *   properties written by `GroundPointer`);
 * - the plane takes the scroll, through `animation-timeline: scroll(root)` —
 *   no listener, no per-frame React, and browsers without it simply get a
 *   still field;
 * - the dots take the ambient drift, a loop of an exact multiple of the cell
 *   so it returns to itself with no seam.
 *
 * Under reduced motion none of the three run and the ground is one still frame.
 * All of it is transform and opacity, so the compositor owns every pixel of it.
 *
 * With WebGL2 and no reduced-motion preference, `VectorGround` takes over the
 * same fixed box: a line pinned to every vertex of the grid, turned to face the
 * pointer, gathering into the mark and into Istria at the open bands the page
 * leaves for it — two on home, the land band alone on about. The dot layers are
 * hidden while it runs and return the moment it cannot.
 */
export function Ground() {
  return (
    <div aria-hidden="true" className="ground" data-ground>
      {/* Far first: coarser, fainter, slower, and travelling half as far. */}
      <div className="ground-layer ground-far">
        <div className="ground-plane">
          <div className="ground-dots" />
        </div>
      </div>
      <div className="ground-layer ground-near">
        <div className="ground-plane">
          <div className="ground-dots" />
        </div>
      </div>
      <VectorGround />
      <GroundPointer />
    </div>
  );
}
