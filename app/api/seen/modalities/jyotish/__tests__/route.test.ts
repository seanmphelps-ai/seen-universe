import { beforeEach, describe, expect, it, vi } from 'vitest';

let signedIn = true;

vi.mock('../../../../../../lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: signedIn ? { id: 'user-a' } : null } }) },
  }),
}));

const { POST } = await import('../route');

beforeEach(() => {
  signedIn = true;
});

describe('Jyotish delivery gate', () => {
  it('blocks delivery while the server source packet and independent audit are missing', async () => {
    const response = await POST();

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.auditStatus).toBe('blocked');
    expect(body).not.toHaveProperty('readings');
  });

  it('requires a signed-in user', async () => {
    signedIn = false;

    const response = await POST();

    expect(response.status).toBe(401);
  });
});
