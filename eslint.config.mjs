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
      "src/components/ui",
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
      "no-multiple-empty-lines": ["warn", { max: 1 }], // олон хоосон мөрийг хориглоно
      curly: ["warn", "all"],
      eqeqeq: ["warn", "always"], // === ашиглахыг шаарддаг
      semi: ["warn", "always"], // ; ашиглахыг шаарддаг
      // "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // complexity: ["warn", { max: 10 }],
      // "max-lines": ["warn", { max: 300 }],
    },
  },
];
