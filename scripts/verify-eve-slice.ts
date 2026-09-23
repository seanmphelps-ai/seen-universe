/**
 * Verify the Eve first slice: typecheck + vitest for Eve only.
 * Run from repo root: npx tsx scripts/verify-eve-slice.ts
 */

import { execSync } from "node:child_process";

console.log("Eve slice verification starting...");

try {
  console.log("Running typecheck...");
  execSync("npm run typecheck", { stdio: "inherit" });
  console.log("Typecheck passed.");

  console.log("Running Eve vitest...");
  execSync("npx vitest run lib/eve", { stdio: "inherit" });
  console.log("Eve tests passed.");

  console.log("Eve first slice verified.");
} catch (err) {
  console.error("Eve slice verification failed.");
  process.exit(1);
}
