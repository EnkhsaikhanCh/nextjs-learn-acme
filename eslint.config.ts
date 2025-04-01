// eslint.config.ts
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "@next/eslint-plugin-next";
import prettierPlugin from "eslint-plugin-prettier";
import type { Linter } from "eslint";

const config: Linter.FlatConfig[] = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  next.recommended,
  {
    plugins: {
      prettier: prettierPlugin, // ✅ энэ plugin бол объект байх ёстой!
    },
    rules: {
      "prettier/prettier": "error", // Prettier format алдааг lint алдаа болгоно
      "no-console": "warn",
      semi: ["error", "always"],
      quotes: ["error", "single"],
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
];

export default config;
