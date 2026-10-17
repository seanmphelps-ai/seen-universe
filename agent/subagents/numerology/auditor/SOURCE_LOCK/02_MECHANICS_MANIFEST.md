# MECHANICS MANIFEST — Numerology

Every rule: SOURCE → INPUT → RULE → OUTPUT → INTERPRETATION AUTHORITY

Default system label: `pythagorean`. Chaldean only when `systemLabel: "chaldean"` on name numbers.

---

## M1. Pythagorean letter map
- **SOURCE:** Goodwin Vol.1 Ch.2 chart
- **INPUT:** Latin letter A–Z (case-insensitive)
- **RULE:** A=1 … I=9, J=1 … R=9, S=1 … Z=8. Letter ordinals always reduce (K→2). Masters arise from *sums*, not letter indices.
- **OUTPUT:** digit 1–9 per letter
- **INTERP AUTHORITY:** n/a (calc only)

## M2. Reduction + master keep
- **SOURCE:** Goodwin Vol.1; CoS default 2026-09-20
- **INPUT:** positive integer sum
- **RULE:** Digit-sum until single digit **except** keep **11** or **22** when reached. Do **not** keep 33/44 as masters by default.
- **OUTPUT:** `1..9 | 11 | 22` (default)
- **INTERP AUTHORITY:** Goodwin/Decoz charts for kept values

## M3. Life Path
- **SOURCE:** Goodwin Vol.1
- **INPUT:** birth date Y-M-D
- **RULE:** Reduce month, day, year each to digit/master; sum the three; reduce again to digit/master (11/22 kept).
- **OUTPUT:** `lifePath: number` + optional `lifePathCompound` if debt compound
- **INTERP AUTHORITY:** Jordan/Decoz/Goodwin Layer C

## M4. Birthday
- **SOURCE:** Goodwin Vol.1
- **INPUT:** day of month
- **RULE:** Reduce day to digit/master. If day ∈ {13,14,16,19}, flag Birthday karmic debt even after reduction.
- **OUTPUT:** `birthday: number`, `karmicDebts[]` may include birthday position
- **INTERP AUTHORITY:** Layer C debt texts (contested)

## M5. Expression / Destiny
- **SOURCE:** Goodwin / Decoz
- **INPUT:** full birth name, split into name parts
- **RULE:** Sum all letters per part → reduce each part → sum parts → reduce. Never one continuous string sum.
- **OUTPUT:** `expression: number`
- **INTERP AUTHORITY:** Jordan/Decoz/Goodwin

## M6. Soul Urge / Heart’s Desire
- **SOURCE:** Goodwin / Decoz
- **INPUT:** vowels of full birth name, per part
- **RULE:** Vowels A E I O U always. Y and W conditional (Goodwin: Y vowel if sole vowel in syllable, or when preceded by A/E/I/O/U as one sound; W vowel when preceded by A/E/I/O/U as one sound). Same per-part reduction.
- **OUTPUT:** `soulUrge: number`
- **INTERP AUTHORITY:** Jordan/Decoz/Goodwin

## M7. Personality (consonants)
- **SOURCE:** Jordan/Decoz naming; Goodwin consonant math (= Secret Self)
- **INPUT:** consonants of full birth name, per part
- **RULE:** Same per-part reduction as Expression.
- **OUTPUT:** `personality: number` with footnote field `personalityAlsoKnownAs: "Secret Self (Goodwin)"`
- **INTERP AUTHORITY:** Jordan/Decoz (label); Goodwin (Secret Self delineation footnote)

## M8. Karmic debts 13 / 14 / 16 / 19
- **SOURCE:** Goodwin Ch.11; Decoz
- **INPUT:** pre-reduction compound on core totals (Life Path, Expression, Soul Urge, Birthday)
- **RULE:** If compound ∈ {13,14,16,19}, emit `13/4`, `14/5`, `16/7`, `19/1` for that position.
- **OUTPUT:** `karmicDebts: Array<{ position, compound, reduced }>`
- **INTERP AUTHORITY:** Layer C — meanings contested by school; do not invent

