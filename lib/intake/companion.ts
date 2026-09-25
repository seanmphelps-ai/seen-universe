export type CompanionRole = 'self' | 'lover' | 'family' | 'friend' | 'running_with';

export type BirthAnchor = {
  name: string;
  birthDate: string;
  birthCity: { name: string; country: string; latitude: number; longitude: number };
};

export type LivedPlace = {
  place: { name: string; country: string; latitude: number; longitude: number };
  startYear: number;
  endYear: number | null;
  yearsLived: number;
};

export type CompanionCard = {
  id: string;
  role: CompanionRole;
  identity: { name: string };
  birth?: BirthAnchor;
  livedPlaces: LivedPlace[];
};

export type CrossingQuery = {
  a: string;
  b: string;
  placeName: string;
  calendarMonth: number;
  calendarDay?: number;
  year?: number;
  clock?: string;
};

export function placeCounts(place: LivedPlace) {
  return place.yearsLived >= 0.5;
}

export function crossingKey(q: CrossingQuery) {
  return [q.a, q.b, q.placeName, q.year ?? '*', q.calendarMonth, q.calendarDay ?? '*', q.clock ?? '*'].join('|');
}
