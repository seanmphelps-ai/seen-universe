// PROVENANCE: bot=grok session=2026-10-13 task=t612 universal question set + 45-section routing; data from seen_runtime.json (questionSet, sections[].shipPortals)
/** The ONE universal question set every archetype asks (seen_runtime.json questionSet, 52 questions). */
export const UNIVERSAL_QUESTION_SET: ReadonlyArray<{ section: string; questions: string[] }> = [
  {
    "section": "III. PORTAL SPINE — Hexagram / Gate spine",
    "questions": [
      "Source of pressure",
      "Reaction pattern",
      "Shadow trigger",
      "Evolution path",
      "Collapse behavior",
      "Recovery potential"
    ]
  },
  {
    "section": "Core Shadow Drivers",
    "questions": [
      "Primary wound pattern",
      "Defense mechanism used to survive it",
      "Trigger conditions that activate the defense",
      "Behavior that appears when the trigger fires",
      "Cost of that behavior to self and others"
    ]
  },
  {
    "section": "V. IDENTITY FRACTURE ANALYSIS",
    "questions": [
      "Authentic self impulse",
      "Conditioned survival identity",
      "Moment the split began",
      "Strategies used to maintain the split",
      "(Identity Fracture Points) Conditioned role learned in childhood",
      "(Identity Fracture Points) Long term psychological cost"
    ]
  },
  {
    "section": "VI. SABOTAGE SYSTEMS",
    "questions": [
      "When success triggers fear",
      "How the system disrupts progress",
      "Relationship sabotage patterns",
      "Career sabotage patterns",
      "(Sabotage Mechanisms) Typical sabotage action",
      "(Sabotage Mechanisms) Self punishment cycles"
    ]
  },
  {
    "section": "VII. DECEPTION LOOPS",
    "questions": [
      "Narratives the person tells themselves",
      "Avoidance patterns",
      "Manipulation strategies",
      "Self-deception triggers",
      "(Deception Systems) Situations where the narrative appears",
      "(Deception Systems) What truth the narrative protects",
      "(Deception Systems) How long the loop usually repeats"
    ]
  },
  {
    "section": "VIII. POWDER KEG TRIGGERS",
    "questions": [
      "Authority conflicts",
      "Rejection sensitivity",
      "Abandonment triggers",
      "Loss of control triggers",
      "(Powder Keg Triggers) Environmental triggers",
      "(Powder Keg Triggers) Relationship triggers"
    ]
  },
  {
    "section": "IX. COLLAPSE TRAJECTORY",
    "questions": [
      "Behavior escalation sequence",
      "Isolation patterns",
      "Reputation damage risks",
      "Health consequences"
    ]
  },
  {
    "section": "X. DRAGON CORE",
    "questions": [
      "What the person desires most",
      "What they fear becoming",
      "Where those collide",
      "Conditions that turn it destructive",
      "Conditions that turn it into strength"
    ]
  },
  {
    "section": "XI. RECOVERY PROTOCOL",
    "questions": [
      "Recognition signals",
      "Interrupt actions",
      "Regulation practices",
      "Environmental adjustments",
      "(Recovery Protocols) Conditions where the person functions best"
    ]
  },
  {
    "section": "ATTACHMENT & LOVE LANGUAGE (explored inside every portal — Sean: \"implemented into the dark chart from the very beginning\")",
    "questions": [
      "Attachment move under pressure",
      "Love language withheld / demanded / weaponized"
    ]
  }
]

