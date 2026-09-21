import { useState } from "react";
import type { ComponentRef, Ref } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import type { TextInputProps } from "react-native";
import { cn } from "../../lib/cn";
import { useTheme } from "../../theme/useTheme";

/**
 * The autofill props below are the difference between a form that
 * works with password managers and one that fights them. iOS reads
 * textContentType; Android reads autoComplete. Both are needed, and
 * neither appears anywhere in a Figma file.
 */

interface InputProps extends Omit<TextInputProps, "style" | "className"> {
  label: string;
  error?: string;
  secure?: boolean;
  ref?: Ref<ComponentRef<typeof TextInput>>;
}

export function Input({
  label, error, secure = false, ref, onFocus, onBlur, ...rest
}: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-caption text-content-muted mb-1" maxFontSizeMultiplier={1.3}>
        {label}
      </Text>

      <View
        className={cn(
          "flex-row items-center rounded-control bg-surface-raised px-3 border",
          error ? "border-danger" : focused ? "border-accent" : "border-border",
        )}
      >
        <TextInput
          ref={ref}
          className="flex-1 text-body text-content-on-raised py-3"
          placeholderTextColor={colors["content-on-raised-muted"]}
          selectionColor={colors.accent}
          secureTextEntry={secure && !revealed}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          maxFontSizeMultiplier={1.3}
          {...rest}
        />

        {secure && (
          <Pressable
            onPress={() => setRevealed((v) => !v)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={revealed ? "Hide password" : "Show password"}
          >
            <Text className="text-caption text-content-on-raised-muted font-medium">
              {revealed ? "Hide" : "Show"}
            </Text>
          </Pressable>
        )}
      </View>

      {error ? (
        <Text
          className="text-caption text-danger mt-1"
          accessibilityLiveRegion="polite"
          maxFontSizeMultiplier={1.3}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
