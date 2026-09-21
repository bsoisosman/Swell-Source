import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { light, dark } from "../src/theme/tokens";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const toVars = (o: Record<string, string>) =>
  Object.entries(o).map(([k, v]) => `  --color-${k}: ${v};`).join("\n");

writeFileSync(join(root, "global.css"), `/* GENERATED - DO NOT EDIT.
 * Source: src/theme/tokens.ts   Regenerate: npm run tokens
 */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
${toVars(light)}
}

.dark:root {
${toVars(dark)}
}
`);
console.log("global.css regenerated from tokens.ts");
