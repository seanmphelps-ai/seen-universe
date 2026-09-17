**SEEN LOCATION — BUILDER PACKET**  
  
**0. BUILD TARGET**  
  
**Build the executable SEEN Location engine inside the existing SEEN repository.**  
  
**The completed module accepts a person’s place-period history, resolves each place, interrogates the environment during the exact exposure period, preserves evidence and uncertainty, calculates separate Environmental Pressure Fields, calculates the transition between consecutive places, builds a cumulative Baseline Pressure Profile, and deposits the resulting environmental signals into the existing canonical 64-portal lattice.**  
  
**The Location engine produces structured Generator records. The Oracle receives finalized Generator records and renders the human-facing language.**  
  
**The Location engine answers:**  
  
> What world was this person repeatedly exposed to during this period, and how did that world differ from the environments that came before and after it?  
  
**1. AUTHORITY AND SCOPE**  
  
**Use the repository’s existing names, registries, schemas, runtime boundaries, and read order.**  
  
**Authority order:**  
  
**	1.	Sean’s latest explicit correction**  
**	2.	Current locked canonical build contract**  
**	3.	Current runtime and schema contracts**  
**	4.	Runtime schemas and passing tests**  
**	5.	Approved exemplars**  
**	6.	Implementation copy**  
  
**This packet governs the Location module and its environmental handoffs.**  
  
**The current execution decision is:**  
  
```text  
WESTERN CALCULATION  
→ PRESERVE RAW WESTERN RESULT  
→ LOCATION CALCULATION  
→ ENVIRONMENTAL PRESSURE FIELD  
→ WESTERN × LOCATION PATTERN INTERACTION  
→ 64-PORTAL ROUTING  
→ CONVERGENCE  
→ GENERATOR PAYLOAD  
→ ORACLE RENDERING  
```  
  
**Western establishes the subject’s base symbolic pattern. Location calculates the environmental conditions that shaped, amplified, suppressed, sensitized, stabilized, redirected, or activated its expression. Location preserves the original Western calculation unchanged.**  
  
**The Location module remains independently executable and independently stored.**  
  
**1.1 Western foundation entering Location**  
  
```ts  
type WesternSourceRecord = {  
  westernSourceRecordId: string  
  personId: string  
  birthInput: {  
    birthDate: string  
    birthTime: string | null  
    birthTimeCertainty: 'exact' | 'approximate' | 'unknown'  
    birthLocation: string  
    latitude: number  
    longitude: number  
    timezone: string  
  }  
  calculator: 'local_swiss_ephemeris'  
  calculationVersion: string  
  planets: unknown[]  
  aspects: unknown[]  
  houses: unknown[] | null  
  ascendant: unknown | null  
  midheaven: unknown | null  
  retrogradeStates: unknown[]  
  provenance: string[]  
  unresolved: string[]  
  immutable: true  
}  
```  
  
**Unknown birth time preserves valid planetary calculations. Houses, Ascendant, and Midheaven remain unresolved until candidate-time calculation.**  
  
**2. CORE LOCATION FORMULA**  
  
```text  
EXACT PLACE  
+ EXPOSURE PERIOD  
+ AGE DURING EXPOSURE  
+ HISTORICALLY MATCHED EVIDENCE  
+ COMPARISON BASELINES  
+ USER-CONFIRMED PLACE MEMORY  
= LOCATION ENVIRONMENTAL RECORD  
LOCATION ENVIRONMENTAL RECORD  
+ PREVIOUS LOCATION ENVIRONMENTAL RECORD  
= LOCATION TRANSITION / DELTA  
ALL LOCATION ENVIRONMENTAL RECORDS  
+ ALL LOCATION TRANSITIONS  
+ DURATION AND DEVELOPMENTAL TIMING  
= BASELINE PRESSURE PROFILE  
BASELINE PRESSURE PROFILE  
→ CANONICAL 64-PORTAL ENVIRONMENTAL LAYER  
→ DOWNSTREAM SEEN HELIX  
```  
  
**Every source record remains independent. Synthesis appends source records, compares them, and renders only after validation.**  
  
```text  
append first  
→ synthesize second  
→ render third  
```  
  
**3. WORKED SUBJECT INTAKE**  
  
**This is the concrete build fixture used throughout the packet.**  
  
```json  
{  
  "personId": "person_bree_fixture",  
  "birthDate": {  
    "value": "1993-06-13",  
    "certainty": "exact",  
    "source": "user_confirmed"  
  },  
  "birthTime": {  
    "value": null,  
    "certainty": "not_required_for_location_run"  
  },  
  "placePeriods": [  
    {  
      "placePeriodId": "place_bree_downtown_la_1992_1998",  
      "role": "birth_and_early_childhood",  
      "requestedPlace": "Downtown Los Angeles, California",  
      "residenceAreaHint": "Downtown Los Angeles near the Fashion District",  
      "exposureStart": "1992-09",  
      "exposureStartPrecision": "approximate_month",  
      "exposureEnd": "1998-06-13",  
      "exposureEndPrecision": "approximate_transition_date",  
      "prenatalExposure": true,  
      "ageStart": "prenatal",  
      "ageEndYears": 5,  
      "userConfirmedMemory": [  
        "The area was buzzing.",  
        "The area was very active and very social.",  
        "Homeless people were visibly present.",  
        "The fashion industry and Fashion District were part of the environment."  
      ],  
      "unresolved": [  
        "Exact residence address",  
        "Exact Downtown neighborhood boundary",  
        "Exact prenatal exposure start date",  
        "Hospital name and address"  
      ]  
    },  
    {  
      "placePeriodId": "place_bree_pasadena_1998_2002",  
      "role": "childhood_residence",  
      "requestedPlace": "Pasadena, California",  
      "residenceAreaHint": null,  
      "exposureStart": "1998-06-13",  
      "exposureStartPrecision": "approximate_transition_date",  
      "exposureEnd": "2002-06-13",  
      "exposureEndPrecision": "approximate_transition_date",  
      "prenatalExposure": false,  
      "ageStartYears": 5,  
      "ageEndYears": 9,  
      "userConfirmedMemory": [],  
      "unresolved": [  
        "Exact residence address",  
        "Pasadena neighborhood",  
        "Exact move dates"  
      ]  
    },  
    {  
      "placePeriodId": "place_bree_hermosa_2002_2021",  
      "role": "childhood_adolescence_and_adulthood_residence",  
      "requestedPlace": "Hermosa Beach, California",  
      "residenceAreaHint": null,  
      "exposureStart": "2002-06-13",  
      "exposureStartPrecision": "approximate_transition_date",  
      "exposureEnd": "2021-06-13",  
      "exposureEndPrecision": "approximate_transition_date",  
      "prenatalExposure": false,  
      "ageStartYears": 9,  
      "ageEndYears": 28,  
      "userConfirmedMemory": [],  
      "unresolved": [  
        "Exact residence address",  
        "Hermosa Beach neighborhood",  
        "Exact move dates",  
        "Residence after age 28"  
      ]  
    }  
  ]  
}  
```  
  
**The unclear hospital phrase is retained as unresolved source material. It does not change the Downtown residence geography.**  
  
**4. PLACE RESOLUTION RECORD**  
  
**Every requested place becomes a canonical resolved place before environmental collection begins.**  
  
```ts  
type PlaceResolution = {  
  placePeriodId: string  
  requestedPlace: string  
  matchedPlaceName: string | null  
  canonicalPlaceId: string | null  
  latitude: number | null  
  longitude: number | null  
  timezone: string | null  
  countryCode: string | null  
  stateCode: string | null  
  countyName: string | null  
  cityName: string | null  
  neighborhoodName: string | null  
  postalCode: string | null  
  censusGeographies: Array<{  
    type: 'block_group' | 'tract' | 'place' | 'county' | 'metro' | 'state'  
    id: string  
  }>  
  resolutionStatus: 'resolved' | 'partially_resolved' | 'ambiguous' | 'unresolved'  
  geographicPrecision:  
    | 'address'  
    | 'intersection'  
    | 'neighborhood'  
    | 'district'  
    | 'city'  
    | 'county'  
    | 'metro'  
    | 'region'  
  confidence: number  
  candidates: Array<{  
    name: string  
    canonicalPlaceId: string  
    confidence: number  
  }>  
  unresolved: string[]  
}  
```  
  
**Expected fixture resolution:**  
  
|Place period                   |Matched geography                                                           |Precision|Resolution state  |  
|-------------------------------|----------------------------------------------------------------------------|---------|------------------|  
|Downtown Los Angeles, 1992–1998|Downtown Los Angeles district; Fashion District proximity retained as a hint|district |partially_resolved|  
|Pasadena, 1998–2002            |Pasadena city                                                               |city     |partially_resolved|  
|Hermosa Beach, 2002–2021       |Hermosa Beach city                                                          |city     |partially_resolved|  
  
**The smallest trustworthy geography is used for each measurement. A city-level measurement never masquerades as a neighborhood-level measurement.**  
  
**5. TEMPORAL RESOLUTION**  
  
**Every environmental source is matched to the days, months, or years overlapping the exposure period.**  
  
