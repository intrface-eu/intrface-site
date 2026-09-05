# intrface.eu revamp — content & build contract

This document is the source of truth for the July 2026 site revamp. Every implementation
agent reads this before touching code. It encodes the positioning research (five-agent
deep dive, 2026-07-27) and the file-ownership map that keeps parallel work from colliding.

## Positioning (revised 2026-09-03 — supersedes the July frame)

**INTRFACE builds interfaces for the world.** Not screens. An interface here is the
layer a person meets a system through. That single idea is why one company owns a
tourism platform, a civic ledger, a funding matcher, a music app and an artist network,
and it is the criterion for what belongs on this site.

The company is a product company with a services door, not a consultancy with side
projects. The site leads with what we build; client work is one of the interfaces
(a business and its customers) and stays plainly findable for a buyer who only wants
a site.

### The doctrine — fixed wording, used once each on the home page

1. **The world already runs on systems.** Cities, institutions, landscapes, music,
   businesses, communities.
2. **Most of them are badly mediated.** Tourism becomes a review site. Civic
   participation becomes PDFs and office hours. Music software becomes machinery.
   An artist network becomes a feed.
3. **INTRFACE builds the missing human side.**

House line, once, on the home page: *"The best interface makes the system behind it
understandable without making you think about the interface."*

Admission test, once, on `/about`: *"What two things does this create an interface
between? If there is no clear answer, it is not an INTRFACE product."*

The "Don't make people operate X software. Help them Y." construction is an antithesis
and counts against the per-page budget below. Use it at most once per page, never as a
list.

### Canonical product lines — character-for-character everywhere they appear

| Product | The interface … | Pair | Status label (exact) | Claim line (exact) |
|---|---|---|---|---|
| Voyager | for a place | visitor ↔ place | Pre-launch | One QR code gives a restaurant a multilingual AI host grounded in its own menu and hours. |
| Polis | to the city | citizen ↔ institution | Open source · AGPL · pre-deployment | A governance graph where every public claim traces back to a source document. |
| Funda | to EU funding | organization ↔ funding | Active build | Reads EU funding calls as they publish and matches them to the organizations that fit. |
| MidiFlow | for musical thought | musician ↔ sound | Pre-launch | The least machinery possible between an idea you can hear and a computer that plays it. |
| Patchbay | for making things with other artists | artist ↔ artist | Pre-launch | Artists find each other and make work together, with no feed in between. |
| Client sites | between a business and its customers | customer ↔ business | Live · Vrsar | A coastal business goes from an Instagram profile to a live bilingual site in one continuous pass. |

The pair may be rendered with the ↔ glyph or as two words on a rule; whichever, the
same treatment on every row. "Polis Interface" remains the product's full name in the
footer and metadata; rows and prose say "Polis".

### Tagline and metadata

- Tagline, exact: **Interfaces for the world.** It is the home H1, the `Metadata.tagline`,
  the OG-image tagline and the first sentence of the footer tagline.
- `Metadata.description` names the six interfaces in one sentence and the place (Vrsar,
  Istria). No "IT consulting" in the description; the registered activity lives in the
  `/about` facts ledger and the imprint only.

### Home page order

