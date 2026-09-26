"use client";

import { createContext, useContext } from "react";

/**
 * False while a work piece is leaving the work cell (the 200ms crossfade out).
 * A piece that makes sound or runs a loop goes quiet at once when it turns
 * false, before it unmounts. Outside the work cell it is always true.
 */
export const WorkPieceActive = createContext(true);

export const useWorkPieceActive = () => useContext(WorkPieceActive);
