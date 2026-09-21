import type { Config } from "tailwindcss";
import { light, space, radius, type as typeScale } from "./src/theme/tokens";

const semanticColors = Object.fromEntries(
  Object.keys(light).map((name) => [name, `var(--color-${name})`]),
);

export default {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: semanticColors,
      spacing: Object.fromEntries(
        Object.entries(space)
          .filter(([k]) => k !== "base")
          .map(([k, v]) => [k, `${v}px`]),
      ),
      borderRadius: Object.fromEntries(
        Object.entries(radius).map(([k, v]) => [k, `${v}px`]),
      ),
      fontSize: Object.fromEntries(
        Object.entries(typeScale).map(([name, t]) => [
          name,
          [`${t.fontSize}px`, { lineHeight: `${t.lineHeight}px` }],
        ]),
      ),
    },
  },
  plugins: [],
} satisfies Config;
