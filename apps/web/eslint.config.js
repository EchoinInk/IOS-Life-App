// eslint.config.js

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import regex from "eslint-plugin-regex";

export default [
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2021,
      sourceType: "module",
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      regex,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      /**
       * 🔒 DESIGN SYSTEM ENFORCEMENT
       */
      "regex/invalid": [
        "error",
        [
          {
            regex: "#[0-9a-fA-F]{3,8}",
            message: "❌ No hex colors. Use tokens.",
          },
          {
            regex: "rgba?\\(",
            message: "❌ No rgba(). Use tokens.",
          },
          {
            regex: "hsl\\(",
            message: "❌ No hsl(). Use tokens.",
          },
          {
            regex:
              "text-(white|black|gray|red|blue|green|yellow|pink|purple)",
            message: "❌ No Tailwind palette. Use semantic tokens.",
          },
          {
            regex:
              "bg-(white|black|gray|red|blue|green|yellow|pink|purple)",
            message: "❌ No Tailwind palette. Use semantic tokens.",
          },
          {
            regex:
              "border-(white|black|gray|red|blue|green|yellow|pink|purple)",
            message: "❌ No Tailwind palette. Use semantic tokens.",
          },
          {
            regex: "muted-foreground",
            message: "❌ Use text-muted instead.",
          },
        ],
      ],

      /**
       * React fixes
       */
      "react/react-in-jsx-scope": "off", // React 17+
      "react/jsx-uses-react": "off",

      /**
       * Optional sanity
       */
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },

  {
    files: ["src/theme/tokens.ts"],
    rules: {
      "regex/invalid": "off",
    },
  },
];