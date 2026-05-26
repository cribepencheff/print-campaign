import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // Import sorting
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",

      // Light hygiene (optional but nice)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      eqeqeq: ["error", "smart"],
      "prefer-const": "error",
      "object-shorthand": "error",
    },
  },
]);

export default eslintConfig;
