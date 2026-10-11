import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { mockLocations } from "../data/mockLocations";

export default function MapScreen() {
  return (
    <View className="flex-1 bg-[#dcebed]">
      <View className="absolute left-5 right-5 top-16 z-10">
        <Pressable
          onPress={() => router.back()}
          className="mb-4 w-24 rounded-xl bg-white p-3"
        >
          <Text className="text-center font-semibold text-[#0c1953]">
            Back
          </Text>
        </Pressable>

        <View className="rounded-2xl bg-white p-4">
          <Text className="text-lg font-bold text-[#0c1953]">
            Search the map
          </Text>
          <Text className="mt-1 text-gray-500">
            Select a location to view its Swell score.
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center justify-center">
        <Text className="text-5xl">🗺️</Text>
        <Text className="mt-3 text-xl font-bold text-[#0c1953]">
          California
        </Text>
        <Text className="mt-1 text-gray-600">
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
            className="mb-2 rounded-2xl bg-white p-4"
          >
            <Text className="font-bold text-[#0c1953]">
              {location.name}
            </Text>
            <Text className="text-gray-500">
              Risk Score: {location.riskScore}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
