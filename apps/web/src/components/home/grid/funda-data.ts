/**
 * Invented funding lines for the Funda fragment on the home grid. Generic on
 * purpose: none of these names a real programme or call. `share` is the upper
 * bound of the funded share in percent; `months` places the deadline that many
 * months after the month the visitor makes a pick, so the table never dates.
 */

export type Who = "municipality" | "company" | "association";
export type Need = "energy" | "digital" | "culture";
export type FundaLocale = "en" | "de" | "fr" | "hr";

export type Programme = {
  id: string;
  need: Need;
  who: Who[];
  share: number;
  months: number;
  name: Record<FundaLocale, string>;
};

export const WHO: Who[] = ["municipality", "company", "association"];
export const NEED: Need[] = ["energy", "digital", "culture"];

export const PROGRAMMES: Programme[] = [
  {
    id: "e1",
    need: "energy",
    who: ["municipality"],
    share: 60,
    months: 5,
    name: {
      en: "Energy retrofit, public buildings",
      de: "Energetische Sanierung öffentlicher Gebäude",
      fr: "Rénovation énergétique des bâtiments publics",
      hr: "Energetska obnova javnih zgrada",
    },
  },
  {
    id: "e2",
    need: "energy",
    who: ["company"],
    share: 40,
    months: 8,
    name: {
      en: "Rooftop solar, small firms",
      de: "Solardächer für kleine Betriebe",
      fr: "Solaire en toiture, petites entreprises",
      hr: "Sunčane elektrane na krovovima malih tvrtki",
    },
  },
  {
    id: "e3",
    need: "energy",
    who: ["association", "municipality"],
    share: 80,
    months: 4,
    name: {
      en: "Community energy groups",
      de: "Energiegemeinschaften vor Ort",
      fr: "Communautés énergétiques locales",
      hr: "Lokalne energetske zajednice",
    },
  },
  {
    id: "e4",
    need: "energy",
    who: ["municipality"],
    share: 50,
    months: 10,
    name: {
      en: "Street lighting upgrade",
      de: "Modernisierung der Straßenbeleuchtung",
      fr: "Modernisation de l’éclairage public",
      hr: "Modernizacija javne rasvjete",
    },
  },
  {
    id: "d1",
    need: "digital",
    who: ["municipality"],
    share: 70,
    months: 6,
    name: {
      en: "Online services, local authorities",
      de: "Online-Dienste für Kommunen",
      fr: "Services en ligne des collectivités",
      hr: "Online usluge lokalne samouprave",
    },
  },
  {
    id: "d2",
    need: "digital",
    who: ["company"],
    share: 50,
    months: 3,
    name: {
      en: "Digital tools, small firms",
      de: "Digitale Werkzeuge für kleine Betriebe",
      fr: "Outils numériques, petites entreprises",
      hr: "Digitalni alati za male tvrtke",
    },
  },
  {
    id: "d3",
    need: "digital",
    who: ["association", "company"],
    share: 75,
    months: 9,
    name: {
      en: "Digital skills, local training",
      de: "Digitale Kompetenzen, Schulungen vor Ort",
      fr: "Compétences numériques, formation locale",
      hr: "Digitalne vještine, lokalna edukacija",
    },
  },
  {
    id: "d4",
    need: "digital",
    who: ["municipality", "association"],
    share: 65,
    months: 11,
    name: {
      en: "Open data and online forms",
      de: "Offene Daten und Online-Formulare",
      fr: "Données ouvertes et formulaires en ligne",
      hr: "Otvoreni podaci i e-obrasci",
    },
  },
  {
    id: "c1",
    need: "culture",
    who: ["municipality"],
    share: 60,
    months: 7,
    name: {
      en: "Heritage sites, restoration",
      de: "Kulturerbe, Restaurierung",
      fr: "Patrimoine, restauration",
      hr: "Kulturna baština, obnova",
    },
  },
  {
    id: "c2",
    need: "culture",
    who: ["association"],
    share: 70,
    months: 2,
    name: {
      en: "Festivals and touring",
      de: "Festivals und Tourneen",
      fr: "Festivals et tournées",
      hr: "Festivali i gostovanja",
    },
  },
  {
    id: "c3",
    need: "culture",
    who: ["company"],
    share: 45,
    months: 5,
    name: {
      en: "Creative firms, first markets",
      de: "Kreativbetriebe, erste Märkte",
      fr: "Entreprises créatives, premiers marchés",
      hr: "Kreativne tvrtke, prva tržišta",
    },
  },
  {
    id: "c4",
    need: "culture",
    who: ["association", "municipality", "company"],
    share: 80,
    months: 12,
    name: {
      en: "Culture partnerships across borders",
      de: "Grenzüberschreitende Kulturpartnerschaften",
      fr: "Partenariats culturels transfrontaliers",
      hr: "Prekogranična kulturna partnerstva",
    },
  },
];
