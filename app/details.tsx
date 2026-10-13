import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchLocation } from "../src/lib/locations";
import type { LocationData } from "../src/lib/locations";
import { useTheme } from "../src/theme/useTheme";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      try {
        const data = await fetchLocation(id);
        if (active) setLocation(data);
      } catch {
        if (active) setError("Couldn't load this water system");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator color={colors.content} />
      </View>
    );
  }

  if (error || !location) {
    return (
      <View className="flex-1 bg-surface items-center justify-center px-6">
        <Text className="text-body text-content-muted text-center">
          {error ?? "Not found"}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12} className="mt-4">
          <Text className="text-caption text-content font-semibold">← Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 32,
      }}
    >
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Text className="text-caption text-content-muted">← Back</Text>
      </Pressable>

      <Text className="mt-6 text-heading font-bold text-content" accessibilityRole="header">
        Risk details
      </Text>
      <Text className="mt-1 text-body text-content-muted">{location.name}</Text>
      <Text className="mt-1 text-caption text-content-muted">{location.address}</Text>

      {location.contaminants.length === 0 ? (
        <View className="mt-6 rounded-card bg-surface-raised p-5">
          <Text className="text-body text-content-on-raised font-semibold">
            No test results yet
          </Text>
          <Text className="mt-2 text-caption text-content-on-raised-muted">
            We haven't loaded measurements for this system. That means we
            don't know, not that the water is fine.
          </Text>
        </View>
      ) : (
        location.contaminants.map((item) => {
          // Only meaningful when a limit exists. Never imply "safe"
          // from a missing threshold.
          const over = item.limit != null && item.level > item.limit;
          return (
            <View key={item.name} className="mt-4 rounded-card bg-surface-raised p-5">
              <View className="flex-row items-start justify-between">
                <Text className="flex-1 text-body font-bold text-content-on-raised">
                  {item.name}
                </Text>
                {item.limit != null ? (
                  <Text
                    className="text-caption font-semibold ml-3"
                    style={{ color: over ? colors.danger : colors.success }}
                  >
                    {over ? "Over limit" : "Within limit"}
                  </Text>
                ) : null}
              </View>

              <Text className="mt-2 text-body text-content-on-raised">
                {item.level} {item.unit}
                {item.limit != null ? (
                  <Text className="text-caption text-content-on-raised-muted">
                    {"  against a limit of "}{item.limit} {item.unit}
                    {item.authority ? ` (${item.authority})` : ""}
                  </Text>
                ) : null}
              </Text>

              {item.healthEffect ? (
                <Text className="mt-2 text-caption text-content-on-raised-muted">
                  {item.healthEffect}
                </Text>
              ) : null}
            </View>
          );
        })
      )}

      <Text className="mt-8 text-caption text-content-muted opacity-80">
        {location.sources.length
          ? `Measurements from ${location.sources.join(", ")}. `
          : ""}
        Figures are the most recent reading on record for each substance and
        may not reflect current conditions.
      </Text>
    </ScrollView>
  );
}
