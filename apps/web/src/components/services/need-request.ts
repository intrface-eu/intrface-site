import type { IntakeNeed } from "@/lib/site/intake";

/**
 * "Start with this" on a service row asks the intake form below to mark a
 * need. The two are separate client islands on a static page, so the request
 * passes through this module rather than through the URL: changing the query
 * would cost a navigation, and the form would not see it.
 */
type Listener = (need: IntakeNeed) => void;

const listeners = new Set<Listener>();

export function requestNeed(need: IntakeNeed) {
  for (const listener of listeners) listener(need);
}

export function onNeedRequest(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
