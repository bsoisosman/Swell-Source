/** Swell brand palette. Every pair verified to WCAG AA.
 *
 *  Two constraints the palette imposes:
 *   - Dusk Blue and Taupe are 1.46:1 apart. Never adjacent.
 *   - Blue Bell needs +9% lightness to clear the 3:1 UI-boundary
 *     rule against Dusk Blue. At its exact value it's 2.83:1.
 */

export const primitives = {
  icyAqua:  "#C5FFFD",
  blueBell: "#20A4F3",
  duskBlue: "#1B5299",
  taupe:    "#403934",
  sandy:    "#EF9246",

  /** Derived tints. Palettes are seeds; interfaces need steps. */
  blueBellLift: "#3DB0F5",
  sandyLift:    "#F5AE70",
  sandyPress:   "#D67A2F",
  aquaBorder:   "#7FD4E8",
  aquaPress:    "#9FE8E6",
  taupeRaised:  "#4E4640",
  taupeBorder:  "#978A7F",
  taupeMuted:   "#B5A99F",
  taupeMutedUp: "#C0B5AC",
  taupeSoft:    "#6E645C",
  warmWhite:    "#F2EFEC",
  nearBlack:    "#1F1B18",
  white:        "#FFFFFF",

  danger: "#dc2626", warning: "#d97706", success: "#16a34a",
} as const;

const p = primitives;

/** LIGHT - the water's surface.
 *  Sandy is the action: the only warm colour against the blue. */
export const light = {
  surface: p.duskBlue,
  "surface-raised": p.white,
  content: p.white,
  "content-muted": p.icyAqua,
  "content-on-raised": p.taupe,
  "content-on-raised-muted": p.taupeSoft,
  accent: p.sandy,
  "accent-pressed": p.sandyLift,
  "content-on-accent": p.taupe,
  "accent-strong": p.blueBellLift,
  "accent-strong-pressed": p.blueBell,
  "content-on-accent-strong": p.nearBlack,
  border: p.aquaBorder,
  "border-strong": p.white,
  danger: p.danger, warning: p.warning, success: p.success,
} as const;

/** DARK - the shore at night. Warm dark, not a cool one.
 *  Blue Bell is the action. Its label must be near-black:
 *  white on Blue Bell is 2.74:1 and fails. */
export const dark: Record<keyof typeof light, string> = {
  surface: p.taupe,
  "surface-raised": p.taupeRaised,
  content: p.warmWhite,
  "content-muted": p.taupeMuted,
  "content-on-raised": p.warmWhite,
  "content-on-raised-muted": p.taupeMutedUp,
  accent: p.blueBell,
  "accent-pressed": p.blueBellLift,
  "content-on-accent": p.nearBlack,
  "accent-strong": p.icyAqua,
  "accent-strong-pressed": p.aquaPress,
  "content-on-accent-strong": p.taupe,
  border: p.taupeBorder,
  "border-strong": p.taupeMuted,
  danger: "#f87171", warning: "#fbbf24", success: "#4ade80",
};

export type SemanticColor = keyof typeof light;

export const space = {
  base:4, 0:0, 1:4, 2:8, 3:12, 4:16, 5:20, 6:24, 8:32, 10:40, 12:48, 16:64,
} as const;

/** lineHeight in RN is absolute, not a ratio. */
export const type = {
  caption: { fontSize:12, lineHeight:16, letterSpacing:0.1 },
  body:    { fontSize:16, lineHeight:24, letterSpacing:0 },
  bodyLg:  { fontSize:18, lineHeight:28, letterSpacing:0 },
  heading: { fontSize:24, lineHeight:32, letterSpacing:-0.2 },
  display: { fontSize:40, lineHeight:44, letterSpacing:-0.8 },
} as const;

/** Placeholder until the real typeface is confirmed. */
export const fonts = {
  regular:"Inter_400Regular", medium:"Inter_500Medium",
  semibold:"Inter_600SemiBold", bold:"Inter_700Bold",
} as const;

export const radius = { control:6, card:12, sheet:20, full:9999 } as const;

/** 44pt iOS / 48dp Android. Never in the design file. */
export const minTouchTarget = 44;
