// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
# LOCATION EVIDENCE MVP — generator first-run spec

Read with `docs/LOCATION.md`, `docs/contexts/CLAUDE_LOCATION.md`, and `docs/generator-puzzle-assembly-contract.md`.

This file is the how-to. Those files are the law.

This is the generator job that runs after intake hands off places + years.

---

## Job

For each place + calendar window the user lived there, reconstruct what that incubator repeatedly put in front of people who were there.

Answer only:

**What was it like to live here, during these years?**

Latitude, heat, light, cold, elevation, and biome are background notes.

---

## Intake handoff (corner pieces)

One record per place.

```
LocationPeriod {
  role: BIRTH | LIVED_6MO | CURRENT | MATERNAL_PREGNANCY | MATERNAL_PRE
  label: string
  country: string
  region: string | null
  locality: string | null
  latitude: number
  longitude: number
  startDate: YYYY-MM-DD | YYYY
  endDate: YYYY-MM-DD | YYYY | CURRENT
  yearsLived: number
  subjectAgeRange: string | null
}
```

Roles:

- BIRTH — place of arrival
- LIVED_6MO — any stay of six months or more
- CURRENT — where they live now
- MATERNAL_PREGNANCY — where the mother was during the pregnancy
- MATERNAL_PRE — where the mother was immediately before pregnancy, if given

1993 Los Angeles and 2026 Los Angeles are two records.

---

## The Paris 1945 test

You look at what people who were there left behind for that year:

1. Local newspapers from 1945
2. Photographs and newsreels from that year
3. Diaries, letters, oral histories dated to that year
4. Official counts from that year
5. What was open and what was closed
6. What people complained about in public
7. What people celebrated in public
8. What was missing
9. Whether the street felt occupied, hungry, hopeful, armed, or empty

If the year is before the internet, use newspapers, yearbooks, city directories, local histories, crime reports, church bulletins, high-school sports pages, mill/plant closures, flood/fire records.

If the year is after the internet, add Reddit, local Facebook groups, Marketplace volume, YouTube local vlogs, reviews, event listings, search trends.

---

### A. Time-matched public voice
Local subreddit, Facebook groups / Marketplace, YouTube, reviews, forums, event calendars dated inside the window.

### B. Time-matched local record
Newspaper archive, police blotter, school board and city council minutes, plant/base openings and closures.

### C. Corroboration only
Census / ACS, CDC SVI, DCI, crime rates, food access, seasonal rhythm.

### D. Absence is a finding

---

## EvidenceItem / Finding / three bands / three summaries

See prior revision of this file for schemas, confidence formula, allowed/forbidden language, and LocationEvidencePack.

Bands: definitely = 5+ independent exact local sources same direction. probably = 2–4. potentially = 1 solid or several weak.

---

## Worked example — Paris, 1945

This is the template.

```
LocationPeriod {
  role: LIVED_6MO
  label: "Paris, France"
  latitude: 48.8566
  longitude: 2.3522
  startDate: 1945
  endDate: 1945
  yearsLived: 1
  subjectAgeRange: null
}
```

### What you open instead (year-locked)
- Janet Flanner, "Letter from Paris," The New Yorker, 27 January 1945 (filed 17 Jan 1945): liberated Paris "occupied by snow"; hungrier than any other winter of the war; one sack of coal per person still unpaid from August; passenger steam trains suppressed; milk only for J-1 (ages 1–3).
- War Picture Pool / Alan Montrose caption, 20 January 1945: homes and offices near 0C; coal reserved for hospitals and bakers; firewood prohibitive.
- Spring 1945: first deporte train arrivals at Gare de Lyon, 14 April 1945, 288 women received by de Gaulle / Frenay / Mitterrand.

### Environmental findings
- definitely — Food scarcity. Bread/potatoes/apples as the daily plate. Fats missing for months. Queues as the civic ritual.
- definitely — Cold as a household condition. Coal reserved for ovens and hospitals. Rooms unheated.
- definitely — Family reconstitution / absence. Prisoners and deportees as the private weather of almost every apartment.
- probably — Black market as parallel grocery. Survival traffic vs profiteer traffic both present.
- probably — Authority purge. New crime of national indignity. Professions stripped. Neighbors sorting who ate well under Occupation.
- probably — Movement constrained.
- potentially — School and clinic strain (pneumonia, missing drugs, missing heat). Keep marked until more year-locked clinic records are attached.
- absence — Nightlife, tourism, abundance, reliable heat, ordinary milk.

Contradictions that stay on the table:
- Liberation joy (Aug 1944) + hungrier winter than Occupation.
- Bread that fattens the face + children dying of cold and thin blood.
- Public stoicism + baker-door panic.

### Three summaries

**1. Western-lean (street, work, law, money)**
Paris 1945. Soil: a capital that won its street and lost its pantry. It was who could still get flour, who still had a profession after indignite nationale, who had a cousin in the country. Money went to coal, black-market butter, and the train fare that might bring a prisoner home. Under pressure this soil trains queueing, hoarding, and quiet ranking of neighbors. Gift: the occupier is gone and the law is French again.

**2. Vedic-lean (family, duty, timing, obligation)**
Paris 1945. Soil: the apartment as waiting room. Duty is the ration card, the child classified J-1 or J-2, the missing son in Germany, the mother in a bakery line at dawn. Time is the month the tickets change color and the week an egg might appear. What is feared: the baker sign Pas de farine, the empty platform when the deporte list is read. Gift: the family is the only remaining institution that still works.

**3. Blended / corridor (two-Paris)**
Paris 1945. Soil: two cities on one map. One eats at a restaurant if it can pay the excess. The other lives on soup and a loaf reserved for bakers coal. Arrondissement and purse split the same winter. The operating Paris is queues, Metro crush, half-sheet newspapers, and the Gare de Lyon in April. Gift: the corridor itself — a household can still cross from official ration to a country parcel. Cost: crossing that corridor teaches a child that fairness is a rumor and that heat, fat, and safety belong to someone else.

### Stop
Hand the LocationEvidencePack forward.
Do this same shape for every intake place-year.
