/**
 * Content of the AstyleMarine fragment, verbatim from www.astylemarine.com:
 * the experience cards on the home page and the route, time and price blocks
 * of each experience's own page, in the site's Croatian (`/`), English
 * (`/en/`) and German (`/de/`), read 2026-09-26. The site has no French, so a
 * French visitor gets the English, as the site would give them.
 *
 * Prices are the site's own, written as each language writes them. The
 * Astyle Experience and the Whisper Safari publish no route, so none is drawn.
 *
 * `LAT` is each stop's latitude (degrees north, rounded). It only spaces the
 * stops down the route line so a longer route reaches further south, as the
 * coast runs; the fragment never prints it.
 */

export type AmLang = "hr" | "en" | "de";
export type ExperienceId = "expedition" | "cruise" | "whisper" | "adventure" | "experience";
type StopId =
  | "porec"
  | "nikola"
  | "brulo"
  | "plava"
  | "zelena"
  | "bijela"
  | "funtana"
  | "vrsar"
  | "lim"
  | "cave"
  | "rovinj"
  | "red";

export const LAT: Record<StopId, number> = {
  porec: 45.227,
  nikola: 45.222,
  brulo: 45.212,
  plava: 45.201,
  zelena: 45.193,
  bijela: 45.185,
  funtana: 45.175,
  vrsar: 45.15,
  lim: 45.132,
  cave: 45.129,
  rovinj: 45.081,
  red: 45.059,
};

/** North and south ends of the route line: Poreč to Red Island. */
export const LAT_TOP = LAT.porec;
export const LAT_BOTTOM = LAT.red;

const STOP_NAMES: Record<AmLang, Record<StopId, string>> = {
  en: {
    porec: "Poreč",
    nikola: "Sv. Nikola",
    brulo: "Brulo",
    plava: "Plava Laguna",
    zelena: "Zelena Laguna",
    bijela: "Bijela Uvala",
    funtana: "Funtana",
    vrsar: "Vrsar",
    lim: "Lim Channel",
    cave: "Pirate Cave",
    rovinj: "Rovinj",
    red: "Red Island",
  },
  de: {
    porec: "Poreč",
    nikola: "Sv. Nikola",
    brulo: "Brulo",
    plava: "Plava Laguna",
    zelena: "Zelena Laguna",
    bijela: "Bijela Uvala",
    funtana: "Funtana",
    vrsar: "Vrsar",
    lim: "Limski-Kanal",
    cave: "Piratenhöhle",
    rovinj: "Rovinj",
    red: "Rote Insel",
  },
  hr: {
    porec: "Poreč",
    nikola: "Sv. Nikola",
    brulo: "Brulo",
    plava: "Plava laguna",
    zelena: "Zelena laguna",
    bijela: "Bijela uvala",
    funtana: "Funtana",
    vrsar: "Vrsar",
    lim: "Limski kanal",
    cave: "Piratska špilja",
    rovinj: "Rovinj",
    red: "Crveni otok",
  },
};

export const stopName = (lang: AmLang, id: StopId) => STOP_NAMES[lang][id];

/** The site's own labels, per language. */
export const LABELS: Record<
  AmLang,
  {
    kicker: string;
    duration: string;
    time: string;
    departures: string;
    guests: string;
    price: string;
    route: string;
    included: string;
    includes: string;
    routeNote: string;
  }
> = {
  en: {
    kicker: "Experiences",
    duration: "Duration",
    time: "Time",
    departures: "Departures",
    guests: "Guests",
    price: "Price",
    route: "Route",
    included: "Included",
    includes: "Fuel · Two crew members",
    routeNote: "The route is indicative — we shape it around the sea and around you on the day.",
  },
  de: {
    kicker: "Erlebnisse",
    duration: "Dauer",
    time: "Uhrzeit",
    departures: "Auslaufzeiten",
    guests: "Gäste",
    price: "Preis",
    route: "Route",
    included: "Inklusive",
    includes: "Treibstoff · Zwei Crewmitglieder",
    routeNote: "Die Route ist ein Vorschlag — wir richten sie am Tag selbst nach dem Meer und nach Ihnen.",
  },
  hr: {
    kicker: "Doživljaji",
    duration: "Trajanje",
    time: "Vrijeme",
    departures: "Polasci",
    guests: "Gosti",
    price: "Cijena",
    route: "Ruta",
    included: "Uključeno",
    includes: "Gorivo · Dva člana posade",
    routeNote: "Ruta je okvirna — prilagođavamo je moru i vama toga dana.",
  },
};

