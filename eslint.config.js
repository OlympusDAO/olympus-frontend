const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const prettierPlugin = require("eslint-plugin-prettier");
const simpleImportSortPlugin = require("eslint-plugin-simple-import-sort");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const globals = require("globals");

module.exports = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        React: true,
        JSX: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      "unused-imports": unusedImportsPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    rules: {
      "prettier/prettier": ["error"],
      "no-console": "off",
      "no-undef": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/destructuring-assignment": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      "no-undef": "error",
    },
  },
  {
    files: ["**/*.{test,spec}.{js,jsx,ts,tsx}", "**/__tests__/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        afterEach: true,
        beforeEach: true,
        describe: true,
        expect: true,
        global: true,
        it: true,
        vi: true,
      },
    },
    rules: {
      "no-undef": "off",
      "no-import-assign": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: ["build/**", "node_modules/**", "src/typechain/**"],
  }
);
