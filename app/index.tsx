import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../src/components/ui/Button";

export default function Entrance() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-surface px-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}
    >
      {/* Larger spacer above than below puts the wordmark at optical
          centre, which reads as balanced where true centre reads low. */}
      <View className="flex-[3]" />

      <Text
        className="text-display text-content text-center font-bold"
        accessibilityRole="header"
        maxFontSizeMultiplier={1.3}
      >
        Swell
      </Text>

      <View className="flex-[2]" />

      <View className="w-full max-w-[340px] self-center">
        <Button
          label="Let's get started"
          variant="primary"
          onPress={() => router.push("/sign-in")}
        />
      </View>
    </View>
  );
}
