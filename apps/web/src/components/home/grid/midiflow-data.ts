/** Static data for the MidiFlow fragment: a pentatonic voice, a light default
 *  pattern, and three fixed tempos. Rows run top (highest) to bottom. */

export const STEPS = 16;

export const PITCHES = [
  { name: "A4", hz: 440 },
  { name: "G4", hz: 392 },
  { name: "E4", hz: 329.63 },
  { name: "D4", hz: 293.66 },
  { name: "C4", hz: 261.63 },
] as const;

/** [pitch row, step] pairs switched on at load, so the first Play makes music. */
const DEFAULT_ON: ReadonlyArray<readonly [number, number]> = [
  [4, 0],
  [2, 3],
  [1, 6],
  [0, 8],
  [1, 11],
  [2, 14],
];

export function defaultPattern(): boolean[] {
  const cells = new Array<boolean>(PITCHES.length * STEPS).fill(false);
  for (const [p, s] of DEFAULT_ON) cells[p * STEPS + s] = true;
  return cells;
}

/** Beats per minute; each step is a sixteenth note. */
export const TEMPOS = [84, 104, 128] as const;
export const DEFAULT_TEMPO = 104;
