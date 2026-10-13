// PROVENANCE: bot=grok session=2026-10-13 task=restore portals64 data (no scoring) from seen-runtime/seen_runtime.json SHIP_64
/**
 * The 64 portals (interrogators) as data. NO SCORING: every portal is always
 * returned, unranked and unfiltered. `expression` is a fixed 'available' label
 * kept only for type compatibility with existing consumers.
 */

import { PORTAL_INTERROGATION, type InterrogationSection } from './portalInterrogation';

export type { InterrogationSection };

export type PortalRecord = {
  portalId: number;
  name: string;
  shadowName: string;
  giftName: string;
  shadowOneWord: string;
  giftOneWord: string;
  frequency: string;
  bodyLocation: string;
  dominantDomain: string[];
  woundMarkerAffinity: string[];
  sectionsFed: number[];
  interrogation: InterrogationSection[];
};

export type PortalExpression = PortalRecord & {
  expression: 'available';
  note: string;
};

const PORTALS_64_BASE: Omit<PortalRecord, 'interrogation'>[] = [
  {
    "portalId": 1,
    "name": "The Creative",
    "shadowName": "Entropy",
    "giftName": "Origination",
    "shadowOneWord": "Destruction",
    "giftOneWord": "Genesis",
    "frequency": "Pure creative force — what happens when it has no outlet versus when it flows freely",
    "bodyLocation": "Crown — top of skull",
    "dominantDomain": [
      "CREATIVITY",
      "CAREER",
      "LEGACY"
    ],
    "woundMarkerAffinity": [
      "PLUTO",
      "URANUS",
      "SUN_SQUARE_SATURN"
    ],
    "sectionsFed": [
      8,
      22
    ]
  },
  {
    "portalId": 2,
    "name": "The Receptive",
    "shadowName": "Dislocation",
    "giftName": "Orientation",
    "shadowOneWord": "Rootlessness",
    "giftOneWord": "Belonging",
    "frequency": "The intelligence of knowing where you belong — lost versus found",
    "bodyLocation": "Base of spine — tailbone",
    "dominantDomain": [
      "FAMILY",
      "HOME",
      "RELATIONSHIPS"
    ],
    "woundMarkerAffinity": [
      "CHIRON",
      "SOUTH_NODE",
      "SATURN_SQUARE_MOON"
    ],
    "sectionsFed": [
      6,
      19
    ]
  },
  {
    "portalId": 3,
    "name": "Difficulty at the Beginning",
    "shadowName": "Chaos",
    "giftName": "Innovation",
    "shadowOneWord": "Disruption",
    "giftOneWord": "Mutation",
    "frequency": "The creative chaos that precedes new form — disorder as genesis versus disorder as identity",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "CAREER",
      "CREATIVITY",
      "RELATIONSHIPS"
    ],
    "woundMarkerAffinity": [
      "URANUS",
      "TYPHON",
      "ERIS"
    ],
    "sectionsFed": [
      22
    ]
  },
  {
    "portalId": 4,
    "name": "Youthful Folly",
    "shadowName": "Intolerance",
    "giftName": "Understanding",
    "shadowOneWord": "Rigidity",
    "giftOneWord": "Clarity",
    "frequency": "The mind under pressure to solve — answering before understanding versus genuine clarity",
    "bodyLocation": "Ajna — center of forehead",
    "dominantDomain": [
      "MIND",
      "COMMUNICATION",
      "AUTHORITY"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "MERCURY_RETROGRADE",
      "PLUTO_SQUARE_MOON"
    ],
    "sectionsFed": [
      10,
      16,
      24
    ]
  },
  {
    "portalId": 5,
    "name": "Waiting (Nourishment)",
    "shadowName": "Impatience",
    "giftName": "Patience",
    "shadowOneWord": "Rush",
    "giftOneWord": "Timing",
    "frequency": "Alignment with natural timing — forcing versus trusting the rhythm",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "CAREER",
      "RELATIONSHIPS",
      "HEALTH"
    ],
    "woundMarkerAffinity": [
      "MARS",
      "RAHU",
      "URANUS"
    ],
    "sectionsFed": [
      5,
      8,
      13,
      15,
      23
    ]
  },
  {
    "portalId": 6,
    "name": "Conflict",
    "shadowName": "Conflict",
    "giftName": "Diplomacy",
    "shadowOneWord": "War",
    "giftOneWord": "Peace",
    "frequency": "The gatekeeping of intimacy — friction as destruction versus friction as genuine contact",
    "bodyLocation": "Solar plexus — upper abdomen",
    "dominantDomain": [
      "RELATIONSHIPS",
      "FAMILY",
      "COMMUNITY"
    ],
    "woundMarkerAffinity": [
      "MARS",
      "LILITH",
      "ERIS",
      "TYPHON"
    ],
    "sectionsFed": [
      2,
      17,
      18,
      26,
      40
    ]
  },
  {
    "portalId": 7,
    "name": "The Army",
    "shadowName": "Division",
    "giftName": "Unity",
    "shadowOneWord": "Separation",
    "giftOneWord": "Direction",
    "frequency": "Leadership and collective organization — fragmentation versus coherent direction",
    "bodyLocation": "G-Center — center of chest",
    "dominantDomain": [
      "COMMUNITY",
      "AUTHORITY",
      "CAREER"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "PLUTO",
      "SOUTH_NODE"
    ],
    "sectionsFed": [
      9,
      18,
      32,
      39,
      41
    ]
  },
  {
    "portalId": 8,
    "name": "Holding Together [Union]",
    "shadowName": "Mediocrity",
    "giftName": "Contribution",
    "shadowOneWord": "Invisibility",
    "giftOneWord": "Impact",
    "frequency": "The drive to contribute something real — playing small versus genuine offering",
    "bodyLocation": "Throat — base of neck",
    "dominantDomain": [
      "CAREER",
      "COMMUNITY",
      "LEGACY"
    ],
    "woundMarkerAffinity": [
      "CHIRON",
      "SATURN",
      "ZOSMA"
    ],
    "sectionsFed": [
      9,
      41
    ]
  },
  {
    "portalId": 9,
    "name": "The Taming Power of the Small",
    "shadowName": "Stubbornness",
    "giftName": "Determination",
    "shadowOneWord": "Inflexibility",
    "giftOneWord": "Focus",
    "frequency": "Focused attention on detail — rigidity versus precise perseverance",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "CAREER",
      "HEALTH",
      "MIND"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "PLUTO",
      "FIXED_STAR_ANTARES"
    ],
    "sectionsFed": [
      4,
      15,
      23,
      25
    ]
  },
  {
    "portalId": 10,
    "name": "Treading [Conduct]",
    "shadowName": "Self-Sabotage",
    "giftName": "Authenticity",
    "shadowOneWord": "Destruction",
    "giftOneWord": "Integrity",
    "frequency": "How the self moves through the world — undermining versus genuine expression",
    "bodyLocation": "G-Center — center of chest",
    "dominantDomain": [
      "IDENTITY",
      "CAREER",
      "RELATIONSHIPS"
    ],
    "woundMarkerAffinity": [
      "LILITH",
      "CHIRON",
      "PLUTO",
      "SOUTH_NODE"
    ],
    "sectionsFed": [
      27,
      29,
      42
    ]
  },
  {
    "portalId": 11,
    "name": "Peace",
    "shadowName": "Fear of Failure",
    "giftName": "Inspiration",
    "shadowOneWord": "Paralysis",
    "giftOneWord": "Vision",
    "frequency": "The relationship between inner world and outer expression — paralysis versus generative vision",
    "bodyLocation": "Ajna — center of forehead",
    "dominantDomain": [
      "CAREER",
      "CREATIVITY",
      "MIND"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "CHIRON",
      "NEPTUNE"
    ],
    "sectionsFed": [
      10,
      29,
      42
    ]
  },
  {
    "portalId": 12,
    "name": "Standstill [Stagnation]",
    "shadowName": "Over-Responsibility",
    "giftName": "Discretion",
    "shadowOneWord": "Burden",
    "giftOneWord": "Discernment",
    "frequency": "The management of expression — saying everything versus knowing what to withhold",
    "bodyLocation": "Throat — base of neck",
    "dominantDomain": [
      "FAMILY",
      "RELATIONSHIPS",
      "HEALTH"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "CHIRON",
      "NESSUS"
    ],
    "sectionsFed": []
  },
  {
    "portalId": 13,
    "name": "Fellowship with Men",
    "shadowName": "Victimhood",
    "giftName": "Empathy",
    "shadowOneWord": "Blame",
    "giftOneWord": "Witnessing",
    "frequency": "The capacity for genuine human connection — blame versus true witnessing",
    "bodyLocation": "G-Center — center of chest",
    "dominantDomain": [
      "RELATIONSHIPS",
      "COMMUNITY",
      "FAMILY"
    ],
    "woundMarkerAffinity": [
      "CHIRON",
      "NEPTUNE",
      "DEJANIRA",
      "SOUTH_NODE"
    ],
    "sectionsFed": [
      9,
      19,
      26,
      39,
      41
    ]
  },
  {
    "portalId": 14,
    "name": "Possession in Great Measure",
    "shadowName": "Greed",
    "giftName": "Competence",
    "shadowOneWord": "Hoarding",
    "giftOneWord": "Mastery",
    "frequency": "The relationship to power and resources — hoarding versus mastery",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "MONEY",
      "CAREER",
      "POWER"
    ],
    "woundMarkerAffinity": [
      "PLUTO",
      "RAHU",
      "FIXED_STAR_ALGOL"
    ],
    "sectionsFed": [
      1,
      33
    ]
  },
  {
    "portalId": 15,
    "name": "Modesty",
    "shadowName": "Pride",
    "giftName": "Humility",
    "shadowOneWord": "Inflation",
    "giftOneWord": "Groundedness",
    "frequency": "The calibration of self in relation to others — inflation versus genuine modesty",
    "bodyLocation": "G-Center — center of chest",
    "dominantDomain": [
      "RELATIONSHIPS",
      "AUTHORITY",
      "REPUTATION"
    ],
    "woundMarkerAffinity": [
      "SUN_CONJUNCT_PLUTO",
      "LILITH",
      "FIXED_STAR_REGULUS"
    ],
    "sectionsFed": [
      30,
      39,
      43
    ]
  },
  {
    "portalId": 16,
    "name": "Enthusiasm",
    "shadowName": "Envy",
    "giftName": "Versatility",
    "shadowOneWord": "Comparison",
    "giftOneWord": "Expression",
    "frequency": "The enthusiasm of talent — wanting what others have versus expressing unique gifts",
    "bodyLocation": "Throat — base of neck",
    "dominantDomain": [
      "CREATIVITY",
      "RELATIONSHIPS",
      "CAREER"
    ],
    "woundMarkerAffinity": [
      "CHIRON",
      "SATURN",
      "MEDUSA"
    ],
    "sectionsFed": [
      8,
      16
    ]
  },
  {
    "portalId": 17,
    "name": "Following",
    "shadowName": "Lust",
    "giftName": "Anticipation",
    "shadowOneWord": "Consumption",
    "giftOneWord": "Direction",
    "frequency": "The relationship to desire and what follows — consuming versus directing",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "SEXUALITY",
      "RELATIONSHIPS",
      "ADDICTION"
    ],
    "woundMarkerAffinity": [
      "RAHU",
      "MARS",
      "NEPTUNE",
      "LOT_OF_EROS"
    ],
    "sectionsFed": [
      3,
      21,
      40
    ]
  },
  {
    "portalId": 18,
    "name": "Work on What Has Been Spoiled [Decay]",
    "shadowName": "Wrath",
    "giftName": "Integrity",
    "shadowOneWord": "Rage",
    "giftOneWord": "Repair",
    "frequency": "Correcting what has been corrupted — destructive rage versus principled repair",
    "bodyLocation": "Root — base of spine",
    "dominantDomain": [
      "FAMILY",
      "AUTHORITY",
      "SHADOW"
    ],
    "woundMarkerAffinity": [
      "MARS",
      "PLUTO",
      "TYPHON",
      "NESSUS"
    ],
    "sectionsFed": [
      17,
      43
    ]
  },
  {
    "portalId": 19,
    "name": "Approach",
    "shadowName": "Sloth",
    "giftName": "Sensitivity",
    "shadowOneWord": "Numbness",
    "giftOneWord": "Attunement",
    "frequency": "Attunement to need — numbness and withdrawal versus profound sensitivity",
    "bodyLocation": "Root — base of spine",
    "dominantDomain": [
      "HEALTH",
      "RELATIONSHIPS",
      "SPIRITUALITY"
    ],
    "woundMarkerAffinity": [
      "NEPTUNE",
      "CHIRON",
      "KETU",
      "SEDNA"
    ],
    "sectionsFed": [
      4,
      15,
      20,
      23
    ]
  },
  {
    "portalId": 20,
    "name": "Contemplation (View)",
    "shadowName": "Gluttony",
    "giftName": "Presence",
    "shadowOneWord": "Filling",
    "giftOneWord": "Stillness",
    "frequency": "The capacity for full presence — filling the void versus genuine witnessing",
    "bodyLocation": "Throat — base of neck",
    "dominantDomain": [
      "HEALTH",
      "ADDICTION",
      "MIND"
    ],
    "woundMarkerAffinity": [
      "NEPTUNE",
      "RAHU",
      "CHIRON"
    ],
    "sectionsFed": [
      5
    ]
  },
  {
    "portalId": 21,
    "name": "Biting Through",
    "shadowName": "Biting Through",
    "giftName": "Authority",
    "shadowOneWord": "Compulsion",
    "giftOneWord": "Decisiveness",
    "frequency": "The application of force to remove obstacles — compulsive chewing versus decisive authority",
    "bodyLocation": "Will Center — solar plexus",
    "dominantDomain": [
      "CAREER",
      "AUTHORITY",
      "MONEY"
    ],
    "woundMarkerAffinity": [
      "MARS",
      "PLUTO",
      "SATURN"
    ],
    "sectionsFed": [
      18,
      30,
      32
    ]
  },
  {
    "portalId": 22,
    "name": "Grace",
    "shadowName": "Grace Under Pressure",
    "giftName": "Graciousness",
    "shadowOneWord": "Performance",
    "giftOneWord": "Elegance",
    "frequency": "Beauty as a force — superficial adornment versus genuine elegance under pressure",
    "bodyLocation": "Solar plexus — emotional center",
    "dominantDomain": [
      "RELATIONSHIPS",
      "CREATIVITY",
      "REPUTATION"
    ],
    "woundMarkerAffinity": [
      "NEPTUNE",
      "VENUS_SQUARE_NEPTUNE",
      "LILITH"
    ],
    "sectionsFed": [
      8,
      22
    ]
  },
  {
    "portalId": 23,
    "name": "Splitting Apart",
    "shadowName": "Splitting Apart",
    "giftName": "Simplicity",
    "shadowOneWord": "Dissolution",
    "giftOneWord": "Essentials",
    "frequency": "The breakdown of what no longer serves — destruction without rebuild versus essential simplification",
    "bodyLocation": "Throat — base of neck",
    "dominantDomain": [
      "SHADOW",
      "RELATIONSHIPS",
      "IDENTITY"
    ],
    "woundMarkerAffinity": [
      "PLUTO",
      "URANUS",
      "KETU",
      "FIXED_STAR_MULA"
    ],
    "sectionsFed": [
      6,
      11,
      27
    ]
  },
  {
    "portalId": 24,
    "name": "Return (The Turning Point)",
    "shadowName": "Return",
    "giftName": "Rationalization",
    "shadowOneWord": "Repetition",
    "giftOneWord": "Renewal",
    "frequency": "The return to what is essential — repeating old pain versus genuine renewal",
    "bodyLocation": "Ajna — center of forehead",
    "dominantDomain": [
      "SHADOW",
      "RELATIONSHIPS",
      "MIND"
    ],
    "woundMarkerAffinity": [
      "SOUTH_NODE",
      "KETU",
      "SATURN",
      "CHIRON"
    ],
    "sectionsFed": [
      13,
      33
    ]
  },
  {
    "portalId": 25,
    "name": "Innocence (The Unexpected)",
    "shadowName": "Innocence",
    "giftName": "Acceptance",
    "shadowOneWord": "Naivety",
    "giftOneWord": "Naturalness",
    "frequency": "Naturalness and spontaneity — naivety that invites harm versus pure presence",
    "bodyLocation": "G-Center — center of chest",
    "dominantDomain": [
      "IDENTITY",
      "SPIRITUALITY",
      "RELATIONSHIPS"
    ],
    "woundMarkerAffinity": [
      "NEPTUNE",
      "CHIRON",
      "DEJANIRA"
    ],
    "sectionsFed": []
  },
  {
    "portalId": 26,
    "name": "The Taming Power of the Great",
    "shadowName": "Taming Great",
    "giftName": "Manipulation",
    "shadowOneWord": "Control",
    "giftOneWord": "Channeling",
    "frequency": "The storage and application of accumulated power — controlling versus channeling",
    "bodyLocation": "Will Center — solar plexus",
    "dominantDomain": [
      "AUTHORITY",
      "CAREER",
      "MONEY"
    ],
    "woundMarkerAffinity": [
      "PLUTO",
      "SATURN",
      "LILITH"
    ],
    "sectionsFed": [
      26,
      29,
      30
    ]
  },
  {
    "portalId": 27,
    "name": "The Corners of the Mouth (Providing Nourishment)",
    "shadowName": "Nourishment",
    "giftName": "Care",
    "shadowOneWord": "Depletion",
    "giftOneWord": "Nourishment",
    "frequency": "What we feed and what feeds us — nourishing others to depletion versus genuine care",
    "bodyLocation": "Throat — base of neck",
    "dominantDomain": [
      "HEALTH",
      "FAMILY",
      "RELATIONSHIPS"
    ],
    "woundMarkerAffinity": [
      "CHIRON",
      "SATURN",
      "NEPTUNE",
      "NESSUS"
    ],
    "sectionsFed": [
      4,
      25,
      34
    ]
  },
  {
    "portalId": 28,
    "name": "Preponderance of the Great",
    "shadowName": "Preponderance Great",
    "giftName": "Totality",
    "shadowOneWord": "Overwhelm",
    "giftOneWord": "Totality",
    "frequency": "Carrying more than the structure can hold — collapse under weight versus conscious totality",
    "bodyLocation": "Spleen — left side of body",
    "dominantDomain": [
      "HEALTH",
      "CAREER",
      "SHADOW"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "PLUTO",
      "CHIRON",
      "SEDNA"
    ],
    "sectionsFed": [
      28
    ]
  },
  {
    "portalId": 29,
    "name": "The Abysmal (Water)",
    "shadowName": "Abysmal",
    "giftName": "Commitment",
    "shadowOneWord": "Repetition",
    "giftOneWord": "Mastery",
    "frequency": "Entering danger repeatedly — falling into the same abyss versus mastery through immersion",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "SHADOW",
      "ADDICTION",
      "RELATIONSHIPS"
    ],
    "woundMarkerAffinity": [
      "PLUTO",
      "NEPTUNE",
      "SOUTH_NODE",
      "FIXED_STAR_SCHEAT"
    ],
    "sectionsFed": [
      3,
      5,
      7,
      16,
      21,
      42
    ]
  },
  {
    "portalId": 30,
    "name": "The Clinging, Fire",
    "shadowName": "Clinging",
    "giftName": "Passion",
    "shadowOneWord": "Obsession",
    "giftOneWord": "Illumination",
    "frequency": "The nature of desire and attachment — obsessive clinging versus illuminating passion",
    "bodyLocation": "Solar plexus — emotional center",
    "dominantDomain": [
      "RELATIONSHIPS",
      "SEXUALITY",
      "ADDICTION"
    ],
    "woundMarkerAffinity": [
      "RAHU",
      "MARS",
      "NEPTUNE",
      "LOT_OF_EROS"
    ],
    "sectionsFed": [
      3,
      21,
      40
    ]
  },
  {
    "portalId": 31,
    "name": "Influence (Wooing)",
    "shadowName": "Influence",
    "giftName": "Leadership",
    "shadowOneWord": "Seduction",
    "giftOneWord": "Magnetism",
    "frequency": "Mutual influence and attraction — seduction as manipulation versus genuine magnetic leadership",
    "bodyLocation": "Throat — base of neck",
    "dominantDomain": [
      "RELATIONSHIPS",
      "AUTHORITY",
      "COMMUNITY"
    ],
    "woundMarkerAffinity": [
      "LILITH",
      "NEPTUNE",
      "RAHU",
      "ASHLESHA"
    ],
    "sectionsFed": [
      24
    ]
  },
  {
    "portalId": 32,
    "name": "Duration",
    "shadowName": "Duration",
    "giftName": "Continuity",
    "shadowOneWord": "Stagnation",
    "giftOneWord": "Endurance",
    "frequency": "Perseverance and endurance — stagnation dressed as loyalty versus genuine continuity",
    "bodyLocation": "Spleen — left side of body",
    "dominantDomain": [
      "CAREER",
      "RELATIONSHIPS",
      "HEALTH"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "KETU",
      "SOUTH_NODE"
    ],
    "sectionsFed": [
      13,
      32
    ]
  },
  {
    "portalId": 33,
    "name": "Retreat",
    "shadowName": "Retreat",
    "giftName": "Privacy",
    "shadowOneWord": "Avoidance",
    "giftOneWord": "Renewal",
    "frequency": "Strategic withdrawal — running and calling it strategy versus conscious retreat for renewal",
    "bodyLocation": "G-Center — center of chest",
    "dominantDomain": [
      "SHADOW",
      "RELATIONSHIPS",
      "HEALTH"
    ],
    "woundMarkerAffinity": [
      "NEPTUNE",
      "CHIRON",
      "SATURN",
      "KETU"
    ],
    "sectionsFed": [
      33,
      44
    ]
  },
  {
    "portalId": 34,
    "name": "The Power of the Great",
    "shadowName": "Power Great",
    "giftName": "Strength",
    "shadowOneWord": "Force",
    "giftOneWord": "Power",
    "frequency": "Raw power — force without wisdom versus strength in service of something real",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "CAREER",
      "SEXUALITY",
      "AUTHORITY"
    ],
    "woundMarkerAffinity": [
      "MARS",
      "PLUTO",
      "TYPHON",
      "URANUS"
    ],
    "sectionsFed": [
      30
    ]
  },
  {
    "portalId": 35,
    "name": "Progress",
    "shadowName": "Progress",
    "giftName": "Change",
    "shadowOneWord": "Burnout",
    "giftOneWord": "Advancement",
    "frequency": "Advancement and recognition — advancing to burnout versus genuine evolutionary progress",
    "bodyLocation": "Throat — base of neck",
    "dominantDomain": [
      "CAREER",
      "REPUTATION",
      "LEGACY"
    ],
    "woundMarkerAffinity": [
      "RAHU",
      "MARS",
      "SATURN_SQUARE_SUN"
    ],
    "sectionsFed": [
      43
    ]
  },
  {
    "portalId": 36,
    "name": "Darkening of the Light",
    "shadowName": "Darkening Light",
    "giftName": "Crisis",
    "shadowOneWord": "Concealment",
    "giftOneWord": "Protection",
    "frequency": "The concealment of light under oppressive conditions — hiding the flame versus protecting the inner light",
    "bodyLocation": "Solar plexus — emotional center",
    "dominantDomain": [
      "SHADOW",
      "FAMILY",
      "IDENTITY"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "PLUTO",
      "NEPTUNE",
      "CHIRON"
    ],
    "sectionsFed": [
      5,
      6,
      7,
      27
    ]
  },
  {
    "portalId": 37,
    "name": "The Family [The Clan]",
    "shadowName": "Family",
    "giftName": "Equality",
    "shadowOneWord": "Obligation",
    "giftOneWord": "Belonging",
    "frequency": "The ordering of the family system — duty as trap versus genuine belonging",
    "bodyLocation": "Solar plexus — emotional center",
    "dominantDomain": [
      "FAMILY",
      "RELATIONSHIPS",
      "COMMUNITY"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "CHIRON",
      "SOUTH_NODE",
      "PHOLUS"
    ],
    "sectionsFed": [
      2,
      26,
      37
    ]
  },
  {
    "portalId": 38,
    "name": "Opposition",
    "shadowName": "Opposition",
    "giftName": "Honor",
    "shadowOneWord": "Polarization",
    "giftOneWord": "Integration",
    "frequency": "The tension between opposites — polarity as permanent conflict versus creative tension",
    "bodyLocation": "Root — base of spine",
    "dominantDomain": [
      "RELATIONSHIPS",
      "AUTHORITY",
      "COMMUNITY"
    ],
    "woundMarkerAffinity": [
      "URANUS",
      "ERIS",
      "MARS_OPPOSITE_SATURN"
    ],
    "sectionsFed": [
      2,
      17,
      18,
      39
    ]
  },
  {
    "portalId": 39,
    "name": "Obstruction",
    "shadowName": "Obstruction",
    "giftName": "Provocation",
    "shadowOneWord": "Blocking",
    "giftOneWord": "Redirection",
    "frequency": "The obstacle that demands a different path — blocking and blaming versus finding the true way",
    "bodyLocation": "Root — base of spine",
    "dominantDomain": [
      "CAREER",
      "SHADOW",
      "HEALTH"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "CHIRON",
      "KETU"
    ],
    "sectionsFed": [
      18
    ]
  },
  {
    "portalId": 40,
    "name": "Deliverance",
    "shadowName": "Deliverance",
    "giftName": "Resolve",
    "shadowOneWord": "Escape",
    "giftOneWord": "Liberation",
    "frequency": "Liberation from tension — escape instead of heal versus genuine resolution",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "SHADOW",
      "ADDICTION",
      "RELATIONSHIPS"
    ],
    "woundMarkerAffinity": [
      "NEPTUNE",
      "URANUS",
      "SOUTH_NODE"
    ],
    "sectionsFed": [
      28
    ]
  },
  {
    "portalId": 41,
    "name": "Decrease",
    "shadowName": "Decrease",
    "giftName": "Contraction",
    "shadowOneWord": "Scarcity",
    "giftOneWord": "Preparation",
    "frequency": "Reduction as preparation — loss as punishment versus conscious contraction before expansion",
    "bodyLocation": "Root — base of spine",
    "dominantDomain": [
      "MONEY",
      "HEALTH",
      "SHADOW"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "CHIRON",
      "SEDNA"
    ],
    "sectionsFed": [
      1,
      6,
      33
    ]
  },
  {
    "portalId": 42,
    "name": "Increase",
    "shadowName": "Increase",
    "giftName": "Expansion",
    "shadowOneWord": "Excess",
    "giftOneWord": "Growth",
    "frequency": "Growth and abundance — excess and greed versus genuine expansion",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "MONEY",
      "CAREER",
      "CREATIVITY"
    ],
    "woundMarkerAffinity": [
      "RAHU",
      "JUPITER_AFFLICTED",
      "PLUTO"
    ],
    "sectionsFed": [
      1,
      33
    ]
  },
  {
    "portalId": 43,
    "name": "Break-through (Resoluteness)",
    "shadowName": "Breakthrough",
    "giftName": "Insight",
    "shadowOneWord": "Rupture",
    "giftOneWord": "Resolution",
    "frequency": "The decisive moment of resolution — breakthrough as rupture versus breakthrough as clarity",
    "bodyLocation": "Ajna — center of forehead",
    "dominantDomain": [
      "MIND",
      "CAREER",
      "SHADOW"
    ],
    "woundMarkerAffinity": [
      "URANUS",
      "PLUTO",
      "MARS"
    ],
    "sectionsFed": [
      22,
      43
    ]
  },
  {
    "portalId": 44,
    "name": "Coming to Meet",
    "shadowName": "Coming to Meet",
    "giftName": "Alertness",
    "shadowOneWord": "Entrapment",
    "giftOneWord": "Discernment",
    "frequency": "The encounter with what approaches — seductive drain versus conscious alertness",
    "bodyLocation": "Spleen — left side of body",
    "dominantDomain": [
      "RELATIONSHIPS",
      "SEXUALITY",
      "SHADOW"
    ],
    "woundMarkerAffinity": [
      "LILITH",
      "ASHLESHA",
      "NEPTUNE",
      "RAHU"
    ],
    "sectionsFed": [
      2,
      3,
      14,
      26,
      40
    ]
  },
  {
    "portalId": 45,
    "name": "Gathering Together [Massing]",
    "shadowName": "Gathering",
    "giftName": "Communion",
    "shadowOneWord": "Exploitation",
    "giftOneWord": "Community",
    "frequency": "The assembly of community — exploitation of group power versus genuine communion",
    "bodyLocation": "Solar plexus — emotional center",
    "dominantDomain": [
      "COMMUNITY",
      "AUTHORITY",
      "MONEY"
    ],
    "woundMarkerAffinity": [
      "PLUTO",
      "SATURN",
      "LILITH"
    ],
    "sectionsFed": [
      9,
      30,
      41
    ]
  },
  {
    "portalId": 46,
    "name": "Pushing Upward",
    "shadowName": "Pushing Upward",
    "giftName": "Determination",
    "shadowOneWord": "Overreach",
    "giftOneWord": "Ascent",
    "frequency": "Gradual organic ascent — overreach and ambition versus patient upward movement",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "CAREER",
      "LEGACY",
      "SPIRITUALITY"
    ],
    "woundMarkerAffinity": [
      "RAHU",
      "MARS",
      "SATURN"
    ],
    "sectionsFed": []
  },
  {
    "portalId": 47,
    "name": "Oppression (Exhaustion)",
    "shadowName": "Oppression",
    "giftName": "Realization",
    "shadowOneWord": "Constriction",
    "giftOneWord": "Clarity",
    "frequency": "The experience of constriction — the person convinced the floor is the ceiling",
    "bodyLocation": "Ajna — center of forehead",
    "dominantDomain": [
      "CAREER",
      "SHADOW",
      "HEALTH"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "CHIRON",
      "KETU"
    ],
    "sectionsFed": [
      1,
      5,
      16,
      27,
      28,
      42,
      44
    ]
  },
  {
    "portalId": 48,
    "name": "The Well",
    "shadowName": "The Well",
    "giftName": "Depth",
    "shadowOneWord": "Isolation",
    "giftOneWord": "Source",
    "frequency": "The source of nourishment — depth as isolation versus depth as inexhaustible resource",
    "bodyLocation": "Spleen — left side of body",
    "dominantDomain": [
      "MIND",
      "SPIRITUALITY",
      "HEALTH"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "CHIRON",
      "SHATABHISHA_NAKSHATRA"
    ],
    "sectionsFed": [
      4,
      10,
      25,
      34
    ]
  },
  {
    "portalId": 49,
    "name": "Revolution (Molting)",
    "shadowName": "Revolution",
    "giftName": "Principles",
    "shadowOneWord": "Destruction",
    "giftOneWord": "Transformation",
    "frequency": "Fundamental change — revolution as chaos versus principled transformation",
    "bodyLocation": "Solar plexus — emotional center",
    "dominantDomain": [
      "SHADOW",
      "CAREER",
      "AUTHORITY"
    ],
    "woundMarkerAffinity": [
      "PLUTO",
      "URANUS",
      "ERIS",
      "TYPHON"
    ],
    "sectionsFed": []
  },
  {
    "portalId": 50,
    "name": "The Caldron",
    "shadowName": "Cauldron",
    "giftName": "Values",
    "shadowOneWord": "Sacrifice",
    "giftOneWord": "Alchemy",
    "frequency": "Transformation through cooking — sacrifice without meaning versus alchemical transformation",
    "bodyLocation": "Will Center — solar plexus",
    "dominantDomain": [
      "SPIRITUALITY",
      "SHADOW",
      "LEGACY"
    ],
    "woundMarkerAffinity": [
      "PLUTO",
      "CHIRON",
      "BHARANI_NAKSHATRA"
    ],
    "sectionsFed": [
      11,
      27
    ]
  },
  {
    "portalId": 51,
    "name": "The Arousing (Shock, Thunder)",
    "shadowName": "Arousing",
    "giftName": "Initiative",
    "shadowOneWord": "Shock",
    "giftOneWord": "Awakening",
    "frequency": "The shock that awakens — fear response versus awakened initiative",
    "bodyLocation": "Root — base of spine",
    "dominantDomain": [
      "SHADOW",
      "HEALTH",
      "IDENTITY"
    ],
    "woundMarkerAffinity": [
      "URANUS",
      "TYPHON",
      "MARS"
    ],
    "sectionsFed": [
      17,
      20
    ]
  },
  {
    "portalId": 52,
    "name": "Keeping Still, Mountain",
    "shadowName": "Keeping Still",
    "giftName": "Stillness",
    "shadowOneWord": "Frozen",
    "giftOneWord": "Presence",
    "frequency": "The practice of stillness — repression and freezing versus conscious presence",
    "bodyLocation": "Root — base of spine",
    "dominantDomain": [
      "HEALTH",
      "MIND",
      "SPIRITUALITY"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "NEPTUNE",
      "CHIRON"
    ],
    "sectionsFed": [
      15,
      23
    ]
  },
  {
    "portalId": 53,
    "name": "Development (Gradual Progress)",
    "shadowName": "Development",
    "giftName": "Beginnings",
    "shadowOneWord": "Impatience",
    "giftOneWord": "Organic Growth",
    "frequency": "Organic gradual development — impatience destroying what is growing versus trust in organic timing",
    "bodyLocation": "Root — base of spine",
    "dominantDomain": [
      "CAREER",
      "RELATIONSHIPS",
      "HEALTH"
    ],
    "woundMarkerAffinity": [
      "MARS",
      "RAHU",
      "SATURN"
    ],
    "sectionsFed": [
      13
    ]
  },
  {
    "portalId": 54,
    "name": "The Marrying Maiden",
    "shadowName": "Marrying Maiden",
    "giftName": "Ambition",
    "shadowOneWord": "Subservience",
    "giftOneWord": "Right Timing",
    "frequency": "The secondary position — subservience as manipulation versus healthy ambition",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "RELATIONSHIPS",
      "CAREER",
      "SEXUALITY"
    ],
    "woundMarkerAffinity": [
      "LILITH",
      "CHIRON",
      "SOUTH_NODE",
      "LOT_OF_NECESSITY"
    ],
    "sectionsFed": [
      13
    ]
  },
  {
    "portalId": 55,
    "name": "Abundance [Fullness]",
    "shadowName": "Abundance",
    "giftName": "Spirit",
    "shadowOneWord": "Peak Collapse",
    "giftOneWord": "Transcendence",
    "frequency": "The peak moment — abundance turning to decline versus spirit that transcends peak and valley",
    "bodyLocation": "Solar plexus — emotional center",
    "dominantDomain": [
      "MONEY",
      "CAREER",
      "SPIRITUALITY"
    ],
    "woundMarkerAffinity": [
      "PLUTO",
      "SATURN",
      "RAHU"
    ],
    "sectionsFed": [
      22
    ]
  },
  {
    "portalId": 56,
    "name": "The Wanderer",
    "shadowName": "Wanderer",
    "giftName": "Stimulation",
    "shadowOneWord": "Alienation",
    "giftOneWord": "Perspective",
    "frequency": "The traveler without home — rootless alienation versus the wisdom of the witness",
    "bodyLocation": "G-Center — center of chest",
    "dominantDomain": [
      "IDENTITY",
      "RELATIONSHIPS",
      "SPIRITUALITY"
    ],
    "woundMarkerAffinity": [
      "CHIRON",
      "SOUTH_NODE",
      "SEDNA",
      "URANUS"
    ],
    "sectionsFed": [
      41,
      44
    ]
  },
  {
    "portalId": 57,
    "name": "The Gentle (The Penetrating, Wind)",
    "shadowName": "Gentle",
    "giftName": "Intuition",
    "shadowOneWord": "Infiltration",
    "giftOneWord": "Clarity",
    "frequency": "Penetrating persistence — infiltration and manipulation versus intuitive clarity",
    "bodyLocation": "Spleen — left side of body",
    "dominantDomain": [
      "MIND",
      "RELATIONSHIPS",
      "HEALTH"
    ],
    "woundMarkerAffinity": [
      "NEPTUNE",
      "LILITH",
      "ASHLESHA"
    ],
    "sectionsFed": [
      14,
      15,
      24
    ]
  },
  {
    "portalId": 58,
    "name": "The Joyous, Lake",
    "shadowName": "Joyous",
    "giftName": "Vitality",
    "shadowOneWord": "Addiction",
    "giftOneWord": "Joy",
    "frequency": "Joy and pleasure — pleasure as addiction versus genuine vitality",
    "bodyLocation": "Solar plexus — emotional center",
    "dominantDomain": [
      "HEALTH",
      "RELATIONSHIPS",
      "ADDICTION"
    ],
    "woundMarkerAffinity": [
      "NEPTUNE",
      "RAHU",
      "VENUS_SQUARE_NEPTUNE"
    ],
    "sectionsFed": [
      8,
      21,
      34
    ]
  },
  {
    "portalId": 59,
    "name": "Dispersion [Dissolution]",
    "shadowName": "Dispersion",
    "giftName": "Sexuality",
    "shadowOneWord": "Dissolution",
    "giftOneWord": "Opening",
    "frequency": "The dissolution of barriers — loss of self versus genuine opening",
    "bodyLocation": "Sacral — lower abdomen",
    "dominantDomain": [
      "SEXUALITY",
      "RELATIONSHIPS",
      "SPIRITUALITY"
    ],
    "woundMarkerAffinity": [
      "NEPTUNE",
      "LILITH",
      "CHIRON"
    ],
    "sectionsFed": [
      3
    ]
  },
  {
    "portalId": 60,
    "name": "Limitation",
    "shadowName": "Limitation",
    "giftName": "Acceptance",
    "shadowOneWord": "Prison",
    "giftOneWord": "Structure",
    "frequency": "The acceptance of limits — boundaries as prison versus structure as liberation",
    "bodyLocation": "Root — base of spine",
    "dominantDomain": [
      "SHADOW",
      "HEALTH",
      "MONEY"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "CHIRON",
      "ORCUS"
    ],
    "sectionsFed": [
      25
    ]
  },
  {
    "portalId": 61,
    "name": "Inner Truth",
    "shadowName": "Inner Truth",
    "giftName": "Mystery",
    "shadowOneWord": "Weaponized Truth",
    "giftOneWord": "Penetrating Truth",
    "frequency": "The truth that penetrates — truth as weapon versus truth as bridge",
    "bodyLocation": "Ajna — center of forehead",
    "dominantDomain": [
      "MIND",
      "RELATIONSHIPS",
      "SPIRITUALITY"
    ],
    "woundMarkerAffinity": [
      "PLUTO",
      "MERCURY_RETROGRADE",
      "CHIRON"
    ],
    "sectionsFed": [
      7,
      24,
      35
    ]
  },
  {
    "portalId": 62,
    "name": "Preponderance of the Small",
    "shadowName": "Preponderance Small",
    "giftName": "Detail",
    "shadowOneWord": "Pettiness",
    "giftOneWord": "Precision",
    "frequency": "Attention to small things — pettiness and obsession with detail versus precision and care",
    "bodyLocation": "Ajna — center of forehead",
    "dominantDomain": [
      "MIND",
      "HEALTH",
      "CAREER"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "MERCURY_RETROGRADE",
      "CHIRON"
    ],
    "sectionsFed": [
      10,
      16
    ]
  },
  {
    "portalId": 63,
    "name": "After Completion",
    "shadowName": "After Completion",
    "giftName": "Doubt",
    "shadowOneWord": "Trap",
    "giftOneWord": "Refinement",
    "frequency": "The moment after success — the trap of completion versus conscious doubt that refines",
    "bodyLocation": "Ajna — center of forehead",
    "dominantDomain": [
      "CAREER",
      "SHADOW",
      "MIND"
    ],
    "woundMarkerAffinity": [
      "SATURN",
      "PLUTO",
      "SOUTH_NODE"
    ],
    "sectionsFed": [
      10,
      11,
      28,
      29,
      31
    ]
  },
  {
    "portalId": 64,
    "name": "Before Completion",
    "shadowName": "Before Completion",
    "giftName": "Confusion",
    "shadowOneWord": "Almost",
    "giftOneWord": "Potential",
    "frequency": "The threshold before the crossing — almost there never quite versus the creative power of the unfinished",
    "bodyLocation": "Crown — top of skull",
    "dominantDomain": [
      "MIND",
      "CAREER",
      "SPIRITUALITY"
    ],
    "woundMarkerAffinity": [
      "NEPTUNE",
      "CHIRON",
      "RAHU"
    ],
    "sectionsFed": [
      7,
      11,
      31,
      35
    ]
  }
];

export const PORTALS_64: readonly PortalRecord[] = PORTALS_64_BASE.map((p) => ({
  ...p,
  interrogation: PORTAL_INTERROGATION[p.portalId] ?? [],
}));

export const PORTAL_64_NAMES: string[] = PORTALS_64.map((p) => p.name);

/** Returns all 64 portals unchanged. Arguments are ignored: no scoring, no filtering. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function expressPortals(..._ignored: unknown[]): PortalExpression[] {
  return PORTALS_64.map((p) => ({
    ...p,
    expression: 'available' as const,
    note: 'Portal remains available; no score is applied.',
  }));
}
