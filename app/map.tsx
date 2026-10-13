import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { mockLocations } from "../data/mockLocations";

export default function MapScreen() {
  return (
    <View className="flex-1 bg-surface">
      <View className="absolute left-5 right-5 top-16 z-10">
        <Pressable
          onPress={() => router.back()}
          className="mb-4 w-24 rounded-control bg-surface-raised p-3"
        >
          <Text className="text-center font-semibold text-content-on-raised">
            Back
          </Text>
        </Pressable>

        <View className="rounded-card bg-surface-raised p-4">
          <Text className="text-body font-bold text-content-on-raised">
            Search the map
          </Text>
          <Text className="mt-1 text-content-on-raised-muted">
            Select a location to view its Swell score.
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center justify-center">
        <Text className="text-5xl">🗺️</Text>
        <Text className="mt-3 text-heading font-bold text-content">
          California
        </Text>
        <Text className="mt-1 text-content-muted">
          Interactive map coming next
        </Text>
      </View>

      <View className="absolute bottom-8 left-5 right-5">
        {mockLocations.map((location) => (
          <Pressable
            key={location.id}
            onPress={() =>
              router.push({
                pathname: "/location",
                params: { id: location.id },
              })
            }
            className="mb-2 rounded-card bg-surface-raised p-4"
          >
            <Text className="font-bold text-content-on-raised">
              {location.name}
            </Text>
            <Text className="text-content-on-raised-muted">
              Risk Score: {location.riskScore}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
