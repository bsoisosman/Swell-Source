/**
 * Fetches a centroid for each water system already in the database
 * and prints SQL you paste into the Supabase SQL Editor.
 *
 * Centroids, not polygons: a marker needs one point, and 50 points
 * is SQL you can paste. Full boundaries are a separate job, needed
 * for "which system serves this address" rather than for the map.
 *
 * Run:  node scripts/fetch-centroids.mjs > centroids.sql
 */
const LAYER =
  "https://socogis.sonomacounty.ca.gov/map/rest/services/OWTSPublic/" +
  "California_Drinking_Water_System_Area_Boundaries/MapServer/0/query";

const SUPA = process.env.EXPO_PUBLIC_SUPABASE_URL;
const KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!SUPA || !KEY) {
  console.error("Missing env vars. Run: set -a && source .env.local && set +a");
  process.exit(1);
}

// Which systems do we already have? Read-only, so the public key is fine.
const res = await fetch(
  `${SUPA}/rest/v1/water_sources?select=external_id&type=eq.tap`,
  { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
);
const rows = await res.json();
const ids = rows.map((r) => r.external_id).filter(Boolean);
console.error(`${ids.length} systems in database`);
if (!ids.length) process.exit(1);

// ArcGIS has a URL length limit, so query in batches.
const BATCH = 25;
const out = [];
for (let i = 0; i < ids.length; i += BATCH) {
  const chunk = ids.slice(i, i + BATCH);
  const where = `SABL_PWSID IN (${chunk.map((x) => `'${x}'`).join(",")})`;
  const url =
    `${LAYER}?where=${encodeURIComponent(where)}` +
    `&outFields=SABL_PWSID&returnGeometry=true` +
    // Simplify hard: 0.01 degrees is ~1km, far finer than a marker
    // needs, and it keeps the payload small.
    `&maxAllowableOffset=0.01&outSR=4326&f=json`;

  const r = await fetch(url);
  const j = await r.json();
  if (j.error) {
    console.error("ArcGIS error:", JSON.stringify(j.error).slice(0, 300));
    process.exit(1);
  }
  for (const f of j.features ?? []) {
    const pwsid = f.attributes?.SABL_PWSID;
    const rings = f.geometry?.rings;
    if (!pwsid || !rings?.length) continue;
    // Bounding-box centre of all rings. Not a true centroid, but a
    // marker only needs a sensible point inside the service area.
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const ring of rings) {
      for (const [x, y] of ring) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (Number.isFinite(minX)) out.push([pwsid, (minX + maxX) / 2, (minY + maxY) / 2]);
  }
  console.error(`  batch ${i / BATCH + 1}: ${j.features?.length ?? 0} features`);
}

console.error(`${out.length} centroids found`);

// One statement, re-runnable.
console.log("update public.water_sources s set geom = v.pt::geography");
console.log("from (values");
console.log(
  out
    .map(([id, x, y]) => `  ('${id}', st_setsrid(st_makepoint(${x.toFixed(6)}, ${y.toFixed(6)}), 4326))`)
    .join(",\n"),
);
console.log(") as v(pwsid, pt)");
console.log("where s.external_id = v.pwsid and s.agency = 'CA SWRCB DDW';");
console.log("");
console.log("select count(*) as with_geometry from public.water_sources where geom is not null;");
