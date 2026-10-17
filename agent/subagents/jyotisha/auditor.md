// PROVENANCE: bot=codex session=2026-10-08 task=affirmative repository instruction follow-up
# Independent Jyotish Auditor

Independently reconstruct the named school's required techniques from the locked sources before reviewing the reader's output. Check source, edition, calculation trace, convention, uncertainty, and completeness of the whole native reading. Compare every source-supported wound and shadow finding against the reading; report omissions and contradictions. Preserve school distinctions, especially nakshatra and dasha variants. Report explicit pass, fail, corrections, and unresolved records. Approve output after independent reconstruction and comparison against the locked source requirements.

Authority: `docs/jyotisha/SEEN_JYOTISHA_CANONICAL_BUILD.md`, Agent B. The source branch supplies only a general assembled-evidence auditor at `SEEN_universal/codex/eve-product-agents/agent/subagents/auditor/instructions.md`; this native audit is scoped to Jyotish.

## Vedic Auditor derivation logic and verification status (2026-10-16)

Recorded by the Vedic Auditor (Agent B). Built from `/workspace/seen-vedic/SOURCE_LOCK/*` (including `COS_LOCK_2026-10-12.md` and `COS_RULING_2026-10-12_S11_tikshna_malefics.md`) and `/workspace/seen-vedic/AUDIT/B_*.md`.

### Calculation stack (Layer B mechanics)
- Swiss Ephemeris (pyswisseph), `FLG_SIDEREAL` with `SIDM_LAHIRI` (ayanamsa about 23.5719 deg for 1979-08-01).
- Mean node (`MEAN_NODE`); Ketu = Rahu + 180 deg. CoS lock.
- Whole-sign houses counted from the lagna sign. CoS lock.
- Nakshatra = floor(sidereal longitude / 13deg20'); pada = quarter (3deg20') within it.
- Vimshottari dasha: lords and years per BPHS 46.12-15; 365.25-day years. The birth balance uses the Moon's elapsed **arc** fraction in its nakshatra. This approximates BPHS 46.16, which is time-proportional (ghatis/palas). It is a modern software convention, not the verse's literal method.

### Time handling
- The clock is taken as given. No LMT or DST edge reconstruction (CoS ruling).
- Nonexistent or ambiguous local times are REJECTED with `NONEXISTENT_LOCAL_TIME` or `AMBIGUOUS_LOCAL_TIME`. No calc, no silent shift.

### Layers
- A = raw data; B = calculated mechanics; C = traditional interpretation with verse citation; D = SEEN-derived.
- Wound or shadow framing lives only in Layer D (`seenDerived:true`). Mechanics are never labelled as wounds.

### Ref gating
- A record is emitted only if it carries at least one verified ref from a locked source. Anything else goes to `missing[]` as `GATED: <factor>`. Websites are not authority.

### Sources (verified loci)
- BPHS, R. Santhanam translation: 3.11 natural malefics (vol 1, Ch.3); 7.33-36 trika houses 6/8/12 (vol 1, p.102); 46.12-15 Vimshottari lords and years (vol 2, pp.507-508); 46.16 balance (vol 2, pp.508-509); 92.3 nakshatra gandanta (vol 2, pp.1026-1027).
- S11 Muhurta Chintamani, Khemraj Shrikrishnadas 2016 edition (Mahidhara Sharma tika), archive.org id `ytNP_muhurta-chintamani-of-daivagya-shri-ramacharya-with-hindi-commentary-by-pt.-mahi`: 2.8 tikshna/daruna (Nakshatra prakarana), 6.43 gandanta (Vivaha prakarana). Accepted by CoS ruling 2026-10-12. Checked against the djvu OCR text layer; the printed page for 2.8 was not checked.

### CoS rulings (COS_LOCK / COS_RULING 2026-10-12)
- Malefics: the written ruling (rule 3) sets the BPHS natural malefics, Sun, Mars, Saturn, Rahu and Ketu, with the waning Moon and afflicted Mercury as conditional (flagged, not hard-coded). The same ruling says the earlier Sa/Ma/Ra/Ke-only scope is withdrawn. A clarification in the same file names Sa/Ma/Ra/Ke as a SEEN wound-marker-only scope. The file contradicts itself, and the auditor treats rule 3 as governing until CoS corrects the file.
- Tikshna (an electional class from MC 2.8) may ground natal records only as Layer D, tagged "SEEN-derived; not traditional doctrine".
- Mean node, whole-sign, 365.25-day year, and DST reject are locked defaults.

### Golden vectors: 1979-08-01 Tarzana (34.1733 N, 118.5534 W, PDT), independent pyswisseph
| Local time | Lagna | Moon nakshatra / pada | Moon house | Mean Rahu | Dasha balance at birth (yrs) |
|---|---|---|---|---|---|
| 04:00 | Gemini 78.02 deg | Swati p4 | 5 | Leo | 3.3853 |
| 12:00 | Virgo 178.45 deg | Vishakha p1 | 2 | Leo | 13.9202 |
| 20:00 | Capricorn 288.40 deg | Vishakha p2 | 10 | Leo | 8.7790 |

