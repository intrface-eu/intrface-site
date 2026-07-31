import { PilotSeed } from "@intrface/web";

const Pin = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const Path = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 20c4 0 4-8 8-8s4 8 8 8" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </svg>
);

export const VrsarSeed = () => (
  <PilotSeed
    items={[
      { icon: Pin, label: "Places in the register", detail: "Beaches, services and points of interest under their real names." },
      { icon: Path, label: "Walking and cycling routes", detail: "Signposted routes as a guest would actually walk them." },
      { icon: Clock, label: "Shuttle timetables", detail: "Local departures, so directions come with times." },
    ]}
  />
);
