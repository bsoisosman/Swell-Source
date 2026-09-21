import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/auth/AuthProvider";
import { Button } from "../src/components/ui/Button";

export default function Home() {
  const { session, isGuest, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-surface px-6 justify-center"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}
    >
      <Text className="text-display text-content font-bold text-center">Swell</Text>

      <Text className="text-body text-content-muted text-center mt-3 mb-8">
        {isGuest
          ? "You're browsing as a guest."
          : `Signed in as ${session?.user.email}`}
      </Text>

      {isGuest ? (
        <Text className="text-caption text-content-muted text-center mb-6">
          Add an email to keep your data if you change phones.
        </Text>
      ) : null}

      <Button label="Sign out" variant="secondary" onPress={signOut} />
    </View>
  );
}
