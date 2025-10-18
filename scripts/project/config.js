#!/usr/bin/env node
/**
 * Project Configuration
 * Centralized configuration for all audit and automation scripts
 */

export const config = {
  // Paths
  paths: {
    root: process.cwd(),
    frontend: 'frontend',
    backend: 'backend',
    scripts: 'scripts',
    reports: 'scripts/audits/reports',
    chatgpt: 'chatgpt'
  },

  // Ignore patterns for file scanning
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**',
    '**/coverage/**',
    '**/.vite/**',
    '**/build/**'
  ],

  // Scoring weights for different metrics
  scoring: {
    codeQuality: 0.3,
    performance: 0.25,
    security: 0.2,
    maintainability: 0.15,
    documentation: 0.1
  },

  // Audit thresholds
  thresholds: {
    minCodeCoverage: 80,
    maxComplexity: 10,
    maxFileSize: 500,
    minDocumentation: 70
  },

  // Phase definitions
  phases: {
    1: 'Database & Schema',
    2: 'API & Routes', 
    3: 'Frontend Structure',
    4: 'Performance & SEO',
    5: 'Deployment & Monitoring'
  }
};

export default config;
