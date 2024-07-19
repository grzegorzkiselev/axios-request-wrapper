import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist", "node_modules"],
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/quotes": ["error", "double", {
        avoidEscape: true,
        allowTemplateLiterals: true,
      }],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/comma-dangle": ["warn", "always-multiline"],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/no-trailing-spaces": ["error"],

      "curly": ["error", "all"],
      "arrow-body-style": ["off", "as-needed"],
      "brace-style": ["warn", "1tbs"],
      "class-methods-use-this": ["warn"],
      "consistent-return": ["warn"],
      "no-alert": ["warn"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": ["warn"],
      "no-await-in-loop": ["warn"],
      "no-param-reassign": ["warn", { props: false }],
      "no-plusplus": ["warn", { "allowForLoopAfterthoughts": true }],
      "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
      "no-return-assign": ["warn", "except-parens"],
      "no-return-await": ["warn"],
      "no-shadow": ["warn", { hoist: "all",allow: ["resolve", "reject", "done", "next", "err", "error"] }],
      "no-use-before-define": ["warn"],
    },
  },
];
