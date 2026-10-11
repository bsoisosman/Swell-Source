import { View, Text, Pressable, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { mockLocations } from "../data/mockLocations";

export default function SourcesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const location =
    mockLocations.find((item) => item.id === id) ?? mockLocations[0];

  return (
    <ScrollView className="flex-1 bg-[#f4f7f8]">
      <View className="p-6 pt-16">
        <Pressable onPress={() => router.back()}>
          <Text className="font-semibold text-[#0c1953]">← Back</Text>
        </Pressable>

        <Text className="mt-6 text-3xl font-bold text-[#0c1953]">
          Sources
        </Text>

        <Text className="mt-2 text-gray-500">
          Data associated with {location.name}
        </Text>

        {location.sources.map((source) => (
          <View
            key={source}
            className="mt-4 rounded-2xl bg-white p-5"
          >
            <Text className="font-semibold text-[#0c1953]">
              {source}
            </Text>
          </View>
        ))}

        <Text className="mt-8 text-sm text-gray-500">
          Live sources will be connected after the MVP interface is
          complete.
        </Text>
      </View>
    </ScrollView>
  );
}