hero (tagline, one defining lead, two actions) → evidence strip (unchanged: Velum,
Voyager, Agent Ops Cockpit) → doctrine (the three steps above, the house line) →
what we build (five own products with pair and status; MidiFlow and Patchbay rows carry
no link) → for businesses (the Velum exhibit and the client-sites link — this is the
services door) → method teaser (unchanged) → contact (unchanged; "Bring us the messy
system" stays).

## Voice rules (from the house prose style — binding)

- One concrete claim per line. If a competitor could paste the line unchanged onto
  their site, rewrite or delete it.
- Short words, active voice. No "comprehensive", "robust", "seamless", "leverage",
  "ensure", "cutting-edge", "state-of-the-art".
- Numbers over adjectives. "1,336 backend functions" beats "a powerful backend".
- Honesty is a feature. Pre-launch is "pre-launch". A pilot seed is "pilot-ready".
  Polis's own honest-status discipline is part of the pitch.

## Copy anti-patterns (from the 2026-07-28 editorial audit — check before adding copy)

These are the habits that made the copy read machine-written. They recur; watch for them.

1. **One fact, five wordings.** Repeating a line *verbatim* reads as a position; repeating
   it in variants reads as a machine generating variants. Each fact gets ONE canonical
   sentence, reused character-for-character (the Voyager QR line, the contract-files line,
   each honest-status label). Never paraphrase to avoid repetition.
2. **Status labels are the product.** Exactly these spellings, everywhere: Voyager
   "Pre-launch" · Polis "Open source · AGPL · pre-deployment" · Funda "Active build" ·
   MidiFlow "Pre-launch" · Patchbay "Pre-launch" · Client sites "Live · Vrsar".
   Inconsistent labels disprove the pitch they carry.
3. **Sentence-shape templates.** "N X, one Y." and "X is not A. It is B." are the house
   voice in small doses. Rule: no antithesis in a section intro, never two in consecutive
   sentences, and no more than three per page. Never run the same construction three
   times in a row (anaphora is the loudest tell).
4. **Announcing intros.** Label → title → intro all saying the same thing before any
   content arrives. Say it once, then say something new.
5. **Abstraction where evidence exists.** If a number from Approved facts fits, use the
   number. Unfalsifiable principles ("clarity before spectacle") do not earn their space.
6. **Say only what is true of today's status.** We do not "operate" pre-launch platforms;
   the public roster is one live site, not "client sites" plural.

### Lexicon budget (added 2026-07-28)

The copy drifted into abstract-noun bloat: "system", "contract", "delivery", "platform",
"pipeline" doing work that concrete nouns should do, so every section read as a restatement
of the last. The fix is not synonyms. Name the object: `AGENTS.md` and `DESIGN.md` instead of
"the contract files", "Agent Ops Cockpit" instead of "our delivery system", "the Playwright
audit" instead of "the automated pipeline", "Voyager, Polis and Funda" instead of "three
platforms of our own". Where an approved number fits, use the number.

**One canonical carrier per term.** Everywhere else, say the concrete thing.

| Term | Owner | Budget elsewhere |
|---|---|---|
| contract | `/method` (AGENTS.md and DESIGN.md are literally contract files) | 0 |
| agent · agents | `/method`, plus the operating rule wherever it is quoted | ≤2 per namespace |
| pipeline | `/work/client-sites` (the Instagram-to-deployed-site pipeline) | ≤1 per namespace |
| delivery | nowhere — say "Agent Ops Cockpit", or name the files | ≤1, UI labels only ("In delivery") |
| platform · platforms | `/work/voyager` ("place-intelligence platform") | 0 — name Voyager, Polis, Funda |
| system | the protected CTA "Bring us the messy system", the home H1, `/about` step "Map the system" | ≤2 per namespace |
| source | `/work/polis` ("source document") | ≤2 per namespace; "Open source" as a status label does not count against prose |
| layer | the doctrine definition on the home hero lead ("the layer a person meets a system through"); `/work/polis` (accountability layer) | 0 |
| proof · evidence | section labels on `/work/*` | ≤1 per namespace |
| interface | the tagline, the doctrine, the house line, the admission test, and the canonical "the interface for/to X" product lines | ≤2 in free prose per namespace, and only in the doctrine sense ("the interface for/to X", "an interface between A and B"). Never "user interface", "UI", "interface design", or "interfaces" meaning screens. |

**Namespace ceiling: ~35 hits per 1,000 words.** Three namespaces sit structurally above it
and that is expected — the metric counts proper nouns and canonical labels it cannot
distinguish from prose:

- **Footer** (~93/1k): 75 words carrying "Agent Ops Cockpit" ×2, "Polis Interface",
  "Open source", the protected colophon and the protected CTA. Every remaining hit is a
  product name or a protected line. Nothing left to cut.
- **HomePage** (~53/1k): the H1 and its meta title, three product names, the canonical status
  labels, and image alt text account for roughly two thirds. Prose-controllable share is
  ~17/1k.
- **Method** (~39/1k): owns "contract" and "agents" by design.

Note the density script tokenises `AGENTS.md` as "agents" and counts it. Filenames are proper
nouns, not abstraction — mask them before judging a number.

**Check before shipping copy:**

```
python3 - <<'EOF'
import json,re,collections
d=json.load(open('apps/web/src/messages/en.json'))
KEY=["system","contract","delivery","agent","agents","proof","interface","pipeline","operating",
     "layer","source","build","builds","built","evidence","platform","platforms","orientation",
     "verified","verifiable"]
def collect(o,acc):
    if isinstance(o,dict):
        for v in o.values(): collect(v,acc)
    elif isinstance(o,list):
        for v in o: collect(v,acc)
    elif isinstance(o,str): acc.append(o)
for ns,val in d.items():
    acc=[]; collect(val,acc)
    text=" ".join(acc).replace('AGENTS.md','FILE1').replace('DESIGN.md','FILE2')
    words=re.findall(r"[a-z][a-z'-]+",text.lower())
    if len(words)<40: continue
    c=collections.Counter(words); hits={k:c[k] for k in KEY if c[k]}
    print(f"{sum(hits.values())/len(words)*1000:6.1f}/1k  {ns:22s} {len(words):5d}w   {hits}")
EOF
```

The four locale files must keep identical key paths and array lengths; a translation that
drops the concrete noun and restores the abstract one re-opens the problem in that language.

Lines that carry the site's voice — the honest-status notes, "Bring us the messy system",
the footer colophon, "There are no screenshots on this page", "Counted from the repository,
not estimated", "Pre-launch means pre-launch", "No mock-ups — this is the terminal we work
in", the whole ContactForm namespace — are load-bearing. Tighten around them; do not smooth
them out.

## Forbidden claims (stale docs overstate these; an informed reader will check)

- Voyager: NO production launch, NO real end users, NO Arabic/RTL, NO "10+ languages"
  (say six), NO "end-to-end test coverage" (say "1,580 automated tests").
- Polis: NO production deployment, NO real pilot (the pilot is simulated and says so —
  that honesty can be quoted). It IS open source (AGPL) — link only after verifying the
  GitHub repo is publicly reachable.
- Prism: do not present as a working outreach engine. Leave it off the site.
- herdr, omp, HyperFrames: third-party tools we operate, not our inventions. Claim
  integration and operating discipline, never authorship.
- homebase: currently down. Do not claim as live infrastructure.
- Do not say "repo-owned memory" — say "repo-owned context, tasks, and contracts".
- No invented client names, testimonials, or metrics. Only what's in this document.

## Approved facts and numbers

**Client sites — the public roster is Velum, and only Velum.**

Publishable today:
- https://velum-winebar.com — café/wine bar, Vrsar waterfront. HR/EN,
  LocalBusiness JSON-LD, hreflang. Motion graphics by the same studio (Remotion).
  Captures live at `apps/web/public/proof/sites/velum-{desktop,mobile}.png`.

**Built but NOT deliverable — do not name, link, screenshot, or count (2026-07-28):**
cannaclean, astyle-marine, vrsar-boat-tours. These sites exist and run, but the clients
have not been handed them. The repo is public, so their captures were deleted from
`apps/web/public/proof/sites/` rather than merely unreferenced. Do not re-add a name, a
URL, a capture, or a headcount that includes them until the owner says otherwise —
"three more in delivery", unnamed, is the most the site may say.

Because of this: no "four live sites" phrasing anywhere — not in copy, not in metadata
descriptions, not in a stat cell, not in a status label. Figures on the client-sites
page count the pipeline (six steps, two languages on the live site), not the roster.

- Delivery claim: the pipeline is the claim, not the clock. Say "one continuous pass",
  "one automated pipeline", "the date we give you holds". Do NOT say "in days", "several
  in a single day", "the same day", "live this week", and do not put a delivery
  day-count in a stat cell. The timeline is real; stated as a day-count it reads cheap.
- Pipeline: Instagram profile → content analysis → design tokens from the client's brand
  → Astro build (HR-first i18n, JSON-LD, hreflang) → automated Playwright audit
  (including per-image aspect-ratio checks) → Cloudflare Pages deploy.

**Voyager** (proprietary, pre-launch): verified place-intelligence platform for tourism
destinations. One QR code gives a restaurant a multilingual AI host grounded in its own
menu and hours; the tourist board gets an official controllable content layer; visitors
get a map-first app with on-foot routing in their language.
- ~365,000 lines of first-party TypeScript · 220 database tables · 1,336 backend
  functions · 312 routes across seven product surfaces · six languages · 286 test files,
  ~1,580 cases · 20 months, 1,080 commits.
- Real engineering to name: fine-grained multi-tenant authorization (WorkOS FGA with a
  synchronous grant cache and a source-level authorization regression test); intent-routed
  retrieval that sends "opening hours" to structured lookup and menu photos to a
  multimodal index instead of forcing everything through one vector store; self-hosted
  scraping and OSRM pedestrian routing services (live on Railway) instead of rented APIs;
  a governed design system with 16 subsystems and its own test suite.
- Pilot-ready with seeded content for Turistička zajednica Vrsar (Vrsar–Orsera, Istria):
  named trails, sea-water-quality signals, shuttle timetables, events.

**Polis Interface** (open source, AGPL, pre-deployment): civic infrastructure for
verifiable government data — a governance graph where every public claim traces to a
source document.
- ~25,000 lines across 16 services and 4 apps · 55 Postgres tables · 10 OPA/Rego policy
  modules enforced at runtime · ~100 unit tests + 17 acceptance scripts.
- Real engineering to name: an append-only audit ledger hash-chained inside the insert
  transaction so concurrent writers cannot fork it; document verification with RFC 3161
  timestamping and eIDAS-shaped e-seals; policy gates that fail closed; an accountability
  layer where an elected official cannot mark their own promise "delivered".
- Its docs label every surface [verifiable], [demonstration/stub], or [not yet live] —
  present this labeling discipline as part of the work.

**Funda** (active build): funding-opportunity platform matching organizations to EU
funding. Multi-role SaaS (admin/consultant/corporate/director), AI-agent ingestion of
EU sources (SEDIA/TED), geospatial matching, three languages. Next.js + Convex + Clerk.

**MidiFlow** (proprietary, pre-launch): a music app. It runs as an installed app and has
been tested on a phone; it is not published. Nothing else is approved: no store link, no
screenshot, no counts, no feature list beyond the canonical claim line. Spell it "MidiFlow".

**Patchbay** (proprietary, pre-launch): an interface for artists making work together.
A build is online at a domain that is not yet public. Do not name or link the domain,
do not screenshot it, do not describe features beyond the canonical claim line. The
branding is in progress; use the plain word "Patchbay" set in body type, no mark.

**Delivery system / method:**
- AOC is public: github.com/basicalex/agent-ops-cockpit — Apache-2.0, 403 commits,
  8 Rust crates, 51 CLI commands.
- Thirteen of our repos run the same versioned agent contract: a behavioral contract
  (AGENTS.md), a design contract (DESIGN.md), a generated context snapshot, and a task
  ledger, on a schema with migrations.
- The operating rule: agents propose, a human-verified gate commits. Workers never push;
  the orchestrator re-reads the diff and runs the checks before an atomic commit lands.
- Output evidence: 383 commits landed on Voyager in July 2026 alone.

**Company:** INTRFACE — IT consulting and business development, Istria, Croatia / EU.
Contact hello@intrface.eu. (About-page specifics beyond this: keep minimal and factual;
do not invent founders' bios, team size, or history.)

## Information architecture

All routes under `apps/web/src/app/[locale]/`:

| Route | Page component (owner file) | Content |
|---|---|---|
| `/` | `components/pages/home-page.tsx` | See "Home page order" under Positioning |
| `/work` | `components/pages/work-index-page.tsx` | Ledger of the six interfaces in the canonical table; MidiFlow and Patchbay rows have no case page and no link |
| `/work/voyager` | `components/pages/work-voyager-page.tsx` | Case study |
| `/work/polis` | `components/pages/work-polis-page.tsx` | Case study |
| `/work/funda` | `components/pages/work-funda-page.tsx` | Case study |
| `/work/client-sites` | `components/pages/work-client-sites-page.tsx` | Istria client-site case study: the Velum exhibit, the pipeline, an unnamed "in delivery" note |
| `/method` | `components/pages/method-page.tsx` | The agent-orchestrated delivery system, linking the public AOC repo |
| `/about` | `components/pages/about-page.tsx` | The doctrine and the admission test, who/where/how we engage, own products incl. MidiFlow and Patchbay, contact form |
| `/imprint` | `components/pages/imprint-page.tsx` | Legal/imprint basics for an .eu company |

Case pages follow one shared shape (shared components, see below): case hero (name,
one-line claim, status label, stat band) → narrative sections → evidence (screenshots or
labeled diagram) → honest-status note → CTA to contact.

## File ownership (parallel-safety map)

- **Foundation agent** owns: `app/**` route files, `layout/header.tsx`,
  `layout/footer.tsx`, `site/mobile-nav.tsx`, root layout / fonts / metadata infra
  (sitemap, robots, JSON-LD, hreflang), shared case-study components under
  `components/case/`, stub page components, `components/site/contact-form.tsx` (stub),
  `site/process-steps.tsx` (remove complete/active/pending semantics), public/ cleanup.
- **Page agents** own exactly their page component file plus new components under a
  page-specific dir (`components/work/voyager/` etc.). They do NOT edit layout, app
  routes, messages files, globals.css, or other pages.
- **Home agent** additionally owns `site/system-map.tsx`, `site/proof-tabs.tsx`.
- **About agent** owns `contact-form.tsx` internals + Convex wiring (`apps/web`
  package.json convex dep, server action). Form falls back to mailto when
  `NEXT_PUBLIC_CONVEX_URL` is unset — build must never break on missing env.
- **i18n agent** (after page agents): moves all copy into `messages/{en,de,fr,hr}.json`,
  translates, fixes `<html lang>`; only it touches messages files.
- Screenshots land under `apps/web/public/proof/<slug>/`. Only the agent assigned a
  given slug writes there.

## Design rules

`DESIGN.md` at repo root is the binding contract (paper/ink/teal, Google Sans Flex,
`.type-*` classes, TactileButton, Tabler icons, 180–500 ms motion, reduced-motion
support). Known violations to not repeat: no inline arbitrary heading sizes, no
re-hardcoded hexes, nothing under 0.78rem except uppercase tracked labels, correct
heading hierarchy. Vary section forms (band / ledger / diagram / steps), don't default
to card grids. The stale lowercase `design.md` is deleted; ignore its direction.
