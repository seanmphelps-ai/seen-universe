# LOCATION EVIDENCE MVP — generator first-run spec

Read with `docs/LOCATION.md`, `docs/contexts/CLAUDE_LOCATION.md`, and `docs/generator-puzzle-assembly-contract.md`.

This file is the how-to. Those files are the law.

This is not runtime UI. This is not SOD. This is the generator job that runs after intake hands off places + years.

---

## Job

For each place + calendar window the user lived there, reconstruct what that incubator repeatedly put in front of people who were there.

Answer only:

**What was it like to live here, during these years?**

Do not answer:

- What happened to this specific person
- What their chart says
- Whether they are a good or bad person
- Climate from latitude as the whole story

Latitude, heat, light, cold, elevation, and biome are background notes. They are never the finding.

---

## Intake handoff (corner pieces)

One record per place. Never blend two places. Never blend two eras of the same city.

```
LocationPeriod {
  role: BIRTH | LIVED_6MO | CURRENT | MATERNAL_PREGNANCY | MATERNAL_PRE
  label: string                  // "Kalispell, MT"
  country: string
  region: string | null
  locality: string | null
  latitude: number
  longitude: number
  startDate: YYYY-MM-DD | YYYY   // use year if day unknown
  endDate: YYYY-MM-DD | YYYY | CURRENT
  yearsLived: number             // must be >= 0.5 except MATERNAL_*
  subjectAgeRange: string | null // "0-6", "18-21", "pregnancy"
}
```

Roles:

- BIRTH — place of arrival
- LIVED_6MO — any stay of six months or more
- CURRENT — where they live now
- MATERNAL_PREGNANCY — where the mother was during the pregnancy
- MATERNAL_PRE — where the mother was immediately before pregnancy, if given

1993 Los Angeles and 2026 Los Angeles are two records.

Hills are not flats. Same city name does not mean same soil.

---

## The Paris 1945 test

If asked "What was Paris like in 1945?" you do not open a climate table.

You look at what people who were there left behind for that year:

1. Local newspapers from 1945 (headlines, rationing, crime, festivals, housing)
2. Photographs and newsreels from that year
3. Diaries, letters, oral histories dated to that year
4. Official counts from that year (deaths, births, arrests, prices, unemployment)
5. What was open and what was closed (markets, schools, churches, clubs, factories)
6. What people complained about in public
7. What people celebrated in public
8. What was missing (food, men, heat, transit, trust)
9. Whether the street felt occupied, hungry, hopeful, armed, or empty

Do that same job for every LocationPeriod.

Kalispell 2019 is not Kalispell 2026.
Paris 1945 is not Paris 2019.

If the year is before the internet, use newspapers, yearbooks, city directories, local histories, crime reports, church bulletins, high-school sports pages, mill/plant closures, flood/fire records.

If the year is after the internet, add Reddit, local Facebook groups, Marketplace volume, YouTube local vlogs, reviews, event listings, search trends.

---

## Where to look (exact sources)

Look in this order. Stop a source when it has no material for that place + year. Do not invent.

### A. Time-matched public voice
- Local subreddit and state subreddit threads dated inside the window
- Local Facebook groups / Marketplace listings dated inside the window
- YouTube videos geotagged or titled with the place + year
- Google / Yelp / TripAdvisor reviews dated inside the window
- Local forums, Nextdoor-style boards, high-school alumni pages
- Event calendars (sports leagues, farmers markets, church, bars, protests)

### B. Time-matched local record
- Local newspaper archive for those years
- Police blotter / crime reports for those years
- School board and city council minutes
- Chamber of commerce / mill / plant / base closures or openings
- Obituaries and birth announcements volume as texture, not as gossip

### C. Corroboration only (never the whole picture)
- Census / ACS for that period (income, rent burden, education, age, race, renters vs owners)
- CDC SVI, Distressed Communities Index, county mortality / overdose if published
- FBI / state crime rates for that county and year
- USDA food access, Walk Score / transit only as access facts
- Daylight hours, snow days, disaster years as seasonal rhythm, not as vibe

### D. Absence is a finding
Write it down when the place, in that window, had:
- no grocery within reach
- no hospital
- no college
- no public transit
- one dominant employer
- one dominant church
- no nightlife
- no youth sports
- no airport
- no broadband

Absence trains people too.

---

## What to extract from every piece of evidence

For each item you find, fill this and nothing else:

