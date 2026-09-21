import { useRef, useState } from "react";
import type { ComponentRef } from "react";
import {
  View, Text, Pressable, KeyboardAvoidingView, Platform,
  ScrollView, TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Input } from "../src/components/ui/Input";
import { Button } from "../src/components/ui/Button";
import { supabase } from "../src/lib/supabase";

export default function SignIn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Enter your email address";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      next.email = "That doesn't look like an email address";
    if (!password) next.password = "Enter your password";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    if (busy || !validate()) return;
    setBusy(true);
    setErrors({});

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setBusy(false);
    if (error) {
      // Deliberately vague. Saying "no account with that email"
      // lets anyone test which addresses are registered.
      setErrors({
        form: error.message.toLowerCase().includes("email not confirmed")
          ? "Check your email to confirm your address first"
          : "Email or password is incorrect",
      });
      return;
    }
    // No navigation here. The auth listener updates the session and
    // the guard in _layout moves us. One place decides routing.
  }

  async function continueAsGuest() {
    if (busy) return;
    setBusy(true);
    const { error } = await supabase.auth.signInAnonymously();
    setBusy(false);
    if (error) {
      setErrors({ form: "Couldn't continue as guest. Try again." });
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      // iOS shrinks the view with padding; Android's windowSoftInput
      // already resizes, so adding behaviour there double-counts.
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1, justifyContent: "center",
          paddingHorizontal: 24,
          paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="w-full max-w-[380px] self-center">
          <View className="w-[110px] h-[110px] rounded-full bg-surface-raised self-center mb-8 items-center justify-center">
            <Text className="text-display text-accent font-bold">S</Text>
          </View>

          <Text className="text-heading text-content font-bold mb-5" accessibilityRole="header">
            Sign In
          </Text>

          {errors.form ? (
            <View className="rounded-control border border-danger px-3 py-2 mb-4">
              <Text className="text-caption text-danger" accessibilityLiveRegion="assertive">
                {errors.form}
              </Text>
            </View>
          ) : null}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            submitBehavior="submit"
          />

          <Input
            ref={passwordRef}
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            placeholder="Your password"
            secure
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={submit}
          />

          <Button
            label="Sign in"
            variant="primary"
            loading={busy}
            onPress={submit}
          />

          <View className="flex-row justify-between mt-4">
            <Pressable onPress={() => router.push("/reset-password")} hitSlop={10}>
              <Text className="text-caption text-content-muted">Forgot password?</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/sign-up")} hitSlop={10}>
              <Text className="text-caption text-content-muted font-semibold">
                Sign up
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center my-7">
            <View className="flex-1 h-[1px] bg-border opacity-40" />
            <Text className="text-caption text-content-muted mx-3">or</Text>
            <View className="flex-1 h-[1px] bg-border opacity-40" />
          </View>

          <Button
            label="Continue as guest"
            variant="secondary"
            disabled={busy}
            onPress={continueAsGuest}
          />

          <Text className="text-caption text-content-muted text-center mt-3 opacity-80">
            You can add an email later to keep your data.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
