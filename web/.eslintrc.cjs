module.exports = {
  extends: ['next/core-web-vitals'],
  ignorePatterns: [
    'node_modules/',
    '.next/',
    '__tests__/**',
  ],
  rules: {
    'simple-import-sort/imports': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    'react/no-unescaped-entities': 'off',
    'react/self-closing-comp': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'import/no-named-as-default': 'off',
    '@next/next/no-assign-module-variable': 'off',
  },
};
