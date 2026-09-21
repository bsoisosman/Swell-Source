import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../src/components/ui/Button";

export default function TokenCheck() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{
        padding: 24,
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <Text className="text-display text-content font-bold">Token check</Text>
      <Text className="text-body text-content-muted mt-2">
        Compare against Figma. Then check it again in dark mode.
      </Text>
      <View className="mt-8 gap-3">
        <Button label="Save changes" variant="primary" />
        <Button label="Cancel" variant="secondary" />
        <Button label="Learn more" variant="ghost" size="sm" />
        <Button label="Saving" loading />
      </View>
      <View className="mt-8 rounded-card border border-border bg-surface-raised p-6">
        <Text className="text-heading text-content font-semibold">Surface</Text>
        <Text className="text-body text-content-muted mt-2">
          Check radius, border, and background against the design.
        </Text>
      </View>
    </ScrollView>
  );
}