```ts  
type ExposureWindow = {  
  placePeriodId: string  
  start: string  
  end: string  
  startPrecision: 'day' | 'month' | 'year' | 'approximate_month' | 'approximate_year'  
  endPrecision: 'day' | 'month' | 'year' | 'approximate_transition_date'  
  durationDays: number | null  
  durationMonths: number | null  
  durationYears: number | null  
  ageStartDays: number | null  
  ageEndDays: number | null  
  developmentalPeriods: Array<{  
    key: 'prenatal' | 'infancy' | 'early_childhood' | 'middle_childhood' | 'adolescence' | 'adulthood'  
    overlapDays: number | null  
  }>  
  uncertainty: string[]  
}  
```  
  
**Expected temporal segmentation:**  
  
|Location            |Calendar exposure              |Developmental overlap                   |  
|--------------------|-------------------------------|----------------------------------------|  
|Downtown Los Angeles|approximately Sep 1992–Jun 1998|prenatal, infancy, early childhood      |  
|Pasadena            |approximately Jun 1998–Jun 2002|early and middle childhood              |  
|Hermosa Beach       |approximately Jun 2002–Jun 2021|middle childhood, adolescence, adulthood|  
  
**Developmental timing is stored as context and weighting metadata. It does not automatically convert a geographic statistic into a personal trait.**  
  
**6. SOURCE RECORD**  
  
**Every retrieved fact is an immutable source record.**  
  
```ts  
type LocationSourceRecord = {  
  sourceRecordId: string  
  placePeriodId: string  
  sourceFamily:  
    | 'user_confirmed_memory'  
    | 'public_observable'  
    | 'official_baseline'  
    | 'official_historical'  
    | 'geospatial'  
    | 'local_government'  
    | 'secondary_corroboration'  
  sourceAuthority: string  
  datasetOrRecord: string  
  sourceUrl: string | null  
  providerKey: string  
  providerVersion: string  
  retrievedAt: string  
  applicableStart: string | null  
  applicableEnd: string | null  
  applicableYear: number | null  
  requestedGeography: string  
  matchedGeography: string  
  geographicResolution: string  
  rawValue: string | number | boolean | null  
  unit: string | null  
  observationCount: number | null  
  sourceObjectReference: string | null  
  contentHash: string | null  
  quality: number  
  limitations: string[]  
  consent: 'authorized' | 'public'  
  visibility: 'generator_only' | 'debug' | 'oracle_eligible'  
}  
```  
  
**User-confirmed place memory is preserved as its own source family. It can confirm the character of a lived environment. It never becomes official population, crime, economic, climate, or housing data.**  
  
**7. SOURCE ORDER**  
  
**For United States locations, the historical record draws from the following source families where applicable:**  
  
**	1.	U.S. Census Bureau and Decennial Census**  
**	2.	American Community Survey for years where available**  
**	3.	Bureau of Labor Statistics**  
**	4.	Bureau of Economic Analysis**  
**	5.	FBI Crime Data Explorer and traceable local law-enforcement records**  
**	6.	CDC**  
**	7.	CMS and federal healthcare-provider datasets**  
**	8.	EPA**  
**	9.	NOAA**  
**	10.	USGS**  
**	11.	FEMA**  
**	12.	Department of Education and NCES**  
**	13.	FCC broadband data**  
**	14.	Department of Transportation and BTS**  
**	15.	Federal Transit Administration and GTFS records**  
**	16.	USDA**  
**	17.	National Park Service**  
**	18.	U.S. Forest Service**  
**	19.	State and local government open-data systems**  
**	20.	Traceable geospatial datasets for distance, land cover, facilities, coastline, water, roads, and amenities**  
**	21.	Public observable sources: local posts, forums, reviews, news, events, commerce, jobs, housing, search, movement, and place signals**  
  
**Official sources establish historical baseline, corroboration, and validation. Public observable evidence captures lived public conditions, local language, recurrence, presence, spread, and change.**  
  
**8. FIXED ENVIRONMENTAL EVIDENCE INVENTORY**  
  
**Every place-period runs the following objective evidence questions in the same order. Their results supply the measured record interrogated in Section 8A.**  
  
**1. Who was there?**  
  
**Retrieve population, population density, age distribution, sex distribution, household composition, racial and ethnic composition, foreign-born population, migration, residential turnover, marriage and divorce, household size, and people living alone.**  
  
**2. How much money was there?**  
  
**Retrieve household income, per-capita income, poverty, unemployment, labor-force participation, income distribution, public-assistance prevalence, housing burden, rent, home values, and material deprivation indicators.**  
  
**3. What work was there?**  
  
**Retrieve dominant industries, occupation distribution, major employers, wages, job availability, employment concentration, self-employment, professional and technical employment, service employment, agricultural and manual employment, and commuting patterns.**  
  
**4. What work was scarce or absent?**  
  
**Calculate which major occupational sectors and career pathways were materially scarce or absent relative to explicit surrounding-region and national baselines.**  
  
**5. What education was there?**  
  
**Retrieve educational attainment, schools, colleges, universities, vocational programs, libraries, enrollment, graduation indicators, and geographic access to higher education.**  
  
**6. What healthcare was there?**  
  
**Retrieve hospitals, emergency departments, primary-care availability, specialists, behavioral-health services, substance-use services, pharmacies, provider density, and travel distance to care.**  
  
**7. What was the physical environment?**  
  
**Retrieve elevation, terrain, land cover, development density, climate, temperature, precipitation, snowfall, sunlight and daylight, humidity, wind, drought, wildfire exposure, flood exposure, earthquake exposure, extreme-weather exposure, air quality, noise, geology, soil, minerals, and recurring natural conditions.**  
  
**8. What nature was there?**  
  
**Retrieve forests, parks, public land, trails, mountains, rivers, lakes, coastline, ocean, beaches, green space, recreational water, ecology, plants, animals, and distance and access to each major natural feature.**  
  
**9. What nature was scarce, inaccessible, or absent?**  
  
**Record major natural environments that were geographically unavailable or materially inaccessible using explicit measurement and comparison.**  
  
**10. How connected was the place?**  
  
**Retrieve road connectivity, walkability, public transportation, commute times, vehicle dependence, airports, flight connectivity, rail, broadband availability and quality, cellular availability, and geographic isolation.**  
  
**11. Where could people go?**  
  
**Calculate practical access to nearby population centers, employment centers, universities, healthcare, airports, recreation, cultural centers, coastline, mountains, and major destinations.**  
  
**12. What social infrastructure existed?**  
  
**Retrieve availability and density of restaurants, cafés, bars, gyms, yoga and fitness facilities, religious institutions, community centers, clubs, libraries, performance venues, museums, galleries, music venues, sports facilities, markets, public squares, and gathering places.**  
  
**13. What social infrastructure was scarce or absent?**  
  
**Calculate categories with unusually low or absent availability relative to population and explicit comparison geography.**  
  
**14. What cultural exposure existed?**  
  
**Retrieve measurable indicators of cultural diversity, languages, foreign-born population, arts institutions, entertainment venues, universities, tourism, cultural organizations, fashion, media, music, food, festivals, and international connectivity.**  
  
**15. What safety and hazard conditions existed?**  
  
**Retrieve violent crime, property crime, homicide where available, traffic fatalities, environmental hazards, natural disasters, biological hazards, human threats, emergency response access, and geographically traceable safety conditions. Preserve reporting limitations and changes in reporting systems.**  
  
**16. What was the housing reality?**  
  
**Retrieve ownership and rental rates, vacancy, crowding, housing type, housing age, housing costs, affordability, homelessness indicators, shelter and service concentration, residential stability, displacement, development, demolition, and housing growth or contraction.**  
  
**17. What resources could a person realistically reach?**  
  
**Calculate geographic and material access to food, healthcare, education, transportation, employment centers, recreation, exercise, cultural activity, government services, communications infrastructure, childcare, and emergency services.**  
  
**18. What resources were geographically scarce or inaccessible?**  
  
**Record demonstrated scarcity, inaccessibility, and absence independently for every measurable resource category.**  
  
**19. What did daily life physically require?**  
  
**From transportation, climate, land use, commute, occupational, service-distance, housing, and infrastructure data, establish externally observable recurring demands of operating in the environment.**  
  
**20. What did the environment make easy?**  
  
**Identify activities and resources with unusually high objective availability, proximity, affordability, infrastructure, recurrence, or opportunity.**  
  
**21. What did the environment make hard?**  
  
**Identify activities and resources with objectively low availability, long travel requirements, economic barriers, infrastructure limitations, environmental exposure, or geographic constraints.**  
  
**22. What was repeatedly present?**  
  
**Identify conditions persistent enough across the exposure period to constitute repeated exposure rather than an isolated event.**  
  
**23. What was repeatedly scarce, inaccessible, or absent?**  
  
**Identify resources, opportunities, infrastructure, social fields, and environmental features persistently scarce, inaccessible, or unavailable across the exposure period.**  
  
**24. What changed while the person was there?**  
  
**Reconstruct meaningful changes in population, economy, employment, housing, displacement, crime, climate, environmental conditions, infrastructure, services, culture, access, public activity, and institutional pressure during the exposure window.**  
  
**25. What changed from the previous location?**  
  
**Calculate the delta across every measured dimension. Preserve increases, decreases, additions, removals, displacement, replacement, continuity, and uncertainty separately.**  
  
**8A. ENVIRONMENTAL MEANING INTERROGATION**  
  
**After the evidence inventory is complete, interrogate the admissible evidence for each place and period:**  
  
