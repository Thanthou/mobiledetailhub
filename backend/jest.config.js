/**
 * Jest configuration for ESM backend tests
 */
export default {
  testEnvironment: 'node',
  
  // ESM support (package.json has "type": "module" so .js files are already ESM)
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {},
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/tests/**/*.test.js',
  ],
  
  // Coverage settings
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
  ],
  
  // Setup files
  setupFilesAfterEnv: [],
  
  // Timeouts
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
};

