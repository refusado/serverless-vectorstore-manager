import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'eslint:recommended',
      'next/core-web-vitals',
      'next/typescript',
      'plugin:prettier/recommended',
    ],
    rules: {
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],
      'react/no-unescaped-entities': 'off',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      '@next/next/no-img-element': 'off',
    },
  }),
];

export default eslintConfig;