// eslint.config.js
module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-hooks": require("eslint-plugin-react-hooks"),
      "react": require("eslint-plugin-react"),
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      // Puedes agregar más reglas aquí si quieres
      // Ejemplo:
      // "react-hooks/exhaustive-deps": "warn",
    },
  },
];
