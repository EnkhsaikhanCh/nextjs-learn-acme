// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "dist",
      "build",
      "node_modules",
      "src/generated/**",
      "**/node_modules/**",
      ".next/**",
      ".eslintcache",
    ],
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    rules: {
      "no-console": "warn",
      // "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // complexity: ["warn", { max: 10 }],
      // "max-lines": ["warn", { max: 300 }],
    },
  },
];
