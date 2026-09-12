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

### The doctrine — approved wording; the home page may use the house thesis alone

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

The `/about` H1 is, character for character: *"Intrface is about building the most
human interfaces solving the most worthwhile problems."* Set on 2026-09-11 by owner
decision.

The "Don't make people operate X software. Help them Y." construction is an antithesis
and counts against the per-page budget below. Use it at most once per page, never as a
list.

### Canonical product lines — character-for-character everywhere they appear

| Product | The interface … | Pair | Status label (exact) | Claim line (exact) |
|---|---|---|---|---|
| Voyager | for a place | visitor ↔ place | Live | A public map for discovering places around Vrsar. |
| Polis | Civic interfaces | citizen ↔ institution | Coming soon | — |
| Funda | EU funding | organization ↔ funding | Coming soon | — |
| MidiFlow | Music | musician ↔ sound | Coming soon | — |
| Patchbay | Creative collaboration | artist ↔ artist | Coming soon | — |
| Client sites | between a business and its customers | customer ↔ business | Live | Velum and AstyleMarine: public sites for a waterfront café and wine bar and a yacht charter in Istria. |

The pair may be rendered with the ↔ glyph or as two words on a rule; whichever, the
same treatment on every row. Use "Polis", "Funda", "MidiFlow", and "Patchbay" everywhere,
including footer and metadata. For these four unreleased products, the table gives
the entire public description: name, translated "Coming soon", and at most one
short domain. Minimal identity pairs may stay; do not add a second claim line.

### Tagline and metadata

- Tagline, exact: **Interfaces for the world.** It is the home H1, the `Metadata.tagline`,
  the OG-image tagline and the first sentence of the footer tagline.
- `Metadata.description` names the six interfaces in one sentence and the place (Vrsar,
  Istria). No "IT consulting" in the description; the registered activity lives in the
  `/about` facts ledger and the imprint only.

### Home page order

Experience mode (owner update, 2026-09-07): work leads; the interface recedes.
Hero and pair ribbon → selected project previews (Velum, Voyager, AstyleMarine;
`#for-businesses` remains here) → compact five-product index → short house thesis
→ contact. Each preview links to its own showcase. Show finished public work,
not production process, engineering metrics, pilot disclosures, or delivery claims.

## Voice rules (from the house prose style — binding)

- One concrete claim per line. If a competitor could paste the line unchanged onto
  their site, rewrite or delete it.
- Short words, active voice. No "comprehensive", "robust", "seamless", "leverage",
  "ensure", "cutting-edge", "state-of-the-art".
- Numbers over adjectives. "1,336 backend functions" beats "a powerful backend".
- Unreleased products say "Coming soon", translated in every locale. Do not
  publish their technical status, pilot details, or readiness claims.

## Copy anti-patterns (from the 2026-07-28 editorial audit — check before adding copy)

These are the habits that made the copy read machine-written. They recur; watch for them.

1. **One fact, five wordings.** Repeating a line *verbatim* reads as a position; repeating
   it in variants reads as a machine generating variants. Each fact gets ONE canonical
   sentence, reused character-for-character (the Voyager QR line, the contract-files line,
   each honest-status label). Never paraphrase to avoid repetition.
2. **Status labels stay consistent.** Voyager and client sites say "Live"; Polis,
   Funda, MidiFlow, and Patchbay say "Coming soon". Translate these labels in
   German, French, and Croatian.
3. **Sentence-shape templates.** "N X, one Y." and "X is not A. It is B." are the house
   voice in small doses. Rule: no antithesis in a section intro, never two in consecutive
   sentences, and no more than three per page. Never run the same construction three
   times in a row (anaphora is the loudest tell).
4. **Announcing intros.** Label → title → intro all saying the same thing before any
   content arrives. Say it once, then say something new.
5. **Abstraction where evidence exists.** If a number from Approved facts fits, use the
   number. Unfalsifiable principles ("clarity before spectacle") do not earn their space.
6. **Say only what is true of today's status.** We do not "operate" pre-launch platforms;
   Voyager is live; the approved public client roster is Velum and AstyleMarine.

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
| source | No unreleased-product source claims or repository promotion | ≤2 per namespace |
| layer | the doctrine definition on the home hero lead ("the layer a person meets a system through") | 0 |
| proof · evidence | section labels on `/work/*` | ≤1 per namespace |
| interface | the tagline, the doctrine, the house line, the admission test, and the canonical "the interface for/to X" product lines | ≤2 in free prose per namespace, and only in the doctrine sense ("the interface for/to X", "an interface between A and B"). Never "user interface", "UI", "interface design", or "interfaces" meaning screens. |

**Namespace ceiling: ~35 hits per 1,000 words.** Three namespaces sit structurally above it
and that is expected — the metric counts proper nouns and canonical labels it cannot
distinguish from prose:

- **Footer**: product names may remain. Unreleased-product repository links,
  licence labels, and promotional source descriptions must not return.
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
them out. This protection does not apply to retired Polis/Funda case-study or
unreleased-product status copy; remove those details from public translations.

## Forbidden claims (stale docs overstate these; an informed reader will check)

- Voyager is now in production (owner confirmation, 2026-09-07). Do not infer
  real users or adoption from launch. NO Arabic/RTL, language-count, test-coverage,
  repository-metric, or unverified outcome claims in the public showcase.
- Polis, Funda, MidiFlow, and Patchbay: no public features, architecture, licences,
  metrics, repository promotion, source links, screenshots, or technical status.
  A repository being reachable does not authorize promotion before release.
- Prism: do not present as a working outreach engine. Leave it off the site.
- herdr, omp, HyperFrames: third-party tools we operate, not our inventions. Claim
  integration and operating discipline, never authorship.
- homebase: currently down. Do not claim as live infrastructure.
- Do not say "repo-owned memory" — say "repo-owned context, tasks, and contracts".
- No invented client names, testimonials, or metrics. Only what's in this document.

## Approved facts and numbers

**Client sites — the approved public roster is Velum and AstyleMarine.**

Owner approval (2026-09-07) permits both names, production links, and fresh captures:
- https://velum-winebar.com — café and wine bar, Vrsar waterfront. HR/EN.
- https://www.astylemarine.com — private yacht experiences from Poreč along the
  Istrian coast. The public site presents itineraries, the yacht, and enquiries.
- Captures: `apps/web/public/proof/projects/{velum,astyle-marine}/` with
  `desktop.webp`, `detail.webp`, and `mobile.webp` for each project.

**Still private — do not name, link, screenshot, or count publicly:** cannaclean,
vrsar-boat-tours. Their exclusions remain unchanged. Do not publish unnamed
pipeline counts, fake client counts, production-process copy, or delivery day counts.

**Voyager** (proprietary, live): https://voyager.intrface.eu. The public Atlas at
`/scout/atlas` maps places around Vrsar and can be explored without signing in.
Show production captures at `apps/web/public/proof/projects/voyager/` using
`desktop.webp`, `detail.webp`, and `mobile.webp`. Public availability does not
establish user numbers, adoption, or outcomes. Retire the engineering/stat/pilot
showcase; describe only the visible public work.

**Unreleased products — public scope (owner update, 2026-09-07):**
- **Polis**: Civic interfaces. Coming soon.
- **Funda**: EU funding. Coming soon.
- **MidiFlow**: Music. Coming soon.
- **Patchbay**: Creative collaboration. Coming soon.

Translate the domain and status in en/de/fr/hr. Keep canonical names. These lines
replace all previous approval for features, architecture, metrics, licences,
source/repository links, device tests, private-domain status, and case-study detail.
The restriction covers Home, Work, About product entries, metadata, footer
promotion, and serialized translations. Do not restore retired details before
owner approval to publish them. Preserve the live Voyager, Velum, and
AstyleMarine showcases and their assets.

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
| `/work` | `components/pages/work-index-page.tsx` | Velum, Voyager and AstyleMarine previews, then minimal coming-soon entries; Polis/Funda may link to their notices, MidiFlow/Patchbay have no routes |
| `/work/voyager` | `components/pages/work-voyager-page.tsx` | Screenshot-first production showcase |
| `/work/velum`, `/work/astyle-marine` | `components/work/project-showcase.tsx` | Separate screenshot-first client showcases |
| `/work/polis` | `components/pages/work-polis-page.tsx` | Minimal coming-soon page: name, short domain, status, back-to-work and contact links |
| `/work/funda` | `components/pages/work-funda-page.tsx` | Minimal coming-soon page: name, short domain, status, back-to-work and contact links |
| `/work/client-sites` | `components/pages/work-client-sites-page.tsx` | Concise client index linking separate Velum and AstyleMarine showcases; no process copy |
| `/about` | `components/pages/about-page.tsx` | The doctrine and the admission test, who/where/how we engage, own products incl. MidiFlow and Patchbay, contact form |
| `/imprint` | `components/pages/imprint-page.tsx` | Legal/imprint basics for an .eu company |

Polis and Funda keep their routes, not their former case studies. Remove retired
case-study and diagram copy from all four locale files, not just from rendered
components: translations serialize publicly. Do not create MidiFlow/Patchbay routes.
The three production showcases
use a name, one-sentence role, live-site link, desktop/detail/mobile screens, brief
overview, project navigation, and contact CTA. No process or metrics.

Other case pages follow their existing shared shape (shared components, see below): case hero (name,
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
