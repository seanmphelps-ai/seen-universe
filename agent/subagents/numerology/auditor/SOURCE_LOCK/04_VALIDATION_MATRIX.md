# VALIDATION MATRIX — Numerology

**Status:** fixtures defined; implementation cleared by CoS 2026-10-12 (COS_CLEARANCE_2026-10-12.md); Sean final approval pending before code ship.

---

## V1. SMOKE_ANN_LEE_1979-08-01 (primary smoke)

| Field | Value |
|---|---|
| Full birth name | `ANN LEE` |
| Birth date | `1979-08-01` |
| System | Pythagorean |

### Intermediates
| Step | Math |
|---|---|
| Letters | A=1 N=5 N=5 · L=3 E=5 E=5 |
| Expression parts | ANN=1+5+5=**11** (keep); LEE=3+5+5=13→**4** (karmic 13 on part, CoS rule 6 2026-10-12); 11+4=15→**6** |
| Soul Urge vowels | A=1; E+E=10→1; 1+1=**2** |
| Personality consonants | N+N=10→1; L=3; 1+3=**4** |
| Life Path | month 8→8; day 1→1; year 1979→26→8; 8+1+8=17→**8** |
| Birthday | **1** (no karmic) |

### Expected typed cores
```json
{
  "subjectId": "SMOKE_ANN_LEE_1979-08-01",
  "systemLabel": "pythagorean",
  "lifePath": 8,
  "birthday": 1,
  "expression": 6,
  "soulUrge": 2,
  "personality": 4,
  "karmicDebts": ["karmicDebt13@expression.part:LEE"],
  "mastersKept": [],
  "notes": ["Expression part ANN carried master 11 before final reduction to 6"]
}
```
**Result:** PASS. The code matches the expected cores, including the 13 debt on the LEE part (`lib/seen/__tests__/numerology.test.ts`; Agent B audit B_03, 2026-10-12). The V1 fixture text (lines 19 and 35) was approved by Sean (owner) on 2026-10-16, which closes MF-NUM-010.

---

## V2. Master keep on Life Path components

| Field | Value |
|---|---|
| Birth date | `1992-11-11` |
| Expected | month **11**, day **11**, year 1992→21→3; 11+11+3=25→**7**; Life Path **7**; masters appeared in components |
**Result:** PENDING

---

## V3. Birthday karmic debt

| Field | Value |
|---|---|
| Birth day | `16` |
| Expected | Birthday reduced **7**; karmicDebt `{ position: "birthday", compound: 16, reduced: 7 }` |
**Result:** PENDING

---

## V4. Refuse unlabeled Chaldean mix

Chaldean letter values must never alter Pythagorean Life Path without `systemLabel: "chaldean"` on a separate name field.  
**Result:** contract rule — enforce in typed I/O
