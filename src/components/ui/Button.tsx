import type { ComponentRef, ReactNode, Ref } from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import type { PressableProps } from "react-native";
import { cn } from "../../lib/cn";
import { useTheme } from "../../theme/useTheme";
import { minTouchTarget } from "../../theme/tokens";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  variant?: Variant;
  size?: Size;
  label: string;
  icon?: ReactNode;
  loading?: boolean;
  ref?: Ref<ComponentRef<typeof Pressable>>;
}

const container: Record<Variant, string> = {
  primary: "bg-accent active:bg-accent-pressed",
  secondary: "bg-surface border border-border active:bg-surface-sunken",
  ghost: "bg-transparent active:bg-surface-sunken",
};

const labelColor: Record<Variant, string> = {
  primary: "text-content-on-brand",
  secondary: "text-content",
  ghost: "text-content",
};

const sizing: Record<Size, string> = { sm: "h-8 px-3 gap-2", md: "h-10 px-4 gap-2" };
const labelSize: Record<Size, string> = { sm: "text-caption", md: "text-body" };

export function Button({
  variant = "primary", size = "md", label: text, icon,
  loading = false, disabled, className, ref, ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      ref={ref}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      hitSlop={Math.max(0, (minTouchTarget - (size === "sm" ? 32 : 40)) / 2)}
      android_ripple={variant === "primary" ? undefined : { color: colors.border }}
      className={cn(
        "flex-row items-center justify-center rounded-control",
        container[variant], sizing[size],
        isDisabled && "opacity-40", className,
      )}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? colors["content-on-brand"] : colors.content}
        />
      ) : icon}
      <Text
        className={cn("font-medium", labelColor[variant], labelSize[size])}
        maxFontSizeMultiplier={1.4}
      >
        {text}
      </Text>
    </Pressable>
  );
}
