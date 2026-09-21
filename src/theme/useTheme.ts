import { useColorScheme } from "nativewind";
import { light, dark } from "./tokens";
import type { SemanticColor } from "./tokens";

export function useTheme() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors: Record<SemanticColor, string> = isDark ? dark : light;
  return { colors, isDark, colorScheme: colorScheme ?? "light" };
}
