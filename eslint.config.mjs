// Shared ESLint flat config for every TypeScript workspace.
// Module boundaries are enforced separately by dependency-cruiser (.dependency-cruiser.cjs).
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.expo/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/next-env.d.ts",
      "**/.venv/**",
      // Generated code (pnpm generate)
      "packages/contracts/src/gen/**",
      "apps/staff/gql/**",
      "assets/**",
      "public/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
);
