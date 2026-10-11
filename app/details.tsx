import { View, Text, Pressable, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { mockLocations } from "../data/mockLocations";

export default function DetailsScreen() {
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
          Risk Details
        </Text>

        <Text className="mt-1 text-gray-500">
          {location.name}
        </Text>

        {location.contaminants.map((item) => (
          <View
            key={item.name}
            className="mt-4 rounded-2xl bg-white p-5"
          >
            <Text className="text-lg font-bold text-[#0c1953]">
              {item.name}
            </Text>

            <Text className="mt-2 text-gray-600">
              Detected: {item.level} {item.unit}
            </Text>

            <Text className="mt-1 text-gray-600">
              Reference limit: {item.limit} {item.unit}
            </Text>
          </View>
        ))}

        <Text className="mt-8 text-sm leading-6 text-gray-500">
          This information is currently based on placeholder data and
          should not be interpreted as a real health or water-quality
          assessment.
        </Text>
      </View>
    </ScrollView>
  );
}