```
EvidenceItem {
  url_or_cite: string
  source_name: string
  date: YYYY-MM-DD | YYYY
  place_named: string
  about: one of
    housing_cost | recreation | community_support | drug_use | religion
    | entrepreneurship | nightlife | crime | family_orientation
    | outsider_hostility | distress_selling | sports_culture
    | schools | work | food | healthcare | transit | weather_disaster
    | military | tourism | isolation | mutual_aid | status | other
  sentiment: positive | negative | supportive | destructive | neutral | mixed
  local_specificity: high | medium | low
  time_period_match: exact | close | outside
  independence: single_source | multiple_sources | consensus
  note: one sentence of what it actually says
}
```

Throw out anything with `time_period_match: outside` unless you mark it as current-day only and never use it to describe a past year.

Throw out tourist-brochure language unless locals repeat it.

One viral post is not a culture. Ten independent locals saying the same thing in the same years is a culture.

---

## How to score exposure (three bands)

After clustering EvidenceItems by `about`, assign one band per finding.

**definitely**
- 5+ independent sources
- exact years
- high local specificity
- same direction

**probably**
- 2–4 independent sources
- exact or close years
- same direction

**potentially**
- 1 solid local source, or several weak ones
- keep it, mark the gap
- do not promote it to probably

Do not use the word "definitely" for a single Reddit comment.

Do not use climate-from-latitude to reach "definitely" on vibe.

---

## Findings (the incubator picture)

Group evidence into findings. Each finding is one recurring condition of the soil.

```
Finding {
  finding: "Frequent housing-cost complaints"
  topic: housing_cost
  band: potentially | probably | definitely
  sentiment: negative
  frequency: rare | common | frequent | dominant
  years: "2015-2017"
  location: "Kalispell, MT"
  confidence: 0.00-1.00
  evidence_links: [urls]
}
```

Confidence formula:

```
confidence =
  (independence: consensus 1.0 / multiple 0.5 / single 0.2) * 0.4
+ (frequency: dominant 1.0 / frequent 0.7 / common 0.4 / rare 0.1) * 0.3
+ (local_specificity: high 1.0 / medium 0.5 / low 0.2) * 0.2
+ (time_period_match: exact 1.0 / close 0.5 / outside 0.0) * 0.1
```

Keep contradictions on the table.

Allowed pairs on the same place-year:
- high recreation + high housing pain
- strong church + high overdose talk
- tight families + hostility to outsiders
- tourism smile + local wage squeeze

Do not flatten them into "nice mountain town."

---

## Three summaries (required output to the user)

After findings exist, write exactly three summaries for that LocationPeriod.

All three are fields of the same city/era. Not three moods you invented.

1. Western-lean field (status, work, law, house, street, money)
2. Vedic-lean field (family, duty, timing, heat/cold of social obligation)
3. Blended / corridor field (two-zip reality, hill vs flats, tourist strip vs the street behind it)

Every summary must contain:
- era
- soil name
- what was rewarded
- what was punished
- what was normal
- what people aspired toward
- what people were afraid of losing
- where money went
- gift
- cost
- under pressure on THIS soil

Never only-good. Never only-bad.
No planet names. No house numbers. No clocks.
No "you were."
Use "people here," "a child growing here," "a household in this window."

Minimum three sentences each. Over-inform.

These summaries are candidates. The subject may pick one, several, or none.
A pick is resonance. It does not rewrite the findings.

---

## What you may say vs what you may not say

Allowed:
- "In Kalispell 2015–2017, housing-cost complaint was frequent in local voice."
- "Outdoor recreation was a dominant public story."
- "Nightlife mention was rare."
- "A household staying here six months or more was repeatedly exposed to X."

Forbidden:
- "You became anxious because of Kalispell."
- "This place made them a shitty person."
- "This place raises good people."
- Using 2026 reviews to describe 1994.
- Using birth-chart aspects to choose which news story counts.
- One blended score for a whole life.

Person-level translation happens later.
This slice stops at the soil.

---

## Output object the next stage consumes

```
LocationEvidencePack {
  locationPeriod: LocationPeriod
  findings: Finding[]
  summaries: [Summary, Summary, Summary]
  contradictions: string[]
  missing: string[]          // what you could not find for those years
  sources_used: string[]
  generatedAt: ISO-8601
}
```

Next stages (dark cards, astrology, portals) may weight existing chart factors with these findings.
They may not replace the chart.
They may not run until this pack exists for that place-year.

---

## Worked method, short

Place: Paris  
Years: 1945  

Look at: 1945 newspapers, ration cards, photographs of queues, crime and black-market reports, school reopenings, return of prisoners, fuel shortage, celebration in August 1944 already over and 1945 winter still hungry.

Do not look at: average annual temperature of Île-de-France.

Write findings: food scarcity frequent, public celebration mixed with exhaustion, housing destroyed or overcrowded, authority contested, markets central, nightlife thin, family reconstitution dominant.

Then three summaries of that soil.
Then stop.

Do that for every intake place.
