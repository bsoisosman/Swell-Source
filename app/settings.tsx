import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-[#f4f7f8] p-6 pt-16">
      <Pressable onPress={() => router.back()}>
        <Text className="font-semibold text-[#0c1953]">← Back</Text>
      </Pressable>

      <Text className="mt-6 text-3xl font-bold text-[#0c1953]">
        Settings
      </Text>

      <View className="mt-6 rounded-2xl bg-white p-5">
        <Text className="text-lg font-bold text-[#0c1953]">
          Swell
        </Text>

        <Text className="mt-2 text-gray-500">
          Water-quality information at your fingertips.
        </Text>
      </View>

      <View className="mt-4 rounded-2xl bg-white p-5">
        <Text className="font-semibold text-[#0c1953]">
          About Swell
        </Text>

        <Text className="mt-2 text-gray-500">
          This is an early MVP. Data sources and risk calculations
          will be connected in a later version.
        </Text>
      </View>
    </View>
  );
}
