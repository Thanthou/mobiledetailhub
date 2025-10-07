import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importPlugin from 'eslint-plugin-import';

export default [
  { ignores: ['dist', 'vitest.config.ts'] },
  js.configs.recommended,
  {
    files: ['public/**/*.js'],
    ignores: ['public/sw.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      sourceType: 'script',
    },
  },
  {
    files: ['public/sw.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
      sourceType: 'script',
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        google: 'readonly',
      },
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
      'import': importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['strict-type-checked'].rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // TypeScript strict+ rules
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      
      // Console logging rules
      'no-console': ['error', { 'allow': ['warn', 'error'] }],
      
      // Import sorting and cycle detection
      'simple-import-sort/imports': ['error', {
        groups: [
          // 1) side-effect imports
          ['^\\u0000'],
          // 2) external packages
          ['^react', '^@?\\w'],
          // 3) internal @/ imports
          ['^@/'],
          // 4) relative imports
          ['^\\.\\./', '^\\./'],
          // 5) styles
          ['^.+\\.(css|scss|sass|less)$'],
        ],
      }],
      'simple-import-sort/exports': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      
      // Import boundary rules for feature-first architecture
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // Features cannot import from other features directly (no exceptions)
            {
              target: './src/features/*/',
              from: './src/features/*/',
              message: 'Features cannot import from other features directly. Use shared modules or communicate via props/context.'
            },
            // Allow same-feature imports (components can import from hooks/state in same feature)
            // Only block cross-feature imports
            // Utils cannot import from components or hooks
            {
              target: './src/features/*/utils/',
              from: './src/features/*/components/',
              message: 'Utils cannot import from components. Utils should be pure functions.'
            },
            {
              target: './src/features/*/utils/',
              from: './src/features/*/hooks/',
              message: 'Utils cannot import from hooks. Utils should be pure functions.'
            },
            // Types cannot import from runtime code
            {
              target: './src/features/*/types/',
              from: './src/features/*/components/',
              message: 'Types cannot import from components. Types should only contain type definitions.'
            },
            {
              target: './src/features/*/types/',
              from: './src/features/*/hooks/',
              message: 'Types cannot import from hooks. Types should only contain type definitions.'
            },
            {
              target: './src/features/*/types/',
              from: './src/features/*/utils/',
              message: 'Types cannot import from utils. Types should only contain type definitions.'
            }
          ]
        }
      ],
      
      // Disable prop-types for TypeScript projects (we use interfaces instead)
      'react/prop-types': 'off',
    },
  }
];
