import { View, Text, Pressable, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { mockLocations } from "../data/mockLocations";

export default function SourcesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const location =
    mockLocations.find((item) => item.id === id) ?? mockLocations[0];

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="p-6 pt-16">
        <Pressable onPress={() => router.back()}>
          <Text className="font-semibold text-content">← Back</Text>
        </Pressable>

        <Text className="mt-6 text-heading font-bold text-content">
          Sources
        </Text>

        <Text className="mt-2 text-content-muted">
          Data associated with {location.name}
        </Text>

        {location.sources.map((source) => (
          <View
            key={source}
            className="mt-4 rounded-card bg-surface-raised p-5"
          >
            <Text className="font-semibold text-content-on-raised">
              {source}
            </Text>
          </View>
        ))}

        <Text className="mt-8 text-caption text-content-muted">
          Live sources will be connected after the MVP interface is
          complete.
        </Text>
      </View>
    </ScrollView>
  );
}