## M9. Chaldean name numbers (opt-in)
- **SOURCE:** Cheiro letter table
- **INPUT:** chosen name string (often current/known-as); `systemLabel: "chaldean"`
- **RULE:** Map 1:A I J Q Y · 2:B K R · 3:C G L S · 4:D M T · 5:E H N X · 6:U V W · 7:O Z · 8:F P · no letter=9. Prefer compound then root. Does **not** replace Pythagorean Life Path.
- **OUTPUT:** labeled Chaldean name total only
- **INTERP AUTHORITY:** Cheiro compound tables (labeled)


---

> **M10–M14 status (MF-NUM-002, 2026-10-12):** The books (A1/A2) are **not on the box**; no chapter or page could be verified.
> These rules are attributed to Decoz (A2) as commonly documented, but are **MISSING a verified chapter citation** and are
> **not established calculation in this lock**. Code tags every such row `schoolTags: mechanic-unverified` and a
> `missing[]` entry. Promote to established only after a chapter/page check against A2 (and A1 where applicable).

## M10. Maturity — MISSING citation
- **SOURCE:** Decoz (A2), chapter UNVERIFIED
- **INPUT:** Life Path, Expression
- **RULE:** reduce(LP + Expression), masters 11/22 kept (M2). No karmic-debt read (not in M8).
- **OUTPUT:** `maturity`

## M11. Pinnacles — MISSING citation
- **SOURCE:** Decoz (A2), chapter UNVERIFIED
- **INPUT:** birth month, day, year each reduced to a single digit (no master keep on inputs); Life Path
- **RULE:** P1=m+d, P2=d+y, P3=P1+P2, P4=m+y (sums reduced per M2). P1 ends at age 36 − single-digit LP (masters reduced, e.g. 11→2; **UNKNOWN** whether Decoz uses 36−2 or 36−11); P2, P3 nine years each; P4 open-ended (`endAge:null`; t514 types `endAge:number` — shape drift noted).
- **OUTPUT:** 4 × {number, reducedFrom, startAge, endAge}

## M12. Challenges — MISSING citation
- **SOURCE:** Decoz (A2), chapter UNVERIFIED
- **INPUT:** single-digit month, day, year
- **RULE:** C1=|m−d|, C2=|d−y|, C3=|C1−C2|, C4=|m−y|; same age spans as M11. Range 0–8.
- **OUTPUT:** 4 × {number, startAge, endAge}

## M13. Personal Year / Personal Month — MISSING citation
- **SOURCE:** Decoz (A2), chapter UNVERIFIED; range per t514 `numerology_schema_t514.md` ("1-9 cycle")
- **INPUT:** birth month, day; injected current date
- **RULE:** PY = reduce₁₋₉(month + day + UY); PM = reduce₁₋₉(PY + calendar month). **No master keep** (t514).
- **OUTPUT:** 1–9

## M14. Universal Year — MISSING citation
- **SOURCE:** Decoz (A2), chapter UNVERIFIED
- **INPUT:** injected current year
- **RULE:** reduce₁₋₉(year digits)
- **OUTPUT:** 1–9

## Implementation notes (2026-10-12)
- **M5–M7 name normalization:** Unicode NFD then strip combining marks (JOSÉ ≡ JOSE). Letters still outside A–Z (e.g. Ø, ß, non-Latin) → name numbers withheld with `MISSING: non-ASCII orthography (U4)`.
- ~~M6 operationalization (Y/W simplification)~~ Struck under CoS clearance rule 3. Replaced by CoS rule 5: any name containing Y or W where the heuristic isn't certain carries `Y/W heuristic (U6)` in missing[]. RYAN, BRYAN and HOWARD are tested. Struck on Sean's (owner) instruction, 2026-10-16.
- **M8 single-part names:** the part sum is the core total's compound (JOSE 13/4 → debt 13 on Expression). Personality and Maturity are not debt positions.
- Hyphenated names are one part (lock silent; ADV-NUM-005).
