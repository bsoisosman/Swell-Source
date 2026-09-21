export const primitives = {
  brand: { 50:"#f5f6f8", 100:"#e6e9ee", 300:"#a8b2c1", 500:"#4a5568", 700:"#2b3442", 900:"#151a21" },
  neutral: { 0:"#ffffff", 50:"#fafafa", 100:"#f4f4f5", 200:"#e4e4e7", 400:"#a1a1aa", 600:"#52525b", 800:"#27272a", 950:"#09090b" },
  danger: "#dc2626", warning: "#d97706", success: "#16a34a",
} as const;

const { brand, neutral } = primitives;

export const light = {
  surface: neutral[0],
  "surface-raised": neutral[0],
  "surface-sunken": neutral[50],
  content: neutral[950],
  "content-muted": neutral[600],
  "content-subtle": neutral[400],
  "content-on-brand": neutral[0],
  border: neutral[200],
  "border-strong": neutral[400],
  accent: brand[700],
  "accent-pressed": brand[900],
  danger: primitives.danger,
  warning: primitives.warning,
  success: primitives.success,
} as const;

export const dark: Record<keyof typeof light, string> = {
  surface: neutral[950],
  "surface-raised": neutral[800],
  "surface-sunken": "#000000",
  content: neutral[50],
  "content-muted": neutral[400],
  "content-subtle": neutral[600],
  "content-on-brand": neutral[950],
  border: neutral[800],
  "border-strong": neutral[600],
  accent: brand[300],
  "accent-pressed": brand[100],
  danger: "#f87171", warning: "#fbbf24", success: "#4ade80",
};

export type SemanticColor = keyof typeof light;

export const space = { base:4, 0:0, 1:4, 2:8, 3:12, 4:16, 5:20, 6:24, 8:32, 10:40, 12:48, 16:64 } as const;

export const type = {
  caption: { fontSize:12, lineHeight:16, letterSpacing:0.1 },
  body:    { fontSize:16, lineHeight:24, letterSpacing:0 },
  bodyLg:  { fontSize:18, lineHeight:28, letterSpacing:0 },
  heading: { fontSize:24, lineHeight:32, letterSpacing:-0.2 },
  display: { fontSize:40, lineHeight:44, letterSpacing:-0.8 },
} as const;

export const fonts = {
  regular:"Inter_400Regular", medium:"Inter_500Medium",
  semibold:"Inter_600SemiBold", bold:"Inter_700Bold",
} as const;

export const radius = { control:8, card:12, sheet:20, full:9999 } as const;

export const minTouchTarget = 44;
