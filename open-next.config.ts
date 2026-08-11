// OpenNext config for the Cloudflare Workers deployment target.
// Default cache behavior (no R2 override) — see wrangler.jsonc for why.
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig();
