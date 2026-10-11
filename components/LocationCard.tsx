import { View, Text, Pressable } from "react-native";
import type { LocationData } from "../data/mockLocations";

type Props = {
  location: LocationData;
  onPress: () => void;
};

export default function LocationCard({ location, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl bg-white p-4 shadow-sm"
    >
      <Text className="text-lg font-bold text-[#0c1953]">
        {location.name}
      </Text>

      <Text className="mt-1 text-gray-500">{location.address}</Text>

      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-sm text-gray-500">Risk Score</Text>

        <Text className="text-xl font-bold text-[#0c1953]">
          {location.riskScore}
        </Text>
      </View>
    </Pressable>
  );
}
