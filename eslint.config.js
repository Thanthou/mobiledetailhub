/**
 * Root ESLint Configuration
 * Applies to backend/ and scripts/ (Node.js environments)
 * Frontend has its own eslint.config.js with React/TypeScript rules
 * 
 * Philosophy:
 * - Consistent code quality across backend and scripts
 * - Node.js best practices
 * - TypeScript support for scripts
 * - Aligned with .cursorrules: no eslint-disable without comment
 */

import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'frontend/**',  // Frontend has its own config
      '**/coverage/**',
      '**/.vite/**',
    ],
  },
  
  // Base JS recommended rules
  js.configs.recommended,
  
  // Backend JavaScript files
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Common rules from .cursorrules
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'no-undef': 'error',
      'no-shadow': 'error',
      'no-console': 'off',  // Console is fine in backend
      
      // Code quality
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      
      // Async/Promise rules
      'no-async-promise-executor': 'error',
      'require-await': 'warn',
      
      // Disable eslint-disable without comment (from .cursorrules)
      'eslint-comments/no-unlimited-disable': 'off',  // Would need plugin
      
      // Best practices
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
    },
  },
  
  // Root-level scripts
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-shadow': 'error',
      'no-console': 'off',  // Console output is the point of scripts
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  
  // Frontend scripts (TypeScript)
  {
    files: ['scripts/frontend/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        project: null,  // Don't type-check scripts with tsconfig
      },
    },
    rules: {
      'no-unused-vars': 'off',  // TypeScript handles this
      'no-undef': 'off',  // TypeScript handles this
      'no-shadow': 'error',
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];

