"use client";

import { IconArrowDown } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { requestNeed } from "@/components/services/need-request";
import type { IntakeNeed } from "@/lib/site/intake";

/**
 * A plain jump to the form (`#start`) that also marks this row's need there.
 * Without JavaScript it is still the jump.
 */
export function StartWith({ need, children }: { need: IntakeNeed; children: ReactNode }) {
  return (
    <a className="iface-link" href="#start" onClick={() => requestNeed(need)}>
      {children}
      <IconArrowDown aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}