/** The 45 life sections and which archetypes (portals 1-64) file into each (seen_runtime.json sections[].shipPortals). */
export const LIFE_SECTIONS: ReadonlyArray<{ id: number; name: string; archetypeSources: number[]; source: string }> = [
  {
    "id": 1,
    "name": "Money Flow",
    "archetypeSources": [
      14,
      41,
      42,
      47
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 2,
    "name": "Relationships & Family",
    "archetypeSources": [
      6,
      37,
      38,
      44
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 3,
    "name": "Sexuality & Intimacy",
    "archetypeSources": [
      17,
      30,
      59,
      44,
      29
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 4,
    "name": "Health & Body Aging",
    "archetypeSources": [
      9,
      27,
      48,
      19
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 5,
    "name": "Emotional Shadow",
    "archetypeSources": [
      36,
      47,
      29,
      5,
      20
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 6,
    "name": "Grief & Loss",
    "archetypeSources": [
      23,
      41,
      36,
      2
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 7,
    "name": "Spiritual Crisis",
    "archetypeSources": [
      64,
      36,
      29,
      61
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 8,
    "name": "Joy & Play",
    "archetypeSources": [
      58,
      22,
      1,
      5,
      16
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 9,
    "name": "Community Contribution",
    "archetypeSources": [
      45,
      7,
      13,
      8
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 10,
    "name": "Cognitive Aging",
    "archetypeSources": [
      4,
      62,
      48,
      63,
      11
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 11,
    "name": "Death & Completion",
    "archetypeSources": [
      64,
      63,
      50,
      23
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 12,
    "name": "Geo-Presence Impact",
    "archetypeSources": [],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 13,
    "name": "Time & Age Activation",
    "archetypeSources": [
      5,
      32,
      53,
      54,
      24
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 14,
    "name": "Warning System",
    "archetypeSources": [
      44,
      57
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 15,
    "name": "Yoga Intelligence",
    "archetypeSources": [
      52,
      19,
      57,
      9,
      5
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 16,
    "name": "Decision Fatigue",
    "archetypeSources": [
      4,
      16,
      29,
      47,
      62
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 17,
    "name": "Emotional Trigger Map",
    "archetypeSources": [
      6,
      18,
      38,
      51
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 18,
    "name": "Conflict Playbook",
    "archetypeSources": [
      6,
      7,
      38,
      39,
      21
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 19,
    "name": "Attachment & Abandonment",
    "archetypeSources": [
      13,
      2
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 20,
    "name": "Nervous System Typology",
    "archetypeSources": [
      51,
      19
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 21,
    "name": "Addiction Risk",
    "archetypeSources": [
      17,
      29,
      30,
      58
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 22,
    "name": "Creative Flow",
    "archetypeSources": [
      1,
      3,
      22,
      43,
      55
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 23,
    "name": "Sleep Architecture",
    "archetypeSources": [
      5,
      52,
      19,
      9
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 24,
    "name": "Communication Filters",
    "archetypeSources": [
      4,
      31,
      57,
      61
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 25,
    "name": "Longevity Prevention",
    "archetypeSources": [
      9,
      27,
      48,
      60
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 26,
    "name": "Relational ROI",
    "archetypeSources": [
      6,
      13,
      26,
      44,
      37
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 27,
    "name": "Shadow Integration",
    "archetypeSources": [
      10,
      23,
      36,
      47,
      50
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 28,
    "name": "Failure Recovery",
    "archetypeSources": [
      28,
      40,
      47,
      63
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 29,
    "name": "Success Sabotage",
    "archetypeSources": [
      10,
      11,
      26,
      63
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 30,
    "name": "Power & Humility",
    "archetypeSources": [
      15,
      21,
      34,
      45,
      26
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 31,
    "name": "Final Scorecard",
    "archetypeSources": [
      63,
      64
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 32,
    "name": "Authority Dynamics",
    "archetypeSources": [
      7,
      21,
      32
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 33,
    "name": "Wealth Loops",
    "archetypeSources": [
      14,
      24,
      41,
      42,
      33
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 34,
    "name": "Health Vitality",
    "archetypeSources": [
      27,
      48,
      58
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 35,
    "name": "Spiritual Gateways",
    "archetypeSources": [
      61,
      64
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 36,
    "name": "Legacy Projections",
    "archetypeSources": [],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 37,
    "name": "Parental Imprint",
    "archetypeSources": [
      37
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 38,
    "name": "Childhood Conditioning",
    "archetypeSources": [],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 39,
    "name": "Sibling Dynamics",
    "archetypeSources": [
      38,
      7,
      15,
      13
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 40,
    "name": "Romantic Patterns",
    "archetypeSources": [
      6,
      17,
      30,
      44
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 41,
    "name": "Friendship Patterns",
    "archetypeSources": [
      8,
      13,
      45,
      56,
      7
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 42,
    "name": "Career Sabotage",
    "archetypeSources": [
      10,
      11,
      29,
      47
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 43,
    "name": "Reputation Damage",
    "archetypeSources": [
      15,
      18,
      35,
      43
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 44,
    "name": "Isolation Cycles",
    "archetypeSources": [
      33,
      47,
      56
    ],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  },
  {
    "id": 45,
    "name": "Generational Stain",
    "archetypeSources": [],
    "source": "t591 (Apr 18) / t514 4-29 multischema §6 — identical list, Sean-confirmed"
  }
]
