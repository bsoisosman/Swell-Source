import { View, Text, Pressable, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import RiskScore from "../components/RiskScore";
import { mockLocations } from "../data/mockLocations";

export default function LocationScreen() {
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
          {location.name}
        </Text>

        <Text className="mt-1 text-gray-500">
          {location.address}
        </Text>

        <View className="mt-6">
          <RiskScore
            score={location.riskScore}
            level={location.riskLevel}
          />
        </View>

        <Text className="mt-8 text-xl font-bold text-[#0c1953]">
          Overview
        </Text>

        <Text className="mt-2 leading-6 text-gray-600">
          {location.summary}
        </Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/details",
              params: { id: location.id },
            })
          }
          className="mt-6 rounded-2xl bg-[#0c1953] p-4"
        >
          <Text className="text-center font-semibold text-white">
            View Risk Details
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/sources",
              params: { id: location.id },
            })
          }
          className="mt-3 rounded-2xl bg-white p-4"
        >
          <Text className="text-center font-semibold text-[#0c1953]">
            View Sources
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