**	1.	What gets rewarded?**  
**	2.	What gets punished or ignored?**  
**	3.	What receives attention?**  
**	4.	What earns status?**  
**	5.	What creates belonging?**  
**	6.	What creates exclusion?**  
**	7.	What do people aspire toward?**  
**	8.	What are people afraid of losing?**  
**	9.	What do people spend money on when they have a choice?**  
**	10.	What gets sacrificed when resources become tight?**  
**	11.	What produces immediate action?**  
**	12.	What is tolerated as normal?**  
**	13.	What complaints repeat?**  
**	14.	What is publicly celebrated?**  
**	15.	What accomplishments recur?**  
**	16.	What failures and breakdowns recur?**  
**	17.	Which work, education, relationships, bodies, lifestyles, possessions, and beliefs confer status?**  
**	18.	What capacities are required to function well there?**  
**	19.	What adaptations make life easier there?**  
**	20.	Which adaptations become liabilities elsewhere?**  
**	21.	What does the environment teach about money?**  
**	22.	What does it teach about trust?**  
**	23.	What does it teach about safety?**  
**	24.	What does it teach about intimacy and relationships?**  
**	25.	What does it teach about authority?**  
**	26.	What does it teach about achievement and failure?**  
**	27.	What does it teach about scarcity and abundance?**  
**	28.	What does it teach about risk?**  
**	29.	What does it teach about outsiders and difference?**  
**	30.	What does it teach about leaving, staying, and possibility?**  
**	31.	What does it make reachable?**  
**	32.	What does it make difficult to imagine?**  
  
**Every answer is earned by observed evidence, admissible measurements, geographic fit, temporal fit, provenance, confidence, and contradiction handling.**  
  
```ts  
type EnvironmentalInterrogationAnswer = {  
  answerId: string  
  placePeriodId: string  
  questionNumber: number  
  question: string  
  supportedAnswer: string | null  
  status: 'supported' | 'partially_supported' | 'contradictory' | 'unknown'  
  findingIds: string[]  
  sourceRecordIds: string[]  
  sourceFamilies: string[]  
  geographicFit: number  
  temporalFit: number  
  sourceIndependence: number  
  confidence: number  
  counterevidenceIds: string[]  
  contradictionIds: string[]  
  unresolved: string[]  
}  
```  
  
**9. COMPLETE ENVIRONMENTAL DOMAIN REGISTRY**  
  
**Each interrogation answer deposits into one or more domains.**  
  
**9.1 GeoPresence**  
  
**	●	place identity**  
**	●	felt public character supported by observable evidence**  
**	●	belonging opportunity**  
**	●	social reception**  
**	●	cultural fit**  
**	●	language access**  
**	●	community access**  
**	●	mobility access**  
**	●	resource access**  
**	●	institutional access**  
**	●	economic position**  
**	●	visibility and surveillance**  
**	●	density and isolation**  
**	●	public pace**  
**	●	identity-expression opportunity**  
**	●	ancestral or origin relationship when authorized**  
**	●	origin-current friction**  
**	●	local narrative**  
**	●	local reputation**  
**	●	inside/outside boundaries**  
  
**9.2 Biome and ecology**  
  
**	●	biome class**  
**	●	ecoregion**  
**	●	land cover**  
**	●	ecological density**  
**	●	biodiversity where available**  
**	●	vegetation**  
**	●	tree canopy**  
**	●	plants**  
**	●	animals**  
**	●	pests and disease vectors**  
**	●	biological threats**  
**	●	ecological seasonality**  
  
**9.3 Abiotic environment**  
  
**	●	temperature**  
**	●	precipitation**  
**	●	humidity**  
**	●	wind**  
**	●	snow**  
**	●	drought**  
**	●	sunlight**  
**	●	daylight duration**  
**	●	cloud cover**  
**	●	air quality**  
**	●	noise**  
**	●	heat island**  
**	●	atmospheric pressure where relevant**  
**	●	recurring extreme conditions**  
  
**9.4 Terrain and geology**  
  
**	●	elevation**  
**	●	slope**  
**	●	flatness**  
**	●	canyon or basin enclosure**  
**	●	openness**  
**	●	navigability**  
**	●	soil**  
**	●	minerals**  
**	●	seismic setting**  
**	●	fault proximity**  
**	●	erosion**  
**	●	landslide exposure**  
**	●	subsidence**  
  
**9.5 Water and natural access**  
  
**	●	coastline distance**  
**	●	ocean access**  
**	●	beach access**  
**	●	river access**  
**	●	lake access**  
**	●	wetland access**  
**	●	groundwater context**  
**	●	flood exposure**  
**	●	recreational water**  
**	●	public access restrictions**  
  
**9.6 Built environment**  
  
**	●	development density**  
**	●	street connectivity**  
**	●	walkability**  
**	●	transit**  
**	●	road access**  
**	●	vehicle dependence**  
**	●	building type**  
**	●	building age**  
**	●	industrial land**  
**	●	commercial land**  
**	●	residential land**  
**	●	parks and green space**  
**	●	public gathering space**  
**	●	lighting**  
**	●	communications infrastructure**  
  
**9.7 Human and institutional field**  
  
**	●	population density**  
**	●	public activity**  
**	●	social contact opportunity**  
**	●	social diversity**  
**	●	migration and turnover**  
**	●	economic pressure**  
**	●	employment structure**  
**	●	housing pressure**  
**	●	visible homelessness**  
**	●	displacement**  
**	●	inequality and material contrast**  
**	●	crime and violence**  
**	●	traffic danger**  
**	●	political pressure**  
**	●	policing and surveillance**  
**	●	institutional trust conditions supported by evidence**  
**	●	public services**  
**	●	emergency capacity**  
**	●	healthcare access**  
**	●	education access**  
  
**9.8 Stability and volatility**  
  
**	●	long-term stability**  
**	●	seasonal volatility**  
**	●	economic volatility**  
**	●	residential turnover**  
**	●	development and displacement**  
**	●	disaster recurrence**  
**	●	institutional change**  
**	●	conflict and unrest**  
**	●	rapid cultural change**  
**	●	infrastructure disruption**  
**	●	short acute events**  
**	●	persistent chronic conditions**  
  
**10. FINDING CONTRACT**  
  
**Every answer to every interrogation question returns this structure.**  
  
```ts  
type EnvironmentalFinding = {  
  findingId: string  
  placePeriodId: string  
  questionNumber: number  
  domainKeys: string[]  
  markerKey: string  
  measuredCondition: string  
  status:  
    | 'PRESENT'  
    | 'ABSENT'  
    | 'SCARCE'  
    | 'ABUNDANT'  
    | 'ACCESSIBLE'  
    | 'INACCESSIBLE'  
    | 'CHANGED'  
    | 'UNKNOWN'  
  rawValue: number | string | boolean | null  
  unit: string | null  
  comparison: {  
    baselineType: 'local_history' | 'county' | 'metro' | 'state' | 'national' | 'structurally_similar' | 'none'  
    baselineGeography: string | null  
    baselinePeriod: string | null  
    baselineValue: number | string | null  
    relativePosition: 'lower' | 'similar' | 'higher' | 'not_calculable'  
  }  
  geographicResolution: string  
  applicablePeriod: string  
  sourceRecordIds: string[]  
  evidenceIndependenceCount: number  
  intensity: EnvironmentalIntensityVector  
  confidence: EnvironmentalConfidenceVector  
  contradictions: string[]  
  missingYears: number[]  
  limitations: string[]  
  userFacingEligibility: boolean  
}  
```  
  
**11. INTENSITY AND CONFIDENCE REMAIN SEPARATE**  
  
```ts  
type EnvironmentalIntensityVector = {  
  prevalence: number | null  
  severity: number | null  
  physicalExposure: number | null  
  digitalExposure: number | null  
  socialAmplification: number | null  
  participantBreadth: number | null  
  spatialConcentration: number | null  
  responseFraming: number | null  
  persistence: number | null  
  trend: number | null  
  aggregate: number | null  
}  
type EnvironmentalConfidenceVector = {  
  sourceIndependence: number  
  observationVolume: number  
  geographicPrecision: number  
  temporalCoverage: number  
  classifierConfidence: number | null  
  representativeness: number  
  sourceQuality: number  
  aggregate: number  
}  
```  
  
**All normalized component values use the repository’s existing score scale. If the repository has no locked aggregation formula, the component vector is stored and aggregate remains null until a versioned weighting registry is approved.**  
  
**High intensity with weak evidence remains high-intensity/low-confidence. Low intensity with strong evidence remains low-intensity/high-confidence.**  
  
**12. HISTORICAL PERIOD AGGREGATION**  
  
**For every numeric marker, preserve the annual or subannual observations that overlap the exposure period.**  
  
```ts  
type HistoricalSeriesSummary = {  
  markerKey: string  
  placePeriodId: string  
  observations: Array<{  
    period: string  
    value: number  
    unit: string  
    overlapDays: number | null  
    sourceRecordId: string  
  }>  
  minimum: number | null  
  maximum: number | null  
  arithmeticMean: number | null  
  overlapWeightedMean: number | null  
  firstObserved: number | null  
  lastObserved: number | null  
  absoluteChange: number | null  
  relativeChange: number | null  
  trendDirection: 'increasing' | 'decreasing' | 'stable' | 'mixed' | 'unknown'  
  coveredYears: number[]  
  missingYears: number[]  
  coverageRatio: number  
}  
```  
  
**The raw observations remain available after aggregation. A multi-year mean never replaces the series.**  
  
