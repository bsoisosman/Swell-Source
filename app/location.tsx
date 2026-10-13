import { View, Text, Pressable, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import RiskScore from "../components/RiskScore";
import { mockLocations } from "../data/mockLocations";

export default function LocationScreen() {
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
          {location.name}
        </Text>

        <Text className="mt-1 text-content-muted">
          {location.address}
        </Text>

        <View className="mt-6">
          <RiskScore
            score={location.riskScore}
            level={location.riskLevel}
          />
        </View>

        <Text className="mt-8 text-heading font-bold text-content">
          Overview
        </Text>

        <Text className="mt-2 leading-6 text-content-muted">
          {location.summary}
        </Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/details",
              params: { id: location.id },
            })
          }
          className="mt-6 rounded-control bg-accent p-4"
        >
          <Text className="text-center font-semibold text-content-on-accent">
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
          className="mt-3 rounded-card bg-surface-raised p-4"
        >
          <Text className="text-center font-semibold text-content-on-raised">
            View Sources
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
