module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  settings: { react: { version: 'detect' } },
  plugins: ['@typescript-eslint','react','react-hooks','simple-import-sort','react-refresh'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true, allowBoolean: true }],
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-floating-promises': 'error',

    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    { files: ['**/*.{js,cjs}'], parser: 'espree' },
    {
      files: ['**/*.test.*','**/*.spec.*','**/__tests__/**/*.js'],
      env: {
        jest: true,
        node: true
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script'
      },
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      },
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/','dist/','build/','.next/','coverage/',
    '.eslintrc.cjs','vite.config.*','tailwind.config.*','postcss.config.*',
  ],
};
