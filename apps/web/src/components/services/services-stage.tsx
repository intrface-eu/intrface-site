"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import { useState } from "react";
import { InterfaceFigure, InterfaceStatus, type Screen } from "@/components/showcase/interface-row";

export type StageItem = {
  key: string;
  name: string;
  line: string;
  status: string;
  tone: "live" | "test";
  href: string;
  /** "Open <name>", already translated. */
  open: string;
  desktop: Screen;
  phone: Screen;
};

/**
 * The /services first screen's proof: the screens of one project, and the list
 * of the five beside it. Choosing a name in the list puts its screens up. All
 * five pairs are drawn from the start and cross-fade, so a choice never waits
 * on the network. The wrapper is `display: contents`, so the screens and the
 * list take their own places in the hero's grid.
 */
export function ServicesStage({ items, label }: { items: readonly StageItem[]; label: string }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className="svc-stage">
      <div className="svc-stage__screens">
        {items.map((item, index) => (
          <div
            aria-hidden={index === active ? undefined : true}
            className="svc-stage__frame"
            data-active={index === active ? "" : undefined}
            inert={index !== active}
            key={item.key}
          >
            <InterfaceFigure
              desktop={item.desktop}
              phone={item.phone}
              priority={index === 0}
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>
        ))}
      </div>

      <div className="svc-stage__pick">
        <ul aria-label={label} className="svc-stage__list">
          {items.map((item, index) => (
            <li key={item.key}>
              <button
                aria-pressed={index === active}
                className="svc-stage__item"
                onClick={() => setActive(index)}
                type="button"
              >
                <span className="svc-stage__name">{item.name}</span>
                <span className="svc-stage__line">{item.line}</span>
                <InterfaceStatus tone={item.tone}>{item.status}</InterfaceStatus>
              </button>
            </li>
          ))}
        </ul>
        <a className="iface-link" href={current.href}>
          {current.open}
          <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
