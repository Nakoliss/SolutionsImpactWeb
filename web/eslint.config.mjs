import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "simple-import-sort/imports": "off",
      "simple-import-sort/exports": "off",
      "import/no-duplicates": "off",
      "import/no-named-as-default": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/self-closing-comp": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/rules-of-hooks": "off",
      "@next/next/no-assign-module-variable": "off",
      "prefer-const": "off",
      "no-var": "off",
      "object-shorthand": "off",
      "prefer-template": "off",
    },
  },
];

export default eslintConfig;
