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
import eslintComments from 'eslint-plugin-eslint-comments';

export default [
  { ignores: ['dist', 'vitest.config.ts', 'scripts/_archive/**'] },
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
  // ============================================================================
  // GENERAL TypeScript/React Configuration (applies broadly, overridden by specific configs below)
  // ============================================================================
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        google: 'readonly',
        NodeJS: 'readonly',
        process: 'readonly',
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
      'eslint-comments': eslintComments,
    },
    settings: {
      react: {
        version: 'detect',
        runtime: 'automatic', // Use the new JSX transform (React 17+)
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
      // TypeScript strict rules - type safety (warnings for gradual improvement)
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      
      // Critical errors that can cause bugs (keep as errors)
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-undef': 'error',
      'no-redeclare': 'error',
      
      // Console logging rules (error in src, allowed in scripts/tests/utils)
      'no-console': ['error', { 'allow': ['warn', 'error'] }],
      
      // Component size guardrails (nudge toward refactoring, don't fail builds)
      'max-lines': ['warn', {
        max: 500,
        skipBlankLines: true,
        skipComments: true,
      }],
      
      // ESLint disable comment hygiene
      'eslint-comments/disable-enable-pair': 'error',
      'eslint-comments/no-unused-disable': 'error',
      'eslint-comments/no-unlimited-disable': 'warn',
      'eslint-comments/require-description': ['warn', { ignore: [] }],
      
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
            // Features cannot import from other features directly
            // Pattern catches: features/featureA importing from features/featureB
            {
              target: './src/features/**/*',
              from: './src/features/**/*',
              except: ['./src/features/_templates/**'],  // Allow templates
              message: 'Cross-feature imports are forbidden. Features can only import from @/shared/** or within their own feature directory. Extract shared code to @/shared/**.',
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
      // Disable React in scope rule for automatic JSX runtime
      'react/react-in-jsx-scope': 'off',
    },
  },
  
  // ============================================================================
  // SPECIFIC OVERRIDES (these come after general config to take precedence)
  // ============================================================================
  
  // Scripts (.js files) - use Node environment, no TypeScript rules
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off', // Scripts need console output
      'no-undef': 'off', // Node globals are available
    },
  },
  
  // Scripts (.ts files) - use TypeScript parser
  {
    files: ['scripts/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-console': 'off', // Scripts need console output
      'no-undef': 'off', // Node globals are available
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
    },
  },
  
  // Test files can use console and don't need strict typing for mocks
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest, // Add Jest globals (describe, it, expect, etc.)
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Tests often need any for mocks
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'no-console': 'off', // Tests can use console for debugging
      'no-undef': 'off', // Jest globals are available
    },
  },
  
  // Logging utilities legitimately need console access
  {
    files: ['src/shared/utils/logger.ts', 'src/shared/utils/errorMonitoring.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  
  // ============================================================================
  // Architectural Boundary Enforcement
  // ============================================================================
  
  // Prohibit fetch in components - use hooks with API clients instead
  {
    files: ['src/features/**/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'Do not use fetch() directly in components. Create an API client in features/<feature>/api/*.api.ts and consume it via a hook.',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="fetch"]',
          message: 'Do not use fetch() in components. Use hooks that consume API clients from features/<feature>/api/*.api.ts',
        },
      ],
    },
  },
  
  // Prohibit fetch in shared/ui - these should be pure presentational
  {
    files: ['src/shared/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'Shared UI components must be pure. No API calls allowed.',
        },
      ],
    },
  },
];