**13. PUBLIC OBSERVABLE SIGNAL RECORD**  
  
**Public observable evidence is stored without confusing one underlying event with its social spread.**  
  
```ts  
type PublicObservableSignal = {  
  signalId: string  
  placePeriodId: string  
  platformOrSource: string  
  sourceType: 'social_post' | 'forum' | 'review' | 'news' | 'event' | 'commerce' | 'job' | 'housing' | 'search' | 'movement' | 'place'  
  observedAt: string  
  eventAt: string | null  
  textOrObjectReference: string  
  markerKeys: string[]  
  geoAttribution: {  
    method: 'exact_geotag' | 'platform_place' | 'explicit_text' | 'local_group' | 'local_hashtag' | 'profile_location' | 'regional_inference'  
    requestedGeography: string  
    matchedGeography: string  
    precision: string  
    confidence: number  
  }  
  deduplication: {  
    underlyingEventId: string | null  
    duplicateOfSignalId: string | null  
    uniqueEvent: boolean  
    uniquePost: boolean  
    uniqueAccount: boolean  
  }  
  reach: {  
    audienceReach: number | null  
    crossPlatformSpread: number | null  
    persistence: number | null  
    mobilization: number | null  
  }  
  sampling: {  
    platformCapApplied: boolean  
    markerCapApplied: boolean  
    temporalStratum: string | null  
    geographicStratum: string | null  
    selectedByTopPostRanking: boolean  
  }  
  confidence: EnvironmentalConfidenceVector  
}  
```  
  
**14. ENVIRONMENTAL PRESSURE FIELD**  
  
**Each location produces one complete field.**  
  
```ts  
type EnvironmentalPressureField = {  
  fieldId: string  
  personId: string  
  placePeriodId: string  
  placeResolutionId: string  
  exposureWindowId: string  
  schemaVersion: string  
  engineVersion: string  
  calculatedAt: string  
  sourceRecordIds: string[]  
  findings: EnvironmentalFinding[]  
  domainSummaries: Array<{  
    domainKey: string  
    support: number | null  
    load: number | null  
    friction: number | null  
    mitigation: number | null  
    adaptationDemand: number | null  
    netPressure: number | null  
    confidence: number  
    findingIds: string[]  
  }>  
  persistentConditions: string[]  
  acuteEvents: string[]  
  additions: string[]  
  removals: string[]  
  scarceConditions: string[]  
  inaccessibleConditions: string[]  
  unknownConditions: string[]  
  contradictions: string[]  
  unresolved: string[]  
  completionStatus: 'complete' | 'complete_with_unknowns' | 'blocked' | 'incomplete'  
}  
```  
  
**14A. ENVIRONMENTAL RESONANCE**  
  
**After the objective Environmental Pressure Field validates, the Generator creates two or three evidence-supported experiential summaries. These summaries are calibration probes derived from the measured field.**  
  
**The subject may select one, multiple, or none and may attach a strength or timeframe rating.**  
  
```ts  
type EnvironmentalResonanceRecord = {  
  resonanceRecordId: string  
  personId: string  
  placePeriodId: string  
  environmentalPressureFieldId: string  
  summaries: Array<{  
    summaryId: string  
    text: string  
    supportingFindingIds: string[]  
    supportingInterrogationAnswerIds: string[]  
    confidence: number  
  }>  
  selection: {  
    selectedSummaryIds: string[]  
    noneSelected: boolean  
    strengthRating: number | null  
    timeframeRating: string | null  
    comment: string | null  
  }  
  createdAt: string  
  respondedAt: string | null  
}  
```  
  
**The objective field remains immutable. Resonance becomes a separate source record.**  
  
```text  
MEASURED ENVIRONMENTAL REALITY  
→ REMEMBERED EXPERIENCE  
→ RESONANCE  
→ PATTERN INTERACTION  
```  
  
**15. LOCATION TRANSITION / DELTA**  
  
**Every consecutive pair of place-periods receives a dimension-by-dimension delta.**  
  
```ts  
type LocationDelta = {  
  deltaId: string  
  personId: string  
  fromPlacePeriodId: string  
  toPlacePeriodId: string  
  transitionDate: string | null  
  transitionDatePrecision: string  
  dimensions: Array<{  
    markerKey: string  
    priorValue: number | string | null  
    nextValue: number | string | null  
    direction: 'added' | 'removed' | 'increased' | 'decreased' | 'stable' | 'displaced' | 'unknown'  
    magnitude: number | null  
    magnitudeClass: 'minimal' | 'small' | 'moderate' | 'large' | 'extreme' | 'unknown'  
    frequencyChange: string | null  
    durationAfterChange: string | null  
    voluntaryStatus: 'voluntary' | 'involuntary' | 'mixed' | 'unknown'  
    replacementCondition: string | null  
    restorationAccess: 'available' | 'limited' | 'unavailable' | 'unknown'  
    supportingFindingIds: string[]  
    confidence: number  
  }>  
  additions: string[]  
  removals: string[]  
  reductions: string[]  
  increases: string[]  
  displacements: string[]  
  continuities: string[]  
  contradictions: string[]  
  unresolved: string[]  
}  
```  
  
**The delta remains a vector. It does not collapse into a universal good-location/bad-location score.**  
  
**16. WORKED LOCATION FIELD — DOWNTOWN LOS ANGELES**  
  
**This example shows the completed record shape. Provider-fetched historical values remain UNKNOWN until the runtime retrieves and validates them.**  
  
**16.1 Resolved context**  
  
```json  
{  
  "placePeriodId": "place_bree_downtown_la_1992_1998",  
  "matchedPlaceName": "Downtown Los Angeles, Los Angeles, California",  
  "geographicPrecision": "district",  
  "exposurePeriod": "approximately 1992-09 through 1998-06-13",  
  "developmentalPeriods": ["prenatal", "infancy", "early_childhood"],  
  "resolutionStatus": "partially_resolved"  
}  
```  
  
**16.2 Direct witness evidence**  
  
```json  
[  
  {  
    "sourceRecordId": "src_bree_dtla_memory_activity",  
    "sourceFamily": "user_confirmed_memory",  
    "rawValue": "buzzing, very active, very social",  
    "markerKeys": ["public_activity", "social_density", "pace"],  
    "geographicResolution": "district",  
    "applicablePeriod": "1992-1998",  
    "limitations": ["Subjective remembered description", "Exact address unavailable"]  
  },  
  {  
    "sourceRecordId": "src_bree_dtla_memory_homelessness",  
    "sourceFamily": "user_confirmed_memory",  
    "rawValue": "homeless people visibly present",  
    "markerKeys": ["visible_homelessness", "material_contrast", "public_space_pressure"],  
    "geographicResolution": "district",  
    "applicablePeriod": "1992-1998",  
    "limitations": ["No count supplied", "Exact block unavailable"]  
  },  
  {  
    "sourceRecordId": "src_bree_dtla_memory_fashion",  
    "sourceFamily": "user_confirmed_memory",  
    "rawValue": "fashion industry and Fashion District present",  
    "markerKeys": ["fashion_industry", "garment_work", "commercial_activity", "aesthetic_signaling"],  
    "geographicResolution": "district",  
    "applicablePeriod": "1992-1998",  
    "limitations": ["Exact residence distance from Fashion District unavailable"]  
  }  
]  
```  
  
**16.3 Historically anchored events**  
  
```json  
[  
  {  
    "eventKey": "northridge_earthquake_1994",  
    "eventDate": "1994-01-17",  
    "sourceFamily": "official_historical",  
    "sourceAuthority": "USGS",  
    "eventType": "earthquake",  
    "placePeriodOverlap": true,  
    "subjectAge": "approximately seven months",  
    "exposureAtResidence": "UNKNOWN",  
    "personalExperience": "UNKNOWN",  
    "routing": ["acute_event", "seismic_environment", "infrastructure_disruption"]  
  }  
]  
```  
  
**The 1992 Los Angeles civil unrest occurred before the currently estimated prenatal exposure start. It enters preceding-area history and transition context only when an exact exposure overlap is established.**  
  
**16.4 Required provider results**  
  
**The runtime retrieves, rather than invents, the following Downtown-period values:**  
  
```json  
{  
  "populationAndDemography": "UNKNOWN_PENDING_PROVIDER",  
  "incomeAndMaterialConditions": "UNKNOWN_PENDING_PROVIDER",  
  "employmentAndFashionIndustryConcentration": "UNKNOWN_PENDING_PROVIDER",  
  "educationAccess": "UNKNOWN_PENDING_PROVIDER",  
  "healthcareAccess": "UNKNOWN_PENDING_PROVIDER",  
  "climateAndAirQuality": "UNKNOWN_PENDING_PROVIDER",  
  "landCoverAndGreenSpace": "UNKNOWN_PENDING_PROVIDER",  
  "transitAndConnectivity": "UNKNOWN_PENDING_PROVIDER",  
  "crimeAndTrafficSafety": "UNKNOWN_PENDING_PROVIDER",  
  "housingCrowdingAndHomelessness": "UNKNOWN_PENDING_PROVIDER",  
  "socialAndCulturalInfrastructure": "UNKNOWN_PENDING_PROVIDER"  
}  
```  
  
**16.5 Supported preliminary environmental signals**  
  
