/**
 * Content of the Velum fragment, verbatim from velum-winebar.com (Croatian at
 * `/`, English at `/en/`), read 2026-09-26. The site is bilingual only, so the
 * fragment offers the same two languages. It shows no prices: the site shows
 * none ("The full menu and prices are on your table").
 *
 * Photo crops point into the project captures in `public/proof/projects/velum/`
 * (1440 x 1000): `box` is the photograph's rectangle there, in capture pixels.
 */

export type VelumLang = "hr" | "en";
export type VelumSection = "menu" | "cakes" | "wine" | "visit";

export const VELUM_SECTIONS: readonly VelumSection[] = ["menu", "cakes", "wine", "visit"];

type Copy = {
  /** The language's own name, as the site's switcher names it. */
  name: string;
  /** The code the site's switcher shows for this language. */
  code: string;
  kicker: string;
  nav: Record<VelumSection, string>;
  menu: { title: string; intro: string; items: { name: string; note: string }[]; foot: string };
  cakes: { title: string; body: string; foot: string };
  wine: { title: string; body: string[] };
  visit: { title: string; body: string; place: string; phone: string; instagram: string };
  photos: { menu: string; table: string };
};

export const VELUM: Record<VelumLang, Copy> = {
  hr: {
    name: "Hrvatski",
    code: "HR",
    kicker: "Kavana i vinoteka · Vrsar",
    nav: { menu: "Jutarnja ponuda", cakes: "Kolači", wine: "Vino", visit: "Posjeti nas" },
    menu: {
      title: "Doručak koji se jede polako",
      intro: "Ujutro je najteže odlučiti. Izdvajamo nekoliko favorita:",
      items: [
        { name: "Omlet sa tartufima", note: "prozračni omlet s istarskim tartufima" },
        { name: "Luxury doručak za dvoje", note: "kava, spremuta, granola, pršut i sir" },
        { name: "Čarobni avokado", note: "crni kruh, avokado, jaje na oko i pancetta" },
        { name: "Dobro jutro losos", note: "crni kruh, avokado, losos i kuhano jaje" },
        { name: "Chia puding s voćem", note: "chia, bademovo mlijeko i svježe voće" },
        { name: "Salata caprese", note: "rajčica, mozzarella i bosiljak" },
      ],
      foot: "Cijeli izbornik i cijene čekaju te za stolom.",
    },
    cakes: {
      title: "Slatko iz naše kuhinje",
      body: "Torta od mrkve, čokoladni mousse, pite s voćem. Uzmi komad uz kavu i pusti da jutro potraje.",
      foot: "Jedan komad nikad nije samo jedan komad.",
    },
    wine: {
      title: "Navečer prelazimo na vino",
      body: [
        "Sunce zađe iza barki, riva se stiša, a mi otvaramo bocu.",
        "Istarska vina biramo sami. Popij čašu na terasi ili ponesi bocu doma.",
      ],
    },
    visit: {
      title: "Vidimo se u Vrsaru",
      body: "Na rivi smo, uz sam more. Svrati kad prolaziš.",
      place: "Riva, Vrsar · Istra, Hrvatska",
      phone: "095 9158 868",
      instagram: "@velum_winebar",
    },
    photos: {
      menu: "Vitrina s čokoladnim moussom i pitom s voćem, natpisi pisani kredom",
      table: "Crvena šalica kave i Velum jutarnji meni na stolu, riva u pozadini",
    },
  },
  en: {
    name: "English",
    code: "EN",
    kicker: "Café and wine bar · Vrsar",
    nav: { menu: "Morning menu", cakes: "Cakes", wine: "Wine", visit: "Visit us" },
    menu: {
      title: "Breakfast worth sitting down for",
      intro: "In the morning, choosing is the hard part. A few favourites:",
      items: [
        { name: "Truffle omelette", note: "a fluffy omelette with Istrian truffles" },
        { name: "Luxury breakfast for two", note: "coffee, juice, granola, prosciutto and cheese" },
        { name: "Magic avocado", note: "dark bread, avocado, fried egg and pancetta" },
        { name: "Good morning salmon", note: "dark bread, avocado, salmon and boiled egg" },
        { name: "Chia pudding with fruit", note: "chia, almond milk and fresh fruit" },
        { name: "Caprese salad", note: "tomato, mozzarella and basil" },
      ],
      foot: "The full menu and prices are on your table.",
    },
    cakes: {
      title: "Sweet things from our kitchen",
      body: "Carrot cake, chocolate mousse, fruit pies. Take a slice with your coffee and let the morning run long.",
      foot: "One slice is never just one slice.",
    },
    wine: {
      title: "In the evening we switch to wine",
      body: [
        "The sun drops behind the boats, the harbour goes quiet, and we open a bottle.",
        "We pick the Istrian wines ourselves. Have a glass on the terrace or take a bottle home.",
      ],
    },
    visit: {
      title: "See you in Vrsar",
      body: "We are on the waterfront, right where the boats tie up. Drop in when you are passing.",
      place: "Waterfront, Vrsar · Istria, Croatia",
      phone: "095 9158 868",
      instagram: "@velum_winebar",
    },
    photos: {
      menu: "Display case with chocolate mousse cake and a slice of fruit pie, labels chalked by hand",
      table: "A red coffee cup and the Velum morning menu on a table, harbour behind",
    },
  },
};

export type Crop = { src: string; box: { x: number; y: number; w: number; h: number } };

/** Where each section's photograph sits in the captures (1440 x 1000). */
export const VELUM_PHOTOS: Record<"menu" | "table", Crop> = {
  // The display case beside the morning menu (detail capture).
  menu: { src: "/proof/projects/velum/detail.webp", box: { x: 870, y: 194, w: 468, h: 644 } },
  // The red cup and the menu on the waterfront table (desktop capture).
  table: { src: "/proof/projects/velum/desktop.webp", box: { x: 647, y: 111, w: 743, h: 688 } },
};

export const CAPTURE_W = 1440;
export const CAPTURE_H = 1000;

/** Which photograph stands beside each section when the piece is expanded. */
export const SECTION_PHOTO: Record<VelumSection, "menu" | "table"> = {
  menu: "menu",
  cakes: "menu",
  wine: "table",
  visit: "table",
};
