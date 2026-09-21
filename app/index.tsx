import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../src/components/ui/Button";

/**
 * Entrance screen.
 *
 * The wordmark sits above centre, not dead centre — optical centre
 * reads as balanced where true centre reads as low. The button sits
 * in the lower third, inside comfortable thumb reach on a large
 * phone, which is not where the Figma frame puts it.
 */
export default function Entrance() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-surface px-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}
    >
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