```json  
[  
  {  
    "markerKey": "public_activity",  
    "status": "PRESENT",  
    "rawValue": "buzzing, very active, very social",  
    "sourceRecordIds": ["src_bree_dtla_memory_activity"],  
    "confidenceClass": "user_confirmed_environmental_memory",  
    "userFacingEligibility": true  
  },  
  {  
    "markerKey": "visible_homelessness",  
    "status": "PRESENT",  
    "rawValue": "visible presence confirmed by user",  
    "sourceRecordIds": ["src_bree_dtla_memory_homelessness"],  
    "confidenceClass": "user_confirmed_environmental_memory",  
    "userFacingEligibility": true  
  },  
  {  
    "markerKey": "fashion_industry_exposure",  
    "status": "PRESENT",  
    "rawValue": "Fashion District and fashion-industry environment confirmed by user",  
    "sourceRecordIds": ["src_bree_dtla_memory_fashion"],  
    "confidenceClass": "user_confirmed_environmental_memory",  
    "userFacingEligibility": true  
  },  
  {  
    "markerKey": "earthquake_event_overlap",  
    "status": "PRESENT",  
    "rawValue": "Northridge earthquake occurred during the place-period",  
    "sourceRecordIds": ["official_usgs_event_record"],  
    "confidenceClass": "high_event_confidence_personal_exposure_unknown",  
    "userFacingEligibility": true  
  }  
]  
```  
  
**16.6 Environmental interpretation boundary**  
  
**The preliminary field supports statements about the environment:**  
  
**	●	public activity was repeatedly present according to the lived-location witness;**  
**	●	visible homelessness was part of the observed public field;**  
**	●	fashion and garment commerce were part of the observed district identity;**  
**	●	a major earthquake occurred during the place-period.**  
  
**The preliminary field stores personal adaptation, belief, nervous-system response, safety experience, and behavioral effect as unresolved until separate person-specific evidence or sufficiently convergent downstream signals support them.**  
  
**17. WORKED LOCATION FIELD — PASADENA**  
  
**17.1 Resolved context**  
  
```json  
{  
  "placePeriodId": "place_bree_pasadena_1998_2002",  
  "matchedPlaceName": "Pasadena, California",  
  "geographicPrecision": "city",  
  "exposurePeriod": "approximately 1998-06-13 through 2002-06-13",  
  "developmentalPeriods": ["early_childhood", "middle_childhood"],  
  "resolutionStatus": "partially_resolved"  
}  
```  
  
**17.2 Evidence state**  
  
```json  
{  
  "userConfirmedEnvironmentalMemory": [],  
  "historicalPopulationRecord": "REQUIRED",  
  "historicalDemographicRecord": "REQUIRED",  
  "historicalIncomeAndPovertyRecord": "REQUIRED",  
  "historicalEmploymentRecord": "REQUIRED",  
  "historicalHousingRecord": "REQUIRED",  
  "historicalCrimeRecord": "REQUIRED",  
  "historicalClimateAndAirRecord": "REQUIRED",  
  "historicalLandAndNatureAccessRecord": "REQUIRED",  
  "historicalEducationAndInstitutionRecord": "REQUIRED",  
  "historicalTransitAndConnectivityRecord": "REQUIRED"  
}  
```  
  
**17.3 Valid initial anchor**  
  
```json  
{  
  "markerKey": "city_population_2000",  
  "status": "PRESENT",  
  "rawValue": 133936,  
  "unit": "people",  
  "applicablePeriod": "2000",  
  "geographicResolution": "city",  
  "sourceAuthority": "City of Pasadena / U.S. Decennial Census",  
  "comparison": {  
    "baselineType": "local_history",  
    "baselineValue": 131591,  
    "baselinePeriod": "1990",  
    "relativePosition": "higher"  
  }  
}  
```  
  
**The remaining Pasadena environmental character stays unresolved until the complete interrogation runs. Terms such as orderly, calm, achievement-focused, safe, affluent, or institutionally trusted require traceable measures and applicable comparison baselines before entering the Generator record.**  
  
**18. WORKED LOCATION FIELD — HERMOSA BEACH**  
  
**18.1 Resolved context**  
  
```json  
{  
  "placePeriodId": "place_bree_hermosa_2002_2021",  
  "matchedPlaceName": "Hermosa Beach, California",  
  "geographicPrecision": "city",  
  "exposurePeriod": "approximately 2002-06-13 through 2021-06-13",  
  "developmentalPeriods": ["middle_childhood", "adolescence", "adulthood"],  
  "resolutionStatus": "partially_resolved"  
}  
```  
  
**18.2 Long-period segmentation**  
  
**The nineteen-year exposure is segmented so one current snapshot cannot overwrite earlier conditions.**  
  
```json  
[  
  {"phaseId": "hermosa_2002_2006", "start": "2002-06-13", "end": "2006-12-31"},  
  {"phaseId": "hermosa_2007_2011", "start": "2007-01-01", "end": "2011-12-31"},  
  {"phaseId": "hermosa_2012_2016", "start": "2012-01-01", "end": "2016-12-31"},  
  {"phaseId": "hermosa_2017_2021", "start": "2017-01-01", "end": "2021-06-13"}  
]  
```  
  
**Each phase receives the full interrogation. The final Hermosa field preserves minimum, maximum, mean, trend, missing years, acute events, structural changes, and conditions that persisted across all phases.**  
  
**18.3 Required coastal measurements**  
  
```json  
{  
  "coastlineDistance": "REQUIRED",  
  "publicBeachAccess": "REQUIRED",  
  "oceanVisibility": "REQUIRED_WHERE_GEOGRAPHIC_PRECISION_SUPPORTS_IT",  
  "marineClimate": "REQUIRED",  
  "temperatureRange": "REQUIRED",  
  "humidity": "REQUIRED",  
  "wind": "REQUIRED",  
  "daylight": "REQUIRED",  
  "coastalHazards": "REQUIRED",  
  "recreationInfrastructure": "REQUIRED",  
  "walkabilityAndMobility": "REQUIRED",  
  "housingCostAndDisplacement": "REQUIRED",  
  "tourismAndSeasonalPopulation": "REQUIRED",  
  "nightlifeAndPublicActivity": "REQUIRED",  
  "employmentAccess": "REQUIRED",  
  "schoolAndHealthcareAccess": "REQUIRED"  
}  
```  
  
**19. WORKED DELTA — DOWNTOWN LOS ANGELES TO PASADENA**  
  
**The builder produces a comparison record only after both independent fields complete.**  
  
```json  
{  
  "deltaId": "delta_bree_dtla_to_pasadena",  
  "fromPlacePeriodId": "place_bree_downtown_la_1992_1998",  
  "toPlacePeriodId": "place_bree_pasadena_1998_2002",  
  "transitionDate": "1998-06-13",  
  "transitionDatePrecision": "approximate",  
  "dimensions": [  
    {  
      "markerKey": "public_activity",  
      "priorValue": "PRESENT_BY_USER_MEMORY",  
      "nextValue": "UNKNOWN_PENDING_PROVIDER_AND_USER_MEMORY",  
      "direction": "unknown",  
      "magnitude": null,  
      "voluntaryStatus": "unknown",  
      "replacementCondition": null,  
      "restorationAccess": "unknown",  
      "supportingFindingIds": ["finding_dtla_public_activity"],  
      "confidence": 0  
    },  
    {  
      "markerKey": "ocean_access",  
      "priorValue": "UNKNOWN_PENDING_GEOSPATIAL_CALCULATION",  
      "nextValue": "UNKNOWN_PENDING_GEOSPATIAL_CALCULATION",  
      "direction": "unknown",  
      "magnitude": null,  
      "voluntaryStatus": "unknown",  
      "replacementCondition": null,  
      "restorationAccess": "unknown",  
      "supportingFindingIds": [],  
      "confidence": 0  
    }  
  ],  
  "completionStatus": "incomplete_until_both_fields_complete"  
}  
```  
  
**The same structure calculates Pasadena to Hermosa Beach. Coastal access, development density, public pace, mobility, housing, social infrastructure, cultural exposure, climate, and hazards are compared independently.**  
  
**20. BASELINE PRESSURE PROFILE**  
  
```ts  
type BaselinePressureProfile = {  
  profileId: string  
  personId: string  
  placePeriodIds: string[]  
  deltaIds: string[]  
  stableConditions: Array<{  
    markerKey: string  
    placePeriodIds: string[]  
    totalExposureDays: number | null  
    recurrenceCount: number  
    confidence: number  
    findingIds: string[]  
  }>  
  phaseSpecificConditions: Array<{  
    markerKey: string  
    placePeriodId: string  
    developmentalPeriods: string[]  
    exposureDays: number | null  
    confidence: number  
    findingIds: string[]  
  }>  
  transitionSignals: Array<{  
    markerKey: string  
    deltaId: string  
    direction: string  
    magnitude: number | null  
    confidence: number  
  }>  
  cumulativeSupport: number | null  
  cumulativeLoad: number | null  
  cumulativeFriction: number | null  
  cumulativeMitigation: number | null  
  adaptationDemand: number | null  
  confidence: number  
  contradictions: string[]  
  unresolved: string[]  
  completionStatus: 'complete' | 'complete_with_unknowns' | 'blocked' | 'incomplete'  
}  
```  
  
**The cumulative profile preserves each location and phase. It never rewrites three locations into one hometown label.**  
  
**20A. WESTERN × LOCATION PATTERN INTERACTION**  
  
**The Generator receives the immutable Western source, immutable Location fields, and separate resonance records.**  
  
