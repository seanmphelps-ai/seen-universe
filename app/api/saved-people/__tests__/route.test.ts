import { beforeEach, describe, expect, it, vi } from 'vitest';

// One in-memory stand-in for the SEEN Postgres schema. It mirrors the two
// constraints the production tables rely on: the (owner_id, name, birth_date)
// unique key on people, the one-chart-per-person key on western_charts, and
// row-level security scoping every read to the signed-in owner.
type Row = Record<string, unknown>;

let people: Row[] = [];
let charts: Row[] = [];
let currentUser: { id: string } | null = null;
let nextId = 1;

function uid() {
  return `id-${nextId++}`;
}

function makeClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: currentUser } }),
    },
    from(table: string) {
      const rows = table === 'people' ? people : charts;

      return {
        upsert(values: Row, options: { onConflict: string }) {
          const keys = options.onConflict.split(',');
          const existing = rows.find((row) => keys.every((key) => row[key] === values[key]));
          const saved = existing
            ? Object.assign(existing, values)
            : (rows.push({ id: uid(), ...values }), rows[rows.length - 1]);

          return {
            select: () => ({
              single: async () => ({ data: { id: saved.id }, error: null }),
            }),
          };
        },
        select(_columns: string) {
          const filters: Row = {};
          const builder = {
            eq(column: string, value: unknown) {
              filters[column] = value;
              return builder;
            },
            order: async () => {
              const matched = rows.filter((row) =>
                Object.entries(filters).every(([key, value]) => row[key] === value));
              return {
                data: matched.map((row) => ({
                  ...row,
                  // person_id is unique on western_charts, so PostgREST
                  // embeds one object or null here, never an array.
                  western_charts: (() => {
                    const chart = charts.find((row_chart) => row_chart.person_id === row.id);
                    return chart ? { id: chart.id } : null;
                  })(),
                })),
                error: null,
              };
            },
          };
          return builder;
        },
      };
    },
  };
}

vi.mock('../../../../lib/supabase/server', () => ({
  createClient: async () => makeClient(),
}));

const { GET, POST } = await import('../route');

const BREE = {
  name: 'Bree',
  birthDate: '1993-06-13',
  birthTime: '08:22',
  birthLocation: 'Los Angeles, United States',
  latitude: 34.0522,
  longitude: -118.2437,
  westernChart: { name: 'Bree', planets: [{ key: 'sun' }] },
};

const PERSISTENCE = {
  name: 'Persistence Test Person',
  birthDate: '1988-04-22',
  birthTime: '14:35',
  birthLocation: 'Chicago, United States',
  latitude: 41.8781,
  longitude: -87.6298,
  westernChart: { name: 'Persistence Test Person', planets: [{ key: 'moon' }] },
};

function post(body: unknown) {
  return POST(new Request('http://localhost/api/saved-people', {
    method: 'POST',
    body: JSON.stringify(body),
  }));
}

beforeEach(() => {
  people = [];
  charts = [];
  nextId = 1;
  currentUser = { id: 'user-a' };
});

describe('saving people and their Western charts', () => {
  it('rejects a save from a visitor who is not signed in', async () => {
    currentUser = null;
    const response = await post(BREE);

    expect(response.status).toBe(401);
    expect(people).toHaveLength(0);
  });

  it('creates a person for the signed-in account', async () => {
    const response = await post(BREE);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ saved: true });
    expect(people).toHaveLength(1);
    expect(people[0]).toMatchObject({
      owner_id: 'user-a',
      name: 'Bree',
      birth_date: '1993-06-13',
      birth_time: '08:22',
      birth_location: 'Los Angeles, United States',
    });
  });

  it('accepts a birth time, which the release before this one rejected', async () => {
    const response = await post(BREE);

    expect(response.status).not.toBe(400);
    expect(people[0].birth_time).toBe('08:22');
  });

  it('holds several people under one account', async () => {
    await post(BREE);
    await post(PERSISTENCE);

    expect(people).toHaveLength(2);
    expect(people.every((person) => person.owner_id === 'user-a')).toBe(true);
  });

  it('attaches the saved chart to the person it belongs to', async () => {
    const first = await (await post(BREE)).json();
    const second = await (await post(PERSISTENCE)).json();

    expect(first.personId).not.toBe(second.personId);
    const breeChart = charts.find((chart) => chart.person_id === first.personId);
    expect(breeChart?.chart).toMatchObject({ name: 'Bree' });
    expect(breeChart?.id).toBe(first.chartId);
  });

  it('updates the same records when the same person is calculated again', async () => {
    const original = await (await post(BREE)).json();
    const recalculated = await (await post({
      ...BREE,
      westernChart: { name: 'Bree', planets: [{ key: 'sun' }, { key: 'moon' }] },
    })).json();

    expect(recalculated.personId).toBe(original.personId);
    expect(recalculated.chartId).toBe(original.chartId);
    expect(people).toHaveLength(1);
    expect(charts).toHaveLength(1);
  });
});

describe('reading back saved people', () => {
  it('returns the stored people and their chart for the owner', async () => {
    await post(BREE);
    await post(PERSISTENCE);

    const body = await (await GET()).json();

    expect(body.people).toHaveLength(2);
    expect(body.people[0].name).toBe('Bree');
    expect(body.people[0].western_charts).toMatchObject({ id: expect.any(String) });
  });

  it('keeps one account out of another account records', async () => {
    await post(BREE);

    currentUser = { id: 'user-b' };
    const body = await (await GET()).json();

    expect(body.people).toHaveLength(0);
  });

  it('refuses to list anything for a visitor who is not signed in', async () => {
    currentUser = null;
    const response = await GET();

    expect(response.status).toBe(401);
  });
});
