// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
export type SketchId = 'A' | 'B' | 'C';

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
  Omit<LocationPressureRecord, 'label' | 'selectedSketchId' | 'status'>
> = {
  storefront: {
    sketches: [
      { id: 'A', title: 'Postcard', body: 'Pretty town. Mountain or lake as the product. Visitors set the main street.', gift: 'Beauty as air.', cost: 'Visitors dominate the street in season.' },
      { id: 'B', title: 'Floor', body: 'You serve the look. Hours bend to season. Locals buy groceries where tourists buy the view.', gift: 'Clear work.', cost: 'Your life waits on other people\'s holidays.' },
      { id: 'C', title: 'Split', body: 'Display case in front. Apartments in back. Which room you slept in is the dose.', gift: 'Two rooms to learn.', cost: 'Living between guest and local identities.' },
    ],
    definite: ['season owns the calendar', 'land is the product', 'money arrives with visitors'],
    probableIfChosen: {
      A: ['protected by the postcard'],
      B: ['crowded out of your own center', 'service hours', 'winter crash'],
      C: ['two-town split in one body'],
    },
    potential: ['getting hard', 'getting small', 'leaving as the only plan'],
  },
  shop_floor: {
    sketches: [
      { id: 'A', title: 'Postcard', body: 'Valley town. Errands, hospital, highway. Ordinary on purpose.', gift: 'A usable life.', cost: 'Easy to disappear into function.' },
      { id: 'B', title: 'Floor', body: 'Work and kin keep you. Winter demands work.', gift: 'Roots can take.', cost: 'Staying can become a sentence.' },
      { id: 'C', title: 'Split', body: 'This town serves the pretty neighbor. Some grow here. Some wait to become the other place.', gift: 'A real floor.', cost: 'Comparison to the storefront.' },
    ],
    definite: ['work calendar', 'winter as duration', 'this town stocks the valley'],
    probableIfChosen: {
      A: ['fit in the ordinary'],
      B: ['stay for function', 'weather as grind'],
      C: ['leaving as a flex or a wound'],
    },
    potential: ['stay indefinitely', 'resent the display town'],
  },
  tourist_port: {
    sketches: [
      { id: 'A', title: 'Postcard', body: 'Light, sea, promenade. The city is meant to be looked at.', gift: 'Beauty as daily air.', cost: 'Your sidewalk is their vacation.' },
      { id: 'B', title: 'Floor', body: 'Work and night follow tourist money.', gift: 'Movement most of the year.', cost: 'Peace only when the guests leave.' },
      { id: 'C', title: 'Split', body: 'Front performs. Inland blocks live. Same name, different dose.', gift: 'Two cities to use.', cost: 'Wrong block pays the front\'s bill.' },
    ],
    definite: ['visitors on the front in season', 'service economy in the center'],
    probableIfChosen: {
      A: ['city as stage'],
      B: ['crowded out of your own downtown'],
      C: ['front vs inland split'],
    },
    potential: ['theft on the strip', 'loving the swarm'],
  },
  commute_suburb: {
    sketches: [
      { id: 'A', title: 'Postcard', body: 'Hills, schools, parks. A quiet name next to a loud region.', gift: 'Enclosure.', cost: 'Thin night street.' },
      { id: 'B', title: 'Floor', body: 'Life timed to the freeway and the train.', gift: 'A held room.', cost: 'Hours sold to the corridor.' },
      { id: 'C', title: 'Split', body: 'Owners from earlier years and renters paying the new price.', gift: 'A yard if you got in.', cost: 'Same street, different stay.' },
    ],
    definite: ['commute as weather', 'housing cost as air'],
    probableIfChosen: {
      A: ['school-and-park enclosure'],
      B: ['tired by the time you get home'],
      C: ['owned vs priced-out split'],
    },
    potential: ['feeling like an outsider in the city you work in'],
  },
  working_city: {
    sketches: [
      { id: 'A', title: 'Postcard', body: 'The face the city sells.', gift: 'A public room.', cost: 'The face can eat the floor.' },
      { id: 'B', title: 'Floor', body: 'Jobs, weather, who owns the street.', gift: 'A usable day.', cost: 'Duty imposed by circumstance.' },
      { id: 'C', title: 'Split', body: 'Pretty blocks and serving blocks share a name.', gift: 'Two soils in one zip.', cost: 'Wrong sketch, wrong dose.' },
    ],
    definite: ['a public street with an owner', 'a season that repeats', 'a way money enters'],
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