```ts  
type WesternLocationInteractionFinding = {  
  interactionFindingId: string  
  personId: string  
  westernSourceRecordId: string  
  westernMechanicIds: string[]  
  environmentalPressureFieldIds: string[]  
  environmentalFindingIds: string[]  
  environmentalResonanceRecordIds: string[]  
  placePeriodIds: string[]  
  timeframe: string  
  effect:  
    | 'amplify'  
    | 'suppress'  
    | 'sensitize'  
    | 'stabilize'  
    | 'lower_activation_threshold'  
    | 'raise_activation_threshold'  
    | 'redirect'  
    | 'split_across_contexts'  
    | 'delay'  
    | 'oscillate'  
    | 'activate_wound_or_shadow'  
    | 'create_capacity_pressure'  
    | 'create_cost_pressure'  
  supportedPattern: string  
  confidence: number  
  evidenceIds: string[]  
  provenanceIds: string[]  
  dependencyLineageIds: string[]  
  contradictionIds: string[]  
  unresolved: string[]  
  oracleEligible: boolean  
}  
```  
  
**Western findings and environmental findings remain independently inspectable. The interaction record references both and changes neither.**  
  
**21. CANONICAL 64-PORTAL ENVIRONMENTAL LAYER**  
  
**Load the existing repository’s canonical 64-portal registry. Preserve every existing portal ID and exact canonical name. All 64 portals receive an environmental layer, including low-pressure, dormant, contradictory, and insufficient-signal results.**  
  
```ts  
type PortalEnvironmentalLayer = {  
  layerId: string  
  portalId: string  
  canonicalPortalName: string  
  source: 'environment'  
  sourceFieldIds: string[]  
  sourceFindingIds: string[]  
  placePeriodIds: string[]  
  deltaIds: string[]  
  temporalReferenceIds: string[]  
  direction:  
    | 'amplify'  
    | 'restrain'  
    | 'sensitize'  
    | 'delay'  
    | 'distort'  
    | 'reroute'  
    | 'split'  
    | 'lower_threshold'  
    | 'increase_recurrence'  
    | 'support_regulation'  
    | 'low_pressure'  
    | 'insufficient_signal'  
  state:  
    | 'active'  
    | 'weak'  
    | 'dormant'  
    | 'split'  
    | 'delayed'  
    | 'oscillating'  
    | 'rerouted'  
    | 'context_dependent'  
    | 'contradictory'  
    | 'insufficient_signal'  
    | 'collapsed'  
    | 'low_pressure'  
  pressure: number | null  
  confidence: number  
  persistent: boolean  
  replaceExistingLayers: false  
  calculations: Array<{  
    calculationId: string  
    mechanic: string  
    formula: string  
    operands: Array<{key: string; value: number | string | null}>  
    rawResult: number | string | null  
    normalizedResult: number | null  
    confidence: number  
    implementationReference: string  
  }>  
  evidenceIds: string[]  
  contradictionRefs: string[]  
  convergenceNotes: string[]  
  unresolvedRequirements: string[]  
}  
```  
  
**21.1 Concrete portal deposit example**  
  
**This example uses the canonical I Ching-derived Portal 51 identity already associated with shock/arousal in the existing registry. The builder copies the exact repository name into canonicalPortalName.**  
  
```json  
{  
  "layerId": "portal_layer_bree_environment_51_dtla_1994",  
  "portalId": "51",  
  "canonicalPortalName": "RESOLVE_FROM_EXISTING_CANONICAL_REGISTRY",  
  "source": "environment",  
  "sourceFieldIds": ["field_bree_dtla_1992_1998"],  
  "sourceFindingIds": ["finding_northridge_earthquake_overlap"],  
  "placePeriodIds": ["place_bree_downtown_la_1992_1998"],  
  "direction": "sensitize",  
  "state": "context_dependent",  
  "pressure": null,  
  "confidence": 0,  
  "persistent": false,  
  "replaceExistingLayers": false,  
  "calculations": [],  
  "evidenceIds": ["official_usgs_event_record"],  
  "contradictionRefs": [],  
  "convergenceNotes": [],  
  "unresolvedRequirements": [  
    "Residence-level shaking intensity",  
    "Household exposure evidence",  
    "Person-specific recognition evidence",  
    "Canonical environmental-sensitivity rule for Portal 51"  
  ]  
}  
```  
  
**The event record exists with high confidence. The personal portal effect remains unresolved until the canonical environmental-sensitivity rule and sufficient person-specific or convergent evidence exist. This demonstrates the separation between event certainty and portal-effect certainty.**  
  
**22. WOUND, ATTACHMENT, SURVIVAL, AND ARC DEPOSITS**  
  
**Location output supplies environmental pressure evidence to later evaluators.**  
  
```ts  
type EnvironmentalDownstreamDeposit = {  
  depositId: string  
  sourceFieldId: string  
  sourceFindingIds: string[]  
  targetLayer: 'wound_quality' | 'attachment_survival' | 'arc' | 'life_section'  
  targetId: string  
  evaluationState: 'candidate' | 'active' | 'weak' | 'dormant' | 'contradictory' | 'insufficient_signal'  
  environmentalCondition: string  
  possibleFunction: string | null  
  confidence: number  
  supportingSourceFamilies: string[]  
  conflictingSignalIds: string[]  
  unresolvedRequirements: string[]  
}  
```  
  
**An environmental condition can create a candidate deposit. Activation requires the applicable evaluator’s own rule and evidence threshold.**  
  
**Arc families receiving Location evidence include:**  
  
**	●	developmental arc**  
**	●	trigger arc**  
**	●	pressure arc**  
**	●	protection arc**  
**	●	collapse arc**  
**	●	cost arc**  
**	●	consequence arc**  
**	●	relational-impact arc**  
**	●	repair arc**  
**	●	regulation arc**  
**	●	recurrence arc**  
**	●	activation, caution, and repair windows**  
  
**Every arc preserves source IDs, start and end conditions, confidence, current state, portal routes, Life Section routes, contradictions, and evidence that would strengthen or weaken it.**  
  
**23. DR. MAISEL LENS ROUTING**  
  
**The Location field can later be inspected through all 25 stable lenses after sufficient signal exists:**  
  
**	1.	Original Personality**  
**	2.	Formed Personality**  
**	3.	Available Personality**  
**	4.	Circumstance**  
**	5.	Time Passing**  
**	6.	Mind Space**  
**	7.	Instinct**  
**	8.	Individual Psychology**  
**	9.	Social Psychology**  
**	10.	Development**  
**	11.	Biology**  
**	12.	Family**  
**	13.	Cognition**  
**	14.	Behavior**  
**	15.	Social Connection**  
**	16.	Experience**  
**	17.	Endowment**  
**	18.	Stress**  
**	19.	Trauma**  
**	20.	Emotion**  
**	21.	Culture and Society**  
**	22.	Environmental Factors**  
**	23.	Psychiatric Medication and Chemicals**  
**	24.	Creativity**  
**	25.	Life Purpose and Meaning**  
  
**Each lens receives validated signals. It returns a distinct extraction with inspected signal IDs, evidence, confidence, contradictions, portal routes, Life Section routes, and availability state.**  
  
**24. RECURSIVE PASSES**  
  
**When Location evidence enters the Full Helix, recursive passes operate in this order:**  
  
|Pass|Purpose                                                                                     |  
|----|--------------------------------------------------------------------------------------------|  
|1   |Identify the obvious repeated pattern                                                       |  
|2   |Identify the hidden protection strategy                                                     |  
|3   |Identify trigger, relational collision, and sabotage mechanism                              |  
|4   |Identify cost to self, cost to others, and perceived impact                                 |  
|5   |Identify deeper wound, loyalty, inherited script, or survival bargain                       |  
|6   |Identify a collapse arc when evidence supports it                                           |  
|7   |Identify regulation requirement and observable repair conditions when evidence supports them|  
  
**Every pass stores its pass number, purpose, input signal IDs, output signal IDs, added depth, contradictions, convergence notes, exhausted state, portal routes, Life Section routes, engine version, and timestamp.**  
  
**A pass that adds no new non-redundant information returns signal_exhausted: true.**  
  
**25. CONVERGENCE, DIVERGENCE, AND VAULTING**  
  
```ts  
type ConvergenceRecord = {  
  convergenceId: string  
  patternKey: string  
  supportingSignalIds: string[]  
  supportingSourceFamilies: string[]  
  independentSourceCount: number  
  recurrenceCount: number  
  confidence: number  
  portalRoutes: string[]  
  lensRoutes: string[]  
  lifeSectionRoutes: string[]  
  notes: string[]  
}  
type DivergenceRecord = {  
  divergenceId: string  
  patternKey: string  
  conflictingSignalIds: string[]  
  conflictingSourceFamilies: string[]  
  weakenedConfidenceReason: string  
  ambiguityNotes: string[]  
  portalRoutes: string[]  
  lifeSectionRoutes: string[]  
}  
type VaultedSignal = {  
  vaultedSignalId: string  
  sourceSignalIds: string[]  
  reasonVaulted: string  
  convergenceStrength: number  
  portalRoutes: string[]  
  lifeSectionRoutes: string[]  
  carryForwardStatus: 'active' | 'weakened' | 'contradicted' | 'exhausted'  
  laterEvents: string[]  
}  
```  
  
**Multiple derivatives of the same source remain one source family. Contradiction changes confidence and wording while preserving both records.**  
  
