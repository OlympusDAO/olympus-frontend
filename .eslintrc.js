module.exports = {
  env: {
    browser: true,
  },
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ["plugin:prettier/recommended", "prettier/react"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error"],
=======
=======
>>>>>>> commented out airbnb in eslint
=======
>>>>>>> Linting fixes
  extends: [/*"airbnb", */ "plugin:prettier/recommended", "prettier/react"],
  plugins: ["babel"],
  rules: {
    "prettier/prettier": ["warn"],
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
=======
<<<<<<< HEAD
>>>>>>> updated eslint to 7.29 and changed prettier config to warn
=======
=======
  extends: [/*"airbnb"*/ "plugin:prettier/recommended", "prettier/react"],
  plugins: ["babel"],
  rules: {
    "prettier/prettier": ["warn"],
>>>>>>> commented out airbnb in eslint
<<<<<<< HEAD
>>>>>>> commented out airbnb in eslint
=======
=======
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ["plugin:prettier/recommended", "prettier/react"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error"],
>>>>>>> Linting fixes
>>>>>>> Linting fixes
    // "import/extensions": [
    //   "error",
    //   "ignorePackages",
    //   {
    //     js: "never",
    //     jsx: "never",
    //     ts: "never",
    //     tsx: "never",
    //   },
    // ],
<<<<<<< HEAD
=======
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
>>>>>>> updated eslint to 7.29 and changed prettier config to warn
=======
>>>>>>> commented out airbnb in eslint
    "import/prefer-default-export": "off",
    "prefer-destructuring": "off",
    "prefer-template": "off",
    "react/prop-types": "off",
    "react/destructuring-assignment": "off",
    "no-console": "off",
    "jsx-a11y/accessible-emoji": ["off"],
    "jsx-a11y/click-events-have-key-events": ["off"],
    "jsx-a11y/no-static-element-interactions": ["off"],
    "no-underscore-dangle": "off",
    "no-nested-ternary": "off",
    "no-restricted-syntax": "off",
    "no-plusplus": "off",
  },
};
