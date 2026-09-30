export type SketchId = 'western' | 'vedic' | 'blended';

export type LocationSketch = {
  id: SketchId;
  title: string;
  body: string;
  gift: string;
  cost: string;
};

export type LocationPressureRecord = {
  label: string;
  sketches: LocationSketch[];
  definite: string[];
  probableIfChosen: Record<SketchId, string[]>;
  potential: string[];
  selectedSketchId: SketchId | null;
  status: 'potential_until_chosen' | 'sketch_locked';
};

type TownClass = 'storefront' | 'shop_floor' | 'tourist_port' | 'commute_suburb' | 'working_city';

function classify(label: string): TownClass {
  const t = label.toLowerCase();
  if (/(whitefish|aspen|park city|jackson hole|telluride|sun valley)/.test(t)) return 'storefront';
  if (/(kalispell|great falls|billings|missoula|spokane)/.test(t)) return 'shop_floor';
  if (/(nice|cannes|venice|barcelona|key west|myrtle beach|cancun)/.test(t)) return 'tourist_port';
  if (/(castro valley|concord, ca|livermore|san ramon|pleasanton|hayward)/.test(t)) return 'commute_suburb';
  return 'working_city';
}

const CLASS_COPY: Record<
  TownClass,
  {
    sketches: LocationSketch[];
    definite: string[];
    probableIfChosen: Record<SketchId, string[]>;
    potential: string[];
  }