**26. GENERATOR OUTPUT**  
  
```ts  
type GeneratorLocationInteractionPayload = {  
  runId: string  
  personId: string  
  schemaVersion: string  
  engineVersion: string  
  calculatedAt: string  
  validatedInput: unknown  
  westernSourceRecord: WesternSourceRecord  
  placeResolutions: PlaceResolution[]  
  exposureWindows: ExposureWindow[]  
  sourceRecords: LocationSourceRecord[]  
  publicObservableSignals: PublicObservableSignal[]  
  environmentalInterrogationAnswers: EnvironmentalInterrogationAnswer[]  
  environmentalFields: EnvironmentalPressureField[]  
  environmentalResonanceRecords: EnvironmentalResonanceRecord[]  
  locationDeltas: LocationDelta[]  
  baselinePressureProfile: BaselinePressureProfile  
  westernLocationInteractionFindings: WesternLocationInteractionFinding[]  
  westernPortalLayers: unknown[]  
  portalEnvironmentalLayers: PortalEnvironmentalLayer[]  
  downstreamDeposits: EnvironmentalDownstreamDeposit[]  
  convergence: ConvergenceRecord[]  
  divergence: DivergenceRecord[]  
  vaultedSignals: VaultedSignal[]  
  contradictions: string[]  
  unresolvedVariables: string[]  
  confidence: number  
  lifeSectionRoutes: string[]  
  oracleReadyClaims: Array<{  
    claimId: string  
    text: string  
    supportingInteractionFindingIds: string[]  
    supportingConvergenceIds: string[]  
    contradictionIds: string[]  
    evidenceIds: string[]  
    provenanceIds: string[]  
    confidence: number  
  }>  
  blockers: Array<{  
    blockerId: string  
    type: 'provider_required' | 'credential_required' | 'location_resolution_required' | 'canonical_rule_required' | 'validation_dataset_required'  
    description: string  
    affectedOutputs: string[]  
  }>  
  completion: {  
    placeResolutionComplete: boolean  
    environmentalFieldsComplete: boolean  
    environmentalResonanceComplete: boolean  
    westernLocationInteractionComplete: boolean  
    deltaComplete: boolean  
    baselineComplete: boolean  
    portalDepositComplete: boolean  
    generatorComplete: boolean  
  }  
}  
```  
  
**27. ORACLE LOCATION RENDER**  
  
**The Oracle receives only the finalized Generator output.**  
  
**The first Location render contains:**  
  
**	1.	The environments and periods examined**  
**	2.	The strongest traceable repeated environmental conditions**  
**	3.	The largest traceable transitions between locations**  
**	4.	Conditions that persisted across locations**  
**	5.	Conditions that appeared only during one developmental phase**  
**	6.	Important unknowns and contradictions**  
**	7.	Environmental signals eligible for later chart and portal convergence**  
**	8.	Three to five deeper paths the user may choose**  
  
**Every rendered statement preserves a developer-only lineage path:**  
  
```text  
Oracle sentence  
→ Generator section  
→ convergence or divergence record  
→ recursive pass  
→ portal/lens/Life Section route  
→ environmental finding  
→ source record  
→ original dataset, public observation, or user-confirmed memory  
```  
  
**28. EXAMPLE ORACLE-ELIGIBLE LOCATION LANGUAGE**  
  
**The following language is supported by the current fixture before provider completion:**  
  
> The first recorded environment was Downtown Los Angeles near the Fashion District, spanning pregnancy through approximately age five. The lived-location record describes it as buzzing, active, and highly social, with fashion commerce and visible homelessness sharing the same public field. A major earthquake also occurred during this residence period. Pasadena followed from approximately five to nine, and Hermosa Beach from approximately nine to twenty-eight. The complete contrast between these environments will be calculated from historically matched environmental evidence before personal meaning is assigned.  
  
**The following conclusions remain downstream candidates until supported by convergent evidence:**  
  
**	●	rapid social reading**  
**	●	hypervigilance**  
**	●	stimulation dependence**  
**	●	aesthetic identity formation**  
**	●	difficulty with quiet**  
**	●	compassion-boundary conflict**  
**	●	status sensitivity**  
**	●	achievement pressure**  
**	●	ocean-based regulation**  
  
**29. ZOD BOUNDARIES**  
  
**Every runtime function follows this shape:**  
  
```ts  
export function runLayer(input: unknown): LayerOutput {  
  const validatedInput = LayerInputSchema.parse(input)  
  const rawOutput = calculateLayer(validatedInput)  
  return LayerOutputSchema.parse(rawOutput)  
}  
```  
  
**Required validated boundaries:**  
  
**	●	WesternSourceRecordSchema**  
**	●	LocationHistoryInputSchema**  
**	●	PlacePeriodSchema**  
**	●	PlaceResolutionSchema**  
**	●	ExposureWindowSchema**  
**	●	LocationSourceRecordSchema**  
**	●	PublicObservableSignalSchema**  
**	●	EnvironmentalFindingSchema**  
**	●	EnvironmentalInterrogationAnswerSchema**  
**	●	HistoricalSeriesSummarySchema**  
**	●	EnvironmentalPressureFieldSchema**  
**	●	EnvironmentalResonanceRecordSchema**  
**	●	LocationDeltaSchema**  
**	●	BaselinePressureProfileSchema**  
**	●	WesternLocationInteractionFindingSchema**  
**	●	PortalEnvironmentalLayerSchema**  
**	●	EnvironmentalDownstreamDepositSchema**  
**	●	ConvergenceRecordSchema**  
**	●	DivergenceRecordSchema**  
**	●	VaultedSignalSchema**  
**	●	GeneratorLocationInteractionInputSchema**  
**	●	GeneratorLocationInteractionPayloadSchema**  
**	●	OracleLocationRenderInputSchema**  
**	●	OracleLocationRenderOutputSchema**  
  
**Reuse repository equivalents wherever they already exist.**  
  
**30. EXECUTABLE FUNCTION MAP**  
  
```text  
calculateWesternWithLocalSwissEphemeris  
→ preserveImmutableWesternSourceRecord  
→ validateLocationHistory  
→ resolvePlacePeriods  
→ buildExposureWindows  
→ activateHistoricalProviders  
→ collectOfficialHistoricalRecords  
→ collectPublicObservableSignals  
→ deduplicateEventsAndSpread  
→ runFixedEnvironmentalEvidenceInventory  
→ buildHistoricalSeriesSummaries  
→ calculateEnvironmentalPressureField per place-period  
→ runEnvironmentalMeaningInterrogation  
→ generateEnvironmentalResonanceSummaries  
→ storeEnvironmentalResonanceSelection  
→ calculateLocationDelta for each consecutive pair  
→ buildBaselinePressureProfile  
→ calculateWesternLocationPatternInteraction  
→ preserveWesternAndLocationAsSeparateLayers  
→ depositEnvironmentIntoCanonical64PortalRegistry  
→ routeEnvironmentalCandidatesToWoundAttachmentArcAndLifeSections  
→ detectConvergenceAndDivergence  
→ vaultStableSignals  
→ validateGeneratorLocationInteractionPayload  
→ buildOracleLocationRenderPayload  
```  
  
**Each function accepts a validated input and returns a validated output. Structured Generator data moves between functions.**  
  
**31. STORAGE ENTITIES**  
  
**Persist:**  
  
**	●	person**  
**	●	immutable Western source record**  
**	●	place period**  
**	●	place resolution**  
**	●	exposure window**  
**	●	source record**  
**	●	public observable signal**  
**	●	underlying event**  
**	●	environmental finding**  
**	●	environmental interrogation answer**  
**	●	historical series**  
**	●	environmental pressure field**  
**	●	environmental resonance record and selection**  
**	●	location delta**  
**	●	baseline pressure profile**  
**	●	Western × Location interaction finding**  
**	●	Western portal layer**  
**	●	portal environmental layer**  
**	●	downstream deposit**  
**	●	convergence**  
**	●	divergence**  
**	●	vaulted signal**  
**	●	Generator run**  
**	●	Oracle render payload**  
**	●	user correction or confirmation event**  
  
**User corrections append a new evidence event and preserve the earlier record.**  
  
**32. TEST FIXTURES**  
  
**32.1 Intake validation**  
  
**	●	accepts Bree’s three ordered place-periods;**  
**	●	accepts an approximate prenatal start;**  
**	●	preserves unresolved hospital information separately;**  
**	●	rejects an exposure end before its start;**  
**	●	rejects overlapping primary residence periods unless overlap is explicitly modeled;**  
**	●	retains gaps as explicit unresolved periods;**  
**	●	calculates ages from the exact birth date and approximate move dates with uncertainty.**  
  
**32.2 Geographic precision**  
  
**	●	Downtown resolves at district precision when no address exists;**  
**	●	Pasadena resolves at city precision;**  
**	●	Hermosa Beach resolves at city precision;**  
**	●	a city source cannot produce a neighborhood-level claim;**  
**	●	requested and matched geography are both preserved.**  
  
**32.3 Historical matching**  
  
**	●	1990 Census data may anchor early Downtown exposure with temporal distance recorded;**  
**	●	2000 Census data overlaps Pasadena exposure directly;**  
**	●	Hermosa’s nineteen-year record is segmented and retains change over time;**  
**	●	missing years remain listed;**  
**	●	raw annual values remain after aggregation.**  
  
**32.4 Evidence separation**  
  