Smoke check at 12:00 (Virgo lagna): SATURN_H12, RAHU_H12 and KETU_H6 are emitted.

### Audit history (`/workspace/seen-vedic/AUDIT/`)
| Build | Verdict | Blocking | Notes |
|---|---|---|---|
| 5097f88 | FAIL | 3 | DEF-001 to 013: wound framing in Layer B, dasha lords as wounds, self-locked node/house rules |
| cb52747 | FAIL | 1 | DEF-009 blocking (MC unadmitted, website refs); DEF-006 reopened; DEF-014, 015 new |
| db3b6a7 | PASS_WITH_DEFECTS | 0 | DEF-017 (MAJOR), DEF-018, 019, 020 (MINOR) |
| c74cee9 | PASS_WITH_DEFECTS | 0 | Open: DEF-017 MAJOR (S11 lock evidence), DEF-019, 021, 022 MINOR |
| 28bd8c7 | PASS_WITH_DEFECTS | 0 | DEF-001–022 closed; open DEF-023 MAJOR, DEF-024, 025 MINOR |
| 3aa7255 | PASS_WITH_DEFECTS | 0 | DEF-024, 025 closed; open DEF-023 MAJOR (awaiting Sean/CoS malefic lock), DEF-026 MINOR (clock vs local unchecked) |
| df9d113 | PASS_WITH_DEFECTS | 0 | DEF-026 closed; open DEF-023 MAJOR (awaiting Sean/CoS malefic lock), DEF-027 MINOR (contribution builder skips validator) |
| a2d2d04 | PASS_WITH_DEFECTS | 0 | DEF-027 closed; open DEF-023 MAJOR, DEF-028 MAJOR (builders throw on malformed input), DEF-029/030/031 MINOR |
| 8a967be | PASS_WITH_DEFECTS | 0 | DEF-028 to 031 closed; open DEF-023 MAJOR, DEF-032 to 035 MINOR (seed-hash privacy, ephemeris-pinned tolerance, loose longitude/missing[] bounds, coords vs tz unchecked) |
| ae46075 | PASS_WITH_DEFECTS | 0 | DEF-032 to 035 closed; open DEF-023 MAJOR, DEF-036 MAJOR (uncapped lagna tolerance at polar/antimeridian cells), DEF-037/038 MINOR |
| d7d7367 | PASS_WITH_DEFECTS | 0 | DEF-036 to 038 closed; open DEF-023 MAJOR, DEF-039 MAJOR (0.1 deg lagna cap drops genuine seeds at 64-66.5 deg latitude) |
| d972ced | PASS_WITH_DEFECTS | 0 | DEF-039 closed (rebased on e50d6f6); open DEF-023 MAJOR (now Vedic's classical ruling, per Sean via CoS), DEF-040 MINOR (lagna can be stripped without a verified reason) |
| 7a58f57 | PASS_WITH_DEFECTS | 0 | DEF-023 closed (full BPHS 3.11 set: Su/Ma/Sa/Ra/Ke + waning Moon + Mercury joined, no registry filter); DEF-040 closed; lagna kept at every latitude with hashed lagnaVerification flag (auditor scan 0/875 lost, incl. >66.5). Open DEF-041 MINOR (benefics in 6/8/12 labelled 'wound'), DEF-042 MINOR (key-holder lagna forgery passes in exploding-tolerance cells, flagged) |
| 63f8b11 | PASS_WITH_DEFECTS | 0 | DEF-041 closed (dusthana records signalType null, 3.11 only on malefic natures; 0/1267 violations in auditor scan); DEF-042 accepted residual, documented but no consumer caveats it yet; new DEF-043 MINOR (all-graha tikshna records still signalType 'wound', e.g. JUPITER_TIKSHNA_ASHLESHA); lagna kept at every latitude (0/600 lost) |

Defects DEF-017, 019, 021, 022 open at c74cee9 were closed at 28bd8c7.

### Status
Calculations verified against independent pyswisseph (golden vectors above). HEAD 63f8b11 (on 0e89d2b, not yet pushed) audited 2026-10-16: PASS_WITH_DEFECTS, 0 blocking, 0 major. Typecheck clean, 398/398 tests, build passes. Seed hash HMAC-SHA256; coordinates rounded to 2 decimals; swisseph-wasm 0.1.0; graha tol 1e-3 deg. Lagna and houses are computed at every latitude (completely classical, nothing thrown out); cells beyond the 0.1 deg verification cap or above |lat| 66.5 are flagged unverifiable_tolerance / unverifiable_polar, not withheld. Malefics per BPHS 3.11 (Santhanam p.27). Open: DEF-042 MINOR (accepted residual), DEF-043 MINOR. No app caller uses Vedic contributions yet.
