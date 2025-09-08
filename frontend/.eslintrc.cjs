module.exports = {
    root: true,
  
    // Default: JS/JSX use Espree
    env: { browser: true, es2022: true, node: true },
  
    // Use Espree globally; we’ll switch to TS parser only for TS files
    parser: 'espree',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  
    settings: { react: { version: 'detect' } },
  
    plugins: [
      'react',
      'react-hooks',
      'simple-import-sort',
      'react-refresh',
      // NOTE: We will load @typescript-eslint only in TS override below
    ],
  
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ],
  
    rules: {
      // Import ordering / Fast Refresh
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  
      'react/react-in-jsx-scope': 'off',
    },
  
    overrides: [
        // JS/CJS/MJS: plain parser
        {
          files: ['**/*.{js,cjs,mjs}'],
          parser: 'espree',
          rules: {},
        },
      
        // TS/TSX (fast, non-type-aware pass)
        {
          files: ['**/*.{ts,tsx}'],
          parser: '@typescript-eslint/parser',
          parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            // NOTE: no "project" here → non type-aware
          },
          plugins: ['@typescript-eslint'],
          extends: [
            'plugin:@typescript-eslint/recommended', // non-type-aware rules
          ],
          rules: {
            // keep these basic but useful
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': 'warn',
          },
        },
      
        // TS/TSX (typed, strict) — start small, expand later
        {
          files: [
            'src/contexts/**/*.{ts,tsx}',
            'src/hooks/**/*.{ts,tsx}',
            'src/services/**/*.{ts,tsx}',
          ],
          parser: '@typescript-eslint/parser',
          parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: ['./tsconfig.eslint.json'], // typed linting here only
            tsconfigRootDir: __dirname,
          },
          plugins: ['@typescript-eslint'],
          extends: ['plugin:@typescript-eslint/recommended'],
          rules: {
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
            '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true, allowBoolean: true }],
            '@typescript-eslint/no-unnecessary-condition': 'warn',
            '@typescript-eslint/no-floating-promises': 'error',
          },
        },
      
        // UI Components – allow defensive checks
        {
          files: [
            'src/components/**/*.{ts,tsx}',
            'src/pages/**/components/**/*.{ts,tsx}',
            'src/pages/**/affiliate/**/*.{ts,tsx}',
            'src/pages/**/mdh/**/*.{ts,tsx}',
          ],
          rules: {
            '@typescript-eslint/no-unnecessary-condition': 'off',
          },
        },

        // Tests – tone it down
        {
          files: ['**/*.{test,spec}.{ts,tsx,js}'],
          rules: {
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
          },
        },
      ],
      
  
    ignorePatterns: [
      // Build & vendor
      'node_modules/',
      'dist/',
      'build/',
      '.next/',
      'coverage/',

      // Public assets or vendor JS – avoids trying to type-lint plain JS
      'public/**',

      // Tooling configs
      'vite.config.*',
      'tailwind.config.*',
      'postcss.config.*',
      
      // Temporarily ignore file with parsing issues
      'src/pages/affiliateDashboard/tabs/services/ServicesTab.tsx',
    ],
  };
  