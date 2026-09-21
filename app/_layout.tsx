import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../src/auth/AuthProvider";
import { useTheme } from "../src/theme/useTheme";
import "../global.css";

/** Routes reachable while signed out. Everything else is guarded. */
const PUBLIC_ROUTES = ["index", "sign-in", "sign-up", "reset-password"];

function Guard() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    // Wait for the stored session to load, or a signed-in user gets
    // bounced to the entrance screen on every cold start.
    if (loading) return;

    const current = segments[0] ?? "index";
    const onPublic = PUBLIC_ROUTES.includes(current);

    if (session && onPublic) router.replace("/home");
    else if (!session && !onPublic) router.replace("/");
  }, [session, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator color={colors.content} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
        animation: "fade",
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        {/* Always light: both surfaces are dark. */}
        <StatusBar style="light" />
        <Guard />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
