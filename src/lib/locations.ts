import { supabase } from "./supabase";

/**
 * Same shape as data/mockLocations, so the existing screens keep
 * working — only the import changes, plus async loading state.
 */
export type LocationData = {
  id: string;
  name: string;
  address: string;
  riskScore: number | null;
  riskLevel: "Low" | "Moderate" | "High" | null;
  summary: string | null;
  lastUpdated: string | null;
  contaminants: {
    name: string;
    level: number;
    limit: number | null;
    unit: string;
    authority: string | null;
    healthEffect: string | null;
  }[];
  sources: string[];
};

const BAND_LABEL = { low: "Low", moderate: "Moderate", high: "High" } as const;

type Row = {
  id: string;
  name: string;
  county: string | null;
  agency: string;
  external_id: string;
  population: number | null;
  risk_scores: { score: number; band: keyof typeof BAND_LABEL; computed_at: string }[] | null;
  ai_overviews: { body: string; generated_at: string }[] | null;
};

const SELECT =
  "id,name,county,agency,external_id,population," +
  "risk_scores(score,band,computed_at)," +
  "ai_overviews(body,generated_at)";

/** Supabase returns embedded rows as arrays. Flatten here once so no
 *  screen has to know that. */
function toLocation(
  r: Row,
  contaminants: LocationData["contaminants"] = [],
): LocationData {
  const risk = r.risk_scores?.[0] ?? null;
  const overview = r.ai_overviews?.[0] ?? null;
  return {
    id: r.id,
    name: r.name,
    address: r.county ? `${r.county} County, California` : "California",
    riskScore: risk?.score ?? null,
    riskLevel: risk ? BAND_LABEL[risk.band] : null,
    summary: overview?.body ?? null,
    lastUpdated: risk?.computed_at ?? overview?.generated_at ?? null,
    contaminants,
    sources: [r.agency],
  };
}

export async function fetchLocations(query = ""): Promise<LocationData[]> {
  let q = supabase
    .from("water_sources")
    .select(SELECT)
    .order("population", { ascending: false, nullsFirst: false })
    .limit(40);

  const term = query.trim();
  if (term) q = q.or(`name.ilike.%${term}%,county.ilike.%${term}%`);

  const { data, error } = await q;
  if (error) throw error;
  return ((data ?? []) as unknown as Row[]).map((r) => toLocation(r));
}

export async function fetchLocation(id: string): Promise<LocationData> {
  const { data, error } = await supabase
    .from("water_sources")
    .select(SELECT)
    .eq("id", id)
    .single();
  if (error) throw error;

  // Most recent reading per analyte, joined to its regulatory limit.
  // A level with no limit beside it means nothing on screen.
  const { data: m } = await supabase
    .from("measurements")
    .select(
      "analyte,value,unit,sampled_at," +
      "analyte_limits(display_name,mcl,unit,authority,health_effect)",
    )
    .eq("source_id", id)
    .order("sampled_at", { ascending: false })
    .limit(60);

  const seen = new Set<string>();
  const contaminants: LocationData["contaminants"] = [];
  for (const row of (m ?? []) as any[]) {
    if (seen.has(row.analyte)) continue;
    seen.add(row.analyte);
    const lim = Array.isArray(row.analyte_limits)
      ? row.analyte_limits[0]
      : row.analyte_limits;
    contaminants.push({
      name: lim?.display_name ?? row.analyte,
      level: Number(row.value),
      limit: lim ? Number(lim.mcl) : null,
      unit: row.unit ?? lim?.unit ?? "",
      authority: lim?.authority ?? null,
      healthEffect: lim?.health_effect ?? null,
    });
  }

  return toLocation(data as unknown as Row, contaminants);
}
