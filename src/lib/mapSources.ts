import { supabase } from "./supabase";

export type MapSource = {
  id: string;
  name: string;
  county: string | null;
  population: number | null;
  latitude: number;
  longitude: number;
  risk_score: number | null;
};

/** Coordinates come from the RPC: PostGIS geography columns don't
 *  come back usefully through the REST API. */
export async function fetchMapSources(): Promise<MapSource[]> {
  const { data, error } = await supabase.rpc("map_sources");
  if (error) throw error;
  return (data ?? []) as MapSource[];
}
