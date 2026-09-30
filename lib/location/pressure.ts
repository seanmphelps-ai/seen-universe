export type SketchId = 'A' | 'B' | 'C';

export type LocationSketch = {
  id: SketchId;
  title: string;
  body: string;
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
      { id: 'A', title: 'Surface', body: 'Pretty town. Mountain or lake as the product. Visitors set the temperature of the main street.' },
      { id: 'B', title: 'Working floor', body: 'You serve the look. Hours bend to season. Locals buy groceries where tourists buy the view.' },
      { id: 'C', title: 'Split', body: 'One zip, two rooms: the display case and the apartments behind it. Which room you slept in is the dose.' },
    ],
    definite: ['season owns the calendar', 'land is the product', 'money arrives with visitors', 'off-season empties the room'],
    probableIfChosen: {
      A: ['protected by the postcard', 'status by looking like you belong'],
      B: ['crowded out of your own center', 'service hours', 'winter crash'],
      C: ['two-town split in one body', 'never fully in either room'],
    },
    potential: ['getting hard', 'getting small', 'using people', 'leaving as the only plan'],
  },
  shop_floor: {
    sketches: [
      { id: 'A', title: 'Surface', body: 'Valley town. Errands, hospital, highway. Ordinary on purpose.' },
      { id: 'B', title: 'Working floor', body: 'You stay because the work and kin are here. Winter is a job, not a postcard.' },
      { id: 'C', title: 'Split', body: 'This town serves the pretty neighbor. Some grow here. Some rot waiting to become the other place.' },
    ],
    definite: ['work calendar not visitor calendar', 'winter as duration', 'this town stocks the valley'],
    probableIfChosen: {
      A: ['fit in the ordinary', 'low performance pressure'],
      B: ['stay for function', 'weather as grind'],
      C: ['comparison to the storefront neighbor', 'leaving as a flex or a wound'],
    },
    potential: ['numb out-season', 'resent the display town', 'never leave'],
  },
  tourist_port: {
    sketches: [
      { id: 'A', title: 'Surface', body: 'Light, sea, promenade. The city is meant to be looked at.' },
      { id: 'B', title: 'Working floor', body: 'Your sidewalk is their vacation. Work and night follow tourist money.' },
      { id: 'C', title: 'Split', body: 'Front is performance. Inland blocks are the other city. Same name, different dose.' },
    ],
    definite: ['visitors on the front in season', 'outdoor life most of the year', 'service economy in the center'],
    probableIfChosen: {
      A: ['protected by beauty', 'city as stage'],
      B: ['crowded out of your own downtown', 'hours bent to visitors'],
      C: ['two cities, one name', 'which side of the hill you slept on'],
    },
    potential: ['theft on the strip', 'loving the swarm', 'never seeing the inland blocks'],
  },
  commute_suburb: {
    sketches: [
      { id: 'A', title: 'Surface', body: 'Hills, schools, parks. A quiet name next to a loud region.' },
      { id: 'B', title: 'Working floor', body: 'Life is timed to the freeway and the train. You live beside the machine, not on its stage.' },
      { id: 'C', title: 'Split', body: 'Owners from earlier years and renters paying the new price. Same street, different stay.' },
    ],
    definite: ['commute as weather', 'housing cost as air', 'thin nightlife', 'region sets the price'],
    probableIfChosen: {
      A: ['school-and-park enclosure', 'privacy as the product'],
      B: ['hours given to the corridor', 'tired by the time you get home'],
      C: ['owned vs priced-out split'],
    },
    potential: ['never belonging to the city you work in', 'status by house and school'],
  },
  working_city: {
    sketches: [
      { id: 'A', title: 'Surface', body: 'A city with a face it sells and a floor it lives on.' },
      { id: 'B', title: 'Working floor', body: 'Jobs, weather, and who owns the street shape the day more than the postcard.' },
      { id: 'C', title: 'Split', body: 'Pretty blocks and serving blocks share a name. The sketch you pick is the soil.' },
    ],
    definite: ['a public street with an owner', 'a season that repeats', 'a way money enters the town'],
    probableIfChosen: {
      A: ['lived the face'],
      B: ['lived the floor'],
      C: ['lived the split'],
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
