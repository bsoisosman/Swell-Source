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

type Ref_ = ComponentRef<typeof TextInput>;
type Errors = Partial<Record<
  "first" | "last" | "email" | "password" | "confirm" | "form", string
>>;

export default function SignUp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const lastRef = useRef<Ref_>(null);
  const emailRef = useRef<Ref_>(null);
  const passwordRef = useRef<Ref_>(null);
  const confirmRef = useRef<Ref_>(null);

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  function validate() {
    const e: Errors = {};
    if (!first.trim()) e.first = "Enter your first name";
    if (!last.trim()) e.last = "Enter your last name";
    if (!email.trim()) e.email = "Enter your email address";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      e.email = "That doesn't look like an email address";
    if (!password) e.password = "Choose a password";
    else if (password.length < 8) e.password = "Use at least 8 characters";
    if (confirm !== password) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (busy || !validate()) return;
    setBusy(true);
    setErrors({});

    // first_name / last_name go into user metadata, which the
    // database trigger copies into public.profiles on insert.
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { first_name: first.trim(), last_name: last.trim() } },
    });

    setBusy(false);

    if (error) {
      setErrors({
        form: error.message.toLowerCase().includes("already")
          ? "An account with that email already exists"
          : error.message,
      });
      return;
    }

    // With email confirmation on, signUp returns a user but no
    // session. Nothing has gone wrong — they just aren't signed in
    // yet, and without this they'd stare at an unchanged screen.
    if (data.user && !data.session) {
      setErrors({ form: "Check your email to confirm your address." });
    }
    // Otherwise the auth listener fires and the guard routes us.
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1, justifyContent: "center", paddingHorizontal: 24,
          paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="w-full max-w-[380px] self-center">
          <Pressable onPress={() => router.back()} hitSlop={12} className="mb-6">
            <Text className="text-caption text-content-muted">← Back</Text>
          </Pressable>

          <Text className="text-heading text-content font-bold mb-5" accessibilityRole="header">
            Create account
          </Text>

          {errors.form ? (
            <View className="rounded-control border border-border px-3 py-2 mb-4">
              <Text className="text-caption text-content" accessibilityLiveRegion="assertive">
                {errors.form}
              </Text>
            </View>
          ) : null}

          <Input
            label="First name" value={first} onChangeText={setFirst}
            error={errors.first} autoComplete="given-name"
            textContentType="givenName" autoCapitalize="words"
            returnKeyType="next" submitBehavior="submit"
            onSubmitEditing={() => lastRef.current?.focus()}
          />
          <Input
            ref={lastRef} label="Last name" value={last} onChangeText={setLast}
            error={errors.last} autoComplete="family-name"
            textContentType="familyName" autoCapitalize="words"
            returnKeyType="next" submitBehavior="submit"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <Input
            ref={emailRef} label="Email" value={email} onChangeText={setEmail}
            error={errors.email} placeholder="you@example.com"
            keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
            autoComplete="email" textContentType="emailAddress"
            returnKeyType="next" submitBehavior="submit"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <Input
            ref={passwordRef} label="Password" value={password}
            onChangeText={setPassword} error={errors.password}
            placeholder="At least 8 characters" secure autoCapitalize="none"
            autoComplete="new-password" textContentType="newPassword"
            returnKeyType="next" submitBehavior="submit"
            onSubmitEditing={() => confirmRef.current?.focus()}
          />
          <Input
            ref={confirmRef} label="Re-enter password" value={confirm}
            onChangeText={setConfirm} error={errors.confirm}
            secure autoCapitalize="none" autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="go" onSubmitEditing={submit}
          />

          <Button label="Sign up" variant="primary" loading={busy} onPress={submit} />

          <Pressable onPress={() => router.replace("/sign-in")} hitSlop={10} className="mt-4">
            <Text className="text-caption text-content-muted text-center">
              Already have an account? <Text className="font-semibold">Sign in</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
