#!/usr/bin/env node
/**
 * Phase Map - Audit Phase Definitions
 * Defines the progression of audit phases and their associated scripts
 */

export const phaseMap = {
  1: {
    name: 'Database & Schema',
    description: 'Database structure, migrations, and schema validation',
    scripts: [
      'audits/backend/audit-schema-switching.js',
      'testing/backend/test-subdomain.js'
    ],
    dependencies: ['backend/database'],
    outputs: ['audits/reports/database-audit.md']
  },

  2: {
    name: 'API & Routes',
    description: 'Backend API consistency and route validation',
    scripts: [
      'audits/backend/audit-express-routes.js',
      'devtools/fixers/fix-express-routes.js'
    ],
    dependencies: ['backend/routes'],
    outputs: ['audits/reports/api-audit.md']
  },

  3: {
    name: 'Frontend Structure',
    description: 'React component structure and routing validation',
    scripts: [
      'audits/frontend/audit-routing.js',
      'audits/frontend/routing-validation-audit.js',
      'testing/frontend/validate-build.js'
    ],
    dependencies: ['frontend/src'],
    outputs: ['audits/reports/frontend-audit.md']
  },

  4: {
    name: 'Performance & SEO',
    description: 'Performance optimization and SEO validation',
    scripts: [
      'audits/seo/test-anchors.js',
      'audits/seo/test-endpoints.js',
      'testing/performance/validate-build.js'
    ],
    dependencies: ['frontend/public', 'backend/routes/seo'],
    outputs: ['audits/reports/seo-audit.md']
  },

  5: {
    name: 'Deployment & Monitoring',
    description: 'Deployment readiness and monitoring setup',
    scripts: [
      'automation/build/deploy-render.js',
      'automation/monitor/error-monitor/index.js'
    ],
    dependencies: ['render.yaml', 'package.json'],
    outputs: ['audits/reports/deployment-audit.md']
  }
};

export function getPhaseScripts(phaseNumber) {
  return phaseMap[phaseNumber]?.scripts || [];
}

export function getPhaseDependencies(phaseNumber) {
  return phaseMap[phaseNumber]?.dependencies || [];
}

export function getPhaseOutputs(phaseNumber) {
  return phaseMap[phaseNumber]?.outputs || [];
}

export default phaseMap;
