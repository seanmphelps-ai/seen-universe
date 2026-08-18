import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Was 'export' (fully static). Removed for the /chart route: real Swiss
  // Ephemeris calculation (swisseph-wasm) works correctly server-side in
  // Node but hits an unresolved bundler bug when run client-side in the
  // browser (its Emscripten glue code resolves its own .wasm/.data files to
  // the build machine's absolute disk path instead of a fetchable URL).
  // Running the calculation from an API route sidesteps that entirely.
  trailingSlash: true,
  images: { unoptimized: true },
  // swisseph-wasm's dynamic `await import("node:module")` doesn't interop
  // cleanly with webpack's server bundling (createRequire ends up undefined).
  // Marking it external makes Next.js require() it directly via Node at
  // runtime instead of bundling it — matches how it runs correctly outside
  // Next.js entirely.
  // all-the-cities reads its cities.pbf data file via a path.join(__dirname, ...)
  // at require time, same class of problem as swisseph-wasm above — bundling
  // moves the compiled output away from that data file. External keeps it a
  // plain Node require, resolved from its real location in node_modules.
  serverExternalPackages: ['swisseph-wasm', 'all-the-cities'],
}

export default nextConfig
