# SEEN RUNTIME — ONE FILE

Intake in. Incubator add-on. One agent per modality. Same calc for agent and auditor. Felt-experience checkboxes stay blank until the user fills them. Nothing seeded.

---

## 1. INTAKE (user fills, system stores)

Stage 0 — Identity: name (self / ex / parent / child)
Stage 1 — Birth Anchor: birthDate ISO, birthCity {name, country, lat, lon} — coordinates only, for ephemeris
Stage 2 — Lived Exposure: array of {place {name, country, lat, lon}, startYear, endYear | null, yearsLived derived}. Rule: counts only when yearsLived >= 0.5. 1993 LA and 2026 LA are two separate entries. Birth place, every 6+ month place, current place, maternal pregnancy place are separate snapshots.
Stage 3 — Felt Experience (blank at intake, user answers per place): five to ten checkbox prompts — safety, belonging, noise, opportunity, who was around, what got rewarded, what got punished, what the child learned is safe, what is dangerous. Structured intake, not paragraphs. Empty stays empty.

Forbidden: environment before date. Optional time. Noon as stand-in.

---

## 2. INCUBATOR (add-on layer, not location)

Place trains the person. The chart is a cutting. The place is pot, weather, soil. Incubator and chart are equal forces.

Law: duration, recurrence, intensity, pathway decide the dose. Six months is enough contact for a place to count.

Order: date and city first so the place can be year-cut. Lived places with years collected with the date. Time still unknown. Incubator cards name the soil before the clock is treated as known. Time cards name how the system blows under pressure. Two jobs.

Training chain per locked place: Environment → Pressure → Trigger → Adaptation → Behavior → Belief → Capacity → Cost → Consequence.

Round 1 — same city, three soils: Western lean, Vedic lean, Blended/corridor. User picks the field they lived. Gift and cost together. Then tighten: neighborhood, hill vs flats vs projects vs rural, school vs block, year-cut, class stratum. Still three cards. Still gift and cost.

Every card: era, stratum, gift, cost, rewarded, punished, normalized, aspired toward, afraid of losing, where money goes, under pressure on THIS soil, routes into 45 life sections, pre-charge into 64 identifying archetypes.

Helix: places sit on a strand. Pick a place, see the cards. Pick an identifying archetype on that place, see full extraction: trigger, pressure, behavior, collapse, thrive, cost to self, cost to others, what is lost.

Forbidden: incubator page before date. Seed stays constant. Incubator only whispers. One-line cards. Gift-only or cost-only. Averaging places. Using current evidence to fake a missing historical year.

---

## 3. CALCULATION (MCP, not wrappers)

No lib wrapper files. No second calc path. Agents and auditors call the same MCP tool.

| Modality | MCP / Package | Notes |
|---|---|---|
| Western | caelus-mcp (MIT, no ephemeris files, 3400 golden checks vs Swiss) | Commercial-clean. Replaces swisseph-wasm for Western. |
| Hellenistic | caelus-mcp | Same engine, Hellenistic rules layer on top. |
| Jyotisha | @swisseph/node (bundles ephemeris, 2MB, zero config) or caelus sidereal | Lahiri/Raman/Fagan-Bradley ayanamsha choice locked per source. |
| BaZi | OpenEphemeris MCP (52 typed tools, includes BaZi + Human Design) | lunar-javascript as fallback. |
| Human Design | OpenEphemeris MCP | free-human-design as fallback. |
| Dreamspell | dreamspell-math (npm, MIT) | kin, year kin, moon day, oracle kin. |
| Tzolk'in | maya-dates or Mayan Stele MCP | GMT correlation 584283. |
| Numerology | aryaminus astro repo (19 modes, MCP + skill file) | Pythagorean, Goodwin+Decoz sourced. |
| I Ching | no calc authority yet — fails closed | 64 identifying archetypes stay separate layer. |

Auditor rule: same package as the agent. Diff is shape check + calcAuthority match + field-for-field on the same intake. Not a different library. Different libraries mean arguing whose math is canonical with no ground truth.

---

## 4. PIPELINE

INTAKE → ABIOTIC → SOCIAL EVIDENCE → STRUCTURED SIGNALS → ENVIRONMENTAL PRESSURE FIELD → SOURCE CALCULATIONS → SYNTHESIS → RESONANCE → VERIFY

Every incubator-period evaluated independently before comparison. Preserve presence and absence, timeframe, provenance, confidence, contradictions, requested vs matched geography.

Skill order: intake → social-pull → narrative-extract → chart-gen → resonance → verify.

MCPs: browser-mcp (social pull, preserves source/timeframe/geography/provenance), postgres-mcp (persists structured intake, incubator records, evidence, calcs, provenance), caelus-mcp / OpenEphemeris MCP (calc authority).

Chief agent: one door. Does not read a chart. Does not calculate. One tool: dispatch. Pass one lineage and the verified record. Dispatch runs that lineage, then its auditor, returns both. One lineage per call.

Stage 1: modality subagents run in parallel (Promise.all). Stage 2: full output to 64 identifying archetypes. No scoring, no filtering. Stage 3: file into 45 life sections. Empty section = visible silence.

Time rectification: Round 1 generates three hidden-time summaries at 04:00, 12:00, 20:00. User picks. Each following round narrows ±3h, ±2h, ±1h. Rectified time supplied to time-dependent calculators.

Dark cards: paragraph, minimum three sentences. Must contain trigger, pressure point, behavior, where it collapses, where it thrives, cost to them, cost to others, what is lost if it runs one more cycle. Lived exposure shapes the sentence. If it reads like a horoscope, reject it. No planet names, no house numbers, no Jung, no personality bands, no scoring on first cards.

---

## 5. WHAT GETS ERASED

All nine -auditor dirs. All nine auditor.md files. All nine instructions.md files. .agents/agents/native-system-auditor.md. WESTERN_AUDITOR block in western/agent.ts. Numerology auditor subdir. auditNative and pending_auditor from execution.ts. The seven wrapper files (baziCalc, natalChart, hellenisticCalc, humanDesignCalc, dreamspellCalc, tzolkinCalc, jyotishaAstronomy) — inline the raw package call or route through MCP.

Portals term retired. No branch sprawl. One runtime.

---

## 6. SEEN PRODUCT

Closure & Composure. A person enters birth data once. Nine systems run independently. Two people enter → three recognizable comparative shadows return → user selects the true pattern → SEEN explains what happened → Cadence begins.

Stack: React, TypeScript, Zod, Supabase, Vercel, GitHub. GSAP and Lenis for motion. AGENTS.md as universal spec. Dot-agents: conductor, auditor, builder, skills. Spine branch: closure-and-composure. This file: runtime-one.

Palette: near-black #070605, antique gold #E6C98A, cream #F4EAD8.

---

Soil does not rewrite the seed. Soil can change the outcome.
