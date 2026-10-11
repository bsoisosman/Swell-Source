import { View, Text } from "react-native";

type Props = {
  score: number;
  level: string;
};

export default function RiskScore({ score, level }: Props) {
  return (
    <View className="items-center rounded-3xl bg-white p-6 shadow-sm">
      <Text className="text-sm font-medium uppercase tracking-widest text-gray-500">
        Swell Risk Score
      </Text>

      <Text className="mt-2 text-7xl font-bold text-[#0c1953]">
        {score}
      </Text>

      <Text className="mt-2 text-xl font-semibold text-gray-700">
        {level} Risk
      </Text>

      <Text className="mt-2 text-center text-gray-500">
        Preliminary score based on available water-quality data.
      </Text>
    </View>
  );
}
