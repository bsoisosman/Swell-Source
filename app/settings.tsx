import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../src/auth/AuthProvider";
import { Button } from "../src/components/ui/Button";

export default function SettingsScreen() {
  const { session, isGuest, signOut } = useAuth();

  return (
    <View className="flex-1 bg-surface p-6 pt-16">
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Text className="font-semibold text-content">← Back</Text>
      </Pressable>

      <Text className="mt-6 text-heading font-bold text-content">
        Settings
      </Text>

      <View className="mt-6 rounded-card bg-surface-raised p-5">
        <Text className="text-body font-bold text-content-on-raised">
          Account
        </Text>
        <Text className="mt-2 text-content-on-raised-muted">
          {isGuest
            ? "You're browsing as a guest. Add an email to keep your ratings if you change phones."
            : session?.user.email ?? "Not signed in"}
        </Text>

        <View className="mt-4">
          {session ? (
            // Signing out clears the stored session, so the guard
            // sends you back to the entrance screen.
            <Button label="Sign out" variant="secondary" onPress={signOut} />
          ) : (
            <Button
              label="Sign in"
              variant="primary"
              onPress={() => router.push("/sign-in")}
            />
          )}
        </View>
      </View>

      <View className="mt-4 rounded-card bg-surface-raised p-5">
        <Text className="font-semibold text-content-on-raised">
          About Swell
        </Text>
        <Text className="mt-2 text-content-on-raised-muted">
          This is an early MVP. Data sources and risk calculations
          will be connected in a later version.
        </Text>
      </View>
    </View>
  );
}