**	●	user memory and official sources retain separate source IDs;**  
**	●	a social post and news report about the same event remain one underlying event;**  
**	●	repeated posts from one account do not increase source independence;**  
**	●	an event occurring in the city does not become a personal experience claim;**  
**	●	an environmental condition does not become a personality claim.**  
  
**32.5 Intensity and confidence**  
  
**	●	intensity and confidence validate independently;**  
**	●	high-intensity/low-confidence records remain valid;**  
**	●	low-intensity/high-confidence records remain valid;**  
**	●	an unavailable aggregation formula produces component values with aggregate: null;**  
**	●	UNKNOWN never receives an invented numeric value.**  
  
**32.6 Delta**  
  
**	●	both independent place fields exist before delta calculation;**  
**	●	every marker retains prior value, next value, direction, magnitude, confidence, and evidence IDs;**  
**	●	additions and removals remain separate;**  
**	●	voluntary status, replacement, and restoration access can remain unknown;**  
**	●	no universal good/bad delta is created.**  
  
**32.7 Portal lattice**  
  
**	●	exactly 64 portal environmental layers are returned;**  
**	●	every portal ID is unique;**  
**	●	every portal name matches the existing canonical registry;**  
**	●	weak, dormant, contradictory, low-pressure, and insufficient-signal portals remain stored;**  
**	●	environmental layers never replace astrology, numerology, wound, or other source layers;**  
**	●	replaceExistingLayers is always false;**  
**	●	Portal 51 earthquake fixture preserves event confidence separately from portal-effect confidence.**  
  
**32.8 Traceability**  
  
**	●	every finding traces to one or more source records;**  
**	●	every portal deposit traces to findings and fields;**  
**	●	every convergence record identifies independent source families;**  
**	●	every Oracle sentence traces back to original evidence;**  
**	●	unavailable providers create typed blockers;**  
**	●	Generator completion remains false when required outputs lack evidence and the contract marks them blocking.**  
  
**32.9 Authorization and privacy**  
  
**	●	a second account cannot retrieve or modify Bree’s Location records;**  
**	●	child records cannot bypass person ownership;**  
**	●	debug evidence remains server-side;**  
**	●	Oracle payload exposes only authorized render fields;**  
**	●	deletion and export traverse every child record.**  
  
**32.10 Western, resonance, and interaction**  
  
**	●	local Swiss Ephemeris produces the Western source first;**  
**	●	the complete raw Western result remains immutable and independently inspectable;**  
**	●	Location processing changes no Western position, aspect, house, angle, or retrograde state;**  
**	●	every completed Environmental Pressure Field produces two or three evidence-supported resonance summaries;**  
**	●	the subject can select one, multiple, or none;**  
**	●	resonance selections persist as separate evidence records;**  
**	●	each Western × Location interaction references both immutable parents;**  
**	●	Western and Location enter the portal lattice as separate persistent layers;**  
**	●	every Oracle-ready claim traces to a supported interaction finding.**  
  
**32A. CURRENT GITHUB EXECUTION GAP**  
  
**Comparison target: seen-universe, branch closure-and-composure, HEAD 2a7546418bfd3017875327359b7f203acb4450b2.**  
  
|Area                         |Current decision                                              |GitHub state at compared HEAD                                                              |  
|-----------------------------|--------------------------------------------------------------|-------------------------------------------------------------------------------------------|  
|Western first                |Explicitly locked                                             |Present in `docs/IMPLEMENTATION_THREAD_2026-08-29.md`                                      |  
|Active API order             |Western then Location                                         |`/api/seen/run` calculates Location before Western                                         |  
|Raw Western preservation     |Required                                                      |Implemented through `lib/natalChart.ts` and `lib/seen/westernBridge.ts`                    |  
|Swiss Ephemeris              |Local calculation                                             |Implemented with `swisseph-wasm`                                                           |  
|Location effect              |Modifies expression while preserving astronomy                |GitHub preserves Western calculations                                                      |  
|Location V2 measurement      |PREV, SEV, PHYS, DIG, AMP, BRD, CONC, FRAME, PERSIST, TREND   |Implemented                                                                                |  
|Evidence separation          |Independent channels                                          |Strongly implemented                                                                       |  
|Environmental source universe|Public-observable primary; official baseline and corroboration|Source lanes and provider contracts exist                                                  |  
|Environmental interrogation  |Evidence inventory plus meaning interrogation                 |Registry and inference rules exist                                                         |  
|Principal runtime connection |Location V2 follows Western                                   |Location V2 remains disconnected from the principal runtime                                |  
|Active Location path         |Full Environmental Pressure Field                             |Active runtime uses older `buildLocationField` path                                        |  
|Environmental resonance      |Two or three summaries plus selection record                  |Runtime and persistence incomplete                                                         |  
|64-portal Location layer     |Separate persistent layer                                     |Complete Location routing incomplete                                                       |  
|Western portal mapping       |Portal-specific supported findings                            |Bridge creates 64 `insufficient_signal` records because interpretation criteria are missing|  
|Convergence                  |Western × Location interaction                                |End-to-end executable convergence incomplete                                               |  
|Life Sections                |Supported finding routes                                      |Canonical registry remains unresolved                                                      |  
|Oracle payload               |Traceable final claims                                        |Full Generator-to-Oracle payload incomplete                                                |  
|Confidence                   |Separate from intensity                                       |Implemented in Location V2                                                                 |  
|Contradictions               |Preserved                                                     |Implemented in contracts and partial runtime                                               |  
  
**The implementation target connects the existing machinery into this executable path:**  
  
```text  
WesternSourceRecord  
→ Location V2  
→ EnvironmentalPressureField[]  
→ EnvironmentalResonanceRecord[]  
→ WesternLocationInteractionFinding[]  
→ separate Western and Location portal layers  
→ convergence/divergence  
→ GeneratorLocationInteractionPayload  
→ Oracle render payload  
```  
  
**33. DEFINITION OF DONE**  
  
**The Location build is complete when:**  
  
**	●	local Swiss Ephemeris runs first and its raw Western result remains immutable;**  
**	●	Bree’s three-place fixture validates;**  
**	●	all three places resolve with honest precision;**  
**	●	every place-period runs all 25 evidence-inventory questions and all 32 environmental-meaning questions;**  
**	●	historically matched evidence produces immutable source records;**  
**	●	public observable signals preserve sampling and deduplication data;**  
**	●	every numeric historical series preserves min, max, mean, overlap-weighted mean, trend, and missing years;**  
**	●	each place produces a validated EnvironmentalPressureField;**  
**	●	each completed field produces two or three evidence-supported resonance summaries and stores the subject’s selection separately;**  
**	●	Downtown-to-Pasadena and Pasadena-to-Hermosa deltas validate;**  
**	●	one cumulative BaselinePressureProfile validates;**  
**	●	supported Western × Location interaction findings validate while both parent source records remain unchanged;**  
**	●	Western and Location remain separate persistent portal layers;**  
**	●	the existing canonical registry receives exactly 64 separate environmental layers;**  
**	●	wound, attachment/survival, arc, lens, and Life Section deposits preserve candidate status and lineage;**  
**	●	convergence, divergence, and vaulted signals remain traceable;**  
**	●	the Oracle Location payload contains only supported language;**  
**	●	unit, schema, integration, authorization, and end-to-end tests pass;**  
**	●	typecheck, lint, and production build pass;**  
**	●	at least one rendered sentence is traced end-to-end to its original evidence;**  
**	●	exact commands, results, files changed, blockers, and unresolved variables are reported.**  
  
**34. FINAL BUILDER INPUT**  
  
```text  
Read the repository README and canonical read order completely. Locate the existing Location schemas, environmental contracts, source registry, canonical 64-portal registry, Life Section registry, Generator boundary, Oracle boundary, and current application sequence.  
Map this packet to existing code. Reuse the existing identities and contracts. Implement the missing executable Location vertical slice inside the current SEEN application.  
Use the current execution sequence: local Swiss Ephemeris → immutable WesternSourceRecord → Location V2 → EnvironmentalPressureField → EnvironmentalResonanceRecord → Western × Location interaction → separate Western and Location portal layers → convergence/divergence → GeneratorLocationInteractionPayload → Oracle render payload.  
Use the Bree Downtown Los Angeles → Pasadena → Hermosa Beach place history in this packet as the integration fixture. Run all 25 objective evidence-inventory questions and all 32 environmental-meaning questions for each place-period. Retrieve historically matched evidence through provider adapters. Preserve UNKNOWN and typed blockers wherever evidence is unavailable. Produce EnvironmentalPressureField records, two or three resonance summaries per completed field, stored resonance selections, both LocationDelta records, one BaselinePressureProfile, supported Western × Location interaction findings, exactly 64 canonical portal environmental layers, downstream candidate deposits, convergence/divergence records, and a validated GeneratorLocationInteractionPayload.  
Every runtime boundary parses input and output with Zod. Every source, calculation, transformation, route, contradiction, and rendered statement remains traceable through stable IDs and versions. User-confirmed memories remain separate from official and public-observable evidence. Intensity remains separate from confidence. Each modality remains a separate append-only layer.  
Implement code, schemas, storage, provider boundaries, API routes, and tests. Run typecheck, lint, unit tests, integration tests, authorization tests, end-to-end mobile verification, and the production build. Report exact files changed, exact commands and results, blockers, unresolved variables, and the full lineage path for one Oracle sentence.  
```  