> = {
  storefront: {
    sketches: [
      {
        id: 'western',
        title: 'Western lean',
        body: 'The public angle is the mountain and the money. Houses of work and status sit in a town that performs.',
        gift: 'Visibility. A stage if the seed can stand on it.',
        cost: 'The native is priced by the room they cannot own.',
      },
      {
        id: 'vedic',
        title: 'Vedic lean',
        body: 'Season and duty. The town runs on who arrives. Local dharma is service to the look.',
        gift: 'Clear role. You know what the season asks.',
        cost: 'Your own life waits on other people\'s holidays.',
      },
      {
        id: 'blended',
        title: 'Blended',
        body: 'Same soil: display case in front, labor in back. Growth only if the seed can use the season without becoming it.',
        gift: 'Two rooms to learn.',
        cost: 'Split. Never fully guest, never fully local.',
      },
    ],
    definite: ['season owns the calendar', 'land is the product', 'money arrives with visitors'],
    probableIfChosen: {
      western: ['status by looking like you belong', 'public performance pressure'],
      vedic: ['duty to the visitor cycle', 'off-season emptiness as fate-window'],
      blended: ['two-town split in one body'],
    },
    potential: ['getting hard', 'getting small', 'leaving as the only plan'],
  },
  shop_floor: {
    sketches: [
      {
        id: 'western',
        title: 'Western lean',
        body: 'Angular life is work, kin, highway. No audience required.',
        gift: 'A usable life. Function over display.',
        cost: 'The pretty neighbor becomes the comparison planet.',
      },
      {
        id: 'vedic',
        title: 'Vedic lean',
        body: 'This is the serving town for the valley. Duty is local and year-round.',
        gift: 'Roots can take. Role is obvious.',
        cost: 'Staying can become a sentence instead of a fit.',
      },
      {
        id: 'blended',
        title: 'Blended',
        body: 'Soil that grows a seed that wants work. Soil that starves a seed that wants a stage.',
        gift: 'Fit if the seed is built for ordinary gravity.',
        cost: 'Rot if the seed needed the storefront.',
      },
    ],
    definite: ['work calendar', 'winter as duration', 'this town stocks the valley'],
    probableIfChosen: {
      western: ['low performance pressure', 'comparison to the resort town'],
      vedic: ['stay as duty', 'winter as tapas'],
      blended: ['fit or rot, no middle postcard'],
    },
    potential: ['never leave', 'resent the display town'],
  },
  tourist_port: {
    sketches: [
      {
        id: 'western',
        title: 'Western lean',
        body: 'The 1st-house street is a promenade. The city is onstage. Work sits in the 6th behind the glass.',
        gift: 'Beauty as daily air.',
        cost: 'Your sidewalk is not yours in season.',
      },
      {
        id: 'vedic',
        title: 'Vedic lean',
        body: 'Heat, salt, guests. The town\'s dharma is hospitality. Local life is scheduled around arrival.',
        gift: 'Light and movement most of the year.',
        cost: 'Peace only when the guests leave.',
      },
      {
        id: 'blended',
        title: 'Blended',
        body: 'Front performs. Inland blocks live. Same name. Pick which soil you actually stood in.',
        gift: 'Two cities to use.',
        cost: 'The wrong block makes the seed pay the front\'s bill.',
      },
    ],
    definite: ['visitors on the front in season', 'service economy in the center'],
    probableIfChosen: {
      western: ['city as stage', 'crowding as angular pressure'],
      vedic: ['hospitality duty', 'seasonal emptiness'],
      blended: ['front vs inland split'],
    },
    potential: ['theft on the strip', 'loving the swarm', 'never seeing the inland blocks'],
  },
  commute_suburb: {
    sketches: [
      {
        id: 'western',
        title: 'Western lean',
        body: 'Houses and schools as status. The 10th lives in another city. This soil is the 4th with a meter on it.',
        gift: 'Enclosure. A yard. A district.',
        cost: 'Hours sold to the corridor.',
      },
      {
        id: 'vedic',
        title: 'Vedic lean',
        body: 'Dharma is maintenance: house, kids, train. The fruiting field is elsewhere.',
        gift: 'Predictable role.',
        cost: 'The seed works where it does not sleep.',
      },
      {
        id: 'blended',
        title: 'Blended',
        body: 'Quiet name, regional price. Grow here if enclosure feeds you. Starve here if you needed a center.',
        gift: 'A held room.',
        cost: 'The city you serve does not know your street.',
      },
    ],
    definite: ['commute as weather', 'housing cost as air', 'thin night street'],
    probableIfChosen: {
      western: ['status by house and school'],
      vedic: ['duty to household over city'],
      blended: ['owned vs priced-out split'],
    },
    potential: ['never belonging to the city you work in'],
  },
  working_city: {
    sketches: [
      {
        id: 'western',
        title: 'Western lean',
        body: 'A city with a public face and a working floor. Angles belong to whoever owns the street.',
        gift: 'A real public room.',
        cost: 'The face can eat the floor.',
      },
      {
        id: 'vedic',
        title: 'Vedic lean',
        body: 'Season and labor. What repeats here becomes the tapas.',
        gift: 'Clear cycles.',
        cost: 'Duty without a chosen god.',
      },
      {
        id: 'blended',
        title: 'Blended',
        body: 'Same stack, two mouths. Grow if this soil matches the seed. Split if it does not.',
        gift: 'A usable field.',
        cost: 'Wrong sketch, wrong dose.',
      },
    ],
    definite: ['a public street with an owner', 'a season that repeats', 'a way money enters'],
    probableIfChosen: {
      western: ['lived the face'],
      vedic: ['lived the duty'],
      blended: ['lived the split'],
    },
    potential: ['getting hard', 'getting small', 'leaving', 'taking root'],
  },
};

export function buildLocationPressure(label: string): LocationPressureRecord {
  const pack = CLASS_COPY[classify(label)];
  return {
    label,
    sketches: pack.sketches,
    definite: pack.definite,
    probableIfChosen: pack.probableIfChosen,
    potential: pack.potential,
    selectedSketchId: null,
    status: 'potential_until_chosen',
  };
}

export function lockLocationSketch(
  record: LocationPressureRecord,
  selectedSketchId: SketchId,
): LocationPressureRecord {
  return {
    ...record,
    selectedSketchId,
    status: 'sketch_locked',
  };
}