type Fact = { label: "duration" | "time" | "departures" | "guests"; value: string };
type Price = { value: string; note?: string };
type Route = { title?: string; stops: readonly StopId[] };

type Copy = {
  line: string;
  /** Private, or private or shared. */
  mode: string;
  facts: Fact[];
  prices: Price[];
  routes: Route[];
};

export type Experience = { id: ExperienceId; name: string; copy: Record<AmLang, Copy> };

const COAST = ["porec", "nikola", "funtana", "vrsar"] as const;

/** In the order the site lists them. */
export const EXPERIENCES: readonly Experience[] = [
  {
    id: "expedition",
    name: "Astyle Expedition",
    copy: {
      en: {
        line: "Four hours down the coast, from Poreč to Rovinj.",
        mode: "Private",
        facts: [
          { label: "duration", value: "4 hours" },
          { label: "time", value: "09:00 – 13:00" },
          { label: "guests", value: "up to 12 guests" },
        ],
        prices: [{ value: "€800", note: "private, up to 12 guests" }],
        routes: [{ stops: [...COAST, "lim", "rovinj", "red"] }],
      },
      de: {
        line: "Vier Stunden die Küste hinunter, von Poreč bis Rovinj.",
        mode: "Privat",
        facts: [
          { label: "duration", value: "4 Stunden" },
          { label: "time", value: "09:00 – 13:00" },
          { label: "guests", value: "bis zu 12 Gäste" },
        ],
        prices: [{ value: "800 €", note: "privat, bis zu 12 Gäste" }],
        routes: [{ stops: [...COAST, "lim", "rovinj", "red"] }],
      },
      hr: {
        line: "Četiri sata obalom, od Poreča do Rovinja.",
        mode: "Privatno",
        facts: [
          { label: "duration", value: "4 sata" },
          { label: "time", value: "09:00 – 13:00" },
          { label: "guests", value: "do 12 gostiju" },
        ],
        prices: [{ value: "800 €", note: "privatno, do 12 gostiju" }],
        routes: [{ stops: [...COAST, "lim", "rovinj", "red"] }],
      },
    },
  },
  {
    id: "cruise",
    name: "Astyle Cruise",
    copy: {
      en: {
        line: "Two hours up to the Lim Channel.",
        mode: "Private",
        facts: [{ label: "duration", value: "2 hours" }],
        prices: [{ value: "€400" }],
        routes: [
          { title: "With the Lim Channel and the Pirate Cave", stops: [...COAST, "lim", "cave"] },
          { title: "The same coast, with a swim stop", stops: COAST },
        ],
      },
      de: {
        line: "Zwei Stunden bis zum Limski-Kanal.",
        mode: "Privat",
        facts: [{ label: "duration", value: "2 Stunden" }],
        prices: [{ value: "400 €" }],
        routes: [
          { title: "Mit Limski-Kanal und Piratenhöhle", stops: [...COAST, "lim", "cave"] },
          { title: "Dieselbe Küste, mit Badestopp", stops: COAST },
        ],
      },
      hr: {
        line: "Dva sata do Limskog kanala.",
        mode: "Privatno",
        facts: [{ label: "duration", value: "2 sata" }],
        prices: [{ value: "400 €" }],
        routes: [
          { title: "Uz Limski kanal i Piratsku špilju", stops: [...COAST, "lim", "cave"] },
          { title: "Ista obala, uz stanku za kupanje", stops: COAST },
        ],
      },
    },
  },
  {
    id: "whisper",
    name: "Whisper Safari",
    copy: {
      en: {
        line: "An evening on the water, at 18:00 or 19:30.",
        mode: "Private or shared departure",
        facts: [
          { label: "duration", value: "90 minutes" },
          { label: "departures", value: "18:00 · 19:30" },
          { label: "guests", value: "up to 11 guests (private)" },
        ],
        prices: [
          { value: "€385", note: "private, up to 11 guests" },
          { value: "€35 per person", note: "shared departure" },
        ],
        routes: [],
      },
      de: {
        line: "Ein Abend auf dem Wasser, um 18:00 oder 19:30 Uhr.",
        mode: "Privat oder gemeinsame Ausfahrt",
        facts: [
          { label: "duration", value: "90 Minuten" },
          { label: "departures", value: "18:00 · 19:30" },
          { label: "guests", value: "bis zu 11 Gäste (privat)" },
        ],
        prices: [
          { value: "385 €", note: "privat, bis zu 11 Gäste" },
          { value: "35 € pro Person", note: "gemeinsame Ausfahrt" },
        ],
        routes: [],
      },
      hr: {
        line: "Večernja plovidba u 18:00 ili 19:30.",
        mode: "Privatno ili zajednički polazak",
        facts: [
          { label: "duration", value: "90 minuta" },
          { label: "departures", value: "18:00 · 19:30" },
          { label: "guests", value: "do 11 gostiju (privatno)" },
        ],
        prices: [
          { value: "385 €", note: "privatno, do 11 gostiju" },
          { value: "35 € po osobi", note: "zajednički polazak" },
        ],
        routes: [],
      },
    },
  },
  {
    id: "adventure",
    name: "Astyle Adventure",
    copy: {
      en: {
        line: "An hour along the Poreč bays.",
        mode: "Private",
        facts: [
          { label: "duration", value: "1 hour" },
          { label: "guests", value: "up to 12 guests" },
        ],
        prices: [{ value: "Price on enquiry" }],
        routes: [{ stops: ["porec", "nikola", "brulo", "plava", "zelena", "bijela", "funtana", "vrsar"] }],
      },
      de: {
        line: "Eine Stunde entlang der Buchten von Poreč.",
        mode: "Privat",
        facts: [
          { label: "duration", value: "1 Stunde" },
          { label: "guests", value: "bis zu 12 Gäste" },
        ],
        prices: [{ value: "Preis auf Anfrage" }],
        routes: [{ stops: ["porec", "nikola", "brulo", "plava", "zelena", "bijela", "funtana", "vrsar"] }],
      },
      hr: {
        line: "Sat vremena uz porečke uvale.",
        mode: "Privatno",
        facts: [
          { label: "duration", value: "1 sat" },
          { label: "guests", value: "do 12 gostiju" },
        ],
        prices: [{ value: "Cijena na upit" }],
        routes: [{ stops: ["porec", "nikola", "brulo", "plava", "zelena", "bijela", "funtana", "vrsar"] }],
      },
    },
  },
  {
    id: "experience",
    name: "Astyle Experience",
    copy: {
      en: {
        line: "Up to five on board, with photographs from the water.",
        mode: "Private",
        facts: [{ label: "guests", value: "up to 5 guests" }],
        prices: [{ value: "€350", note: "up to 5 guests" }],
        routes: [],
      },
      de: {
        line: "Bis zu fünf Gäste an Bord, mit Fotos vom Wasser aus.",
        mode: "Privat",
        facts: [{ label: "guests", value: "bis zu 5 Gäste" }],
        prices: [{ value: "350 €", note: "bis zu 5 Gäste" }],
        routes: [],
      },
      hr: {
        line: "Do petero gostiju, uz fotografije s mora.",
        mode: "Privatno",
        facts: [{ label: "guests", value: "do 5 gostiju" }],
        prices: [{ value: "350 €", note: "do 5 gostiju" }],
        routes: [],
      },
    },
  },
];
