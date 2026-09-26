export type CocoonKind = 'person' | 'place' | 'calendar' | 'clock' | 'key';

export type Cocoon = {
  id: string;
  kind: CocoonKind;
  label: string;
};

export type Join = {
  a: Cocoon;
  b: Cocoon;
  place?: Cocoon;
  calendar?: { year?: number; month: number; day?: number };
  clock?: string;
};

export function droppedTogether(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y) < 0.08;
}

export function joinKey(join: Join) {
  return [join.a.id, join.b.id, join.place?.id ?? '', join.calendar?.month ?? '', join.clock ?? ''].join('|');
}
