import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { Region } from "react-native-maps";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchMapSources } from "../src/lib/mapSources";
import type { MapSource } from "../src/lib/mapSources";
import { useTheme } from "../src/theme/useTheme";

// Orange County. Where the data is densest and the demo starts.
const START: Region = {
  latitude: 33.7, longitude: -117.83,
  latitudeDelta: 1.2, longitudeDelta: 1.2,
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const mapRef = useRef<MapView>(null);

  const [sources, setSources] = useState<MapSource[]>([]);
  const [selected, setSelected] = useState<MapSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Markers must stop re-rasterising once painted, or the map
  // stutters badly. See the note in the Marker below.
  const [tracking, setTracking] = useState(true);

  const load = useCallback(async () => {
    try {
      setSources(await fetchMapSources());
      setTracking(true);
      setTimeout(() => setTracking(false), 800);
    } catch {
      setError("Couldn't load water systems");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <View className="flex-1 bg-surface">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={START}
        userInterfaceStyle={isDark ? "dark" : "light"}
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        {sources.map((s) => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.latitude, longitude: s.longitude }}
            onPress={() => setSelected(s)}
            // Must go false after first paint: left true, React
            // Native re-rasterises every custom marker every frame.
            tracksViewChanges={tracking}
            accessibilityLabel={s.name}
          >
            <View
              className="w-8 h-8 rounded-full items-center justify-center border-2"
              style={{ backgroundColor: colors.accent, borderColor: colors.surface }}
            >
              <Text className="text-caption font-bold" style={{ color: colors["content-on-accent"] }}>
                {s.risk_score ?? "?"}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <View
        className="absolute left-5 right-5 flex-row items-center"
        style={{ top: insets.top + 8 }}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={() => router.back()}
          className="rounded-control bg-surface-raised px-4 py-3"
          accessibilityRole="button"
        >
          <Text className="font-semibold text-content-on-raised">← Back</Text>
        </Pressable>

        {loading ? (
          <View className="ml-3 rounded-control bg-surface-raised px-4 py-3">
            <ActivityIndicator size="small" color={colors["content-on-raised"]} />
          </View>
        ) : (
          <View className="ml-3 rounded-control bg-surface-raised px-4 py-3">
            <Text className="text-caption text-content-on-raised">
              {sources.length} systems
            </Text>
          </View>
        )}
      </View>

      {error ? (
        <View className="absolute left-5 right-5 rounded-card bg-surface-raised p-4"
              style={{ top: insets.top + 70 }}>
          <Text className="text-caption text-danger">{error}</Text>
        </View>
      ) : null}

      {selected ? (
        <Pressable
          onPress={() => router.push({ pathname: "/location", params: { id: selected.id } })}
          className="absolute left-5 right-5 rounded-card bg-surface-raised p-5"
          style={{ bottom: insets.bottom + 20 }}
        >
          <Text className="text-body font-bold text-content-on-raised" numberOfLines={2}>
            {selected.name}
          </Text>
          <Text className="mt-1 text-caption text-content-on-raised-muted">
            {selected.county ? `${selected.county} County` : "California"}
            {selected.population ? ` · ${selected.population.toLocaleString()} served` : ""}
          </Text>
          <Text className="mt-3 text-caption text-content-on-raised-muted">
            {selected.risk_score != null
              ? `Risk ${selected.risk_score}/100 — higher means more risk`
              : "Not yet scored"}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
