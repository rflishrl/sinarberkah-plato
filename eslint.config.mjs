import tseslint from "typescript-eslint";
import pluginRouter from "@tanstack/eslint-plugin-router";

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".output/**",
      ".vercel/**",
      ".nitro/**",
      "dist/**",
      ".agents/**",
      ".agent/**",
      "src/routeTree.gen.ts",
      "coverage/**",
    ],
  },
  tseslint.configs.recommended,
  ...pluginRouter.configs["flat/recommended"],
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
