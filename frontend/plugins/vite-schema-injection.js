/**
 * Vite Plugin: Schema Injection for Audit Mode
 * Injects JSON-LD schemas into static HTML during build for audit verification
 */

import fs from 'fs';
import path from 'path';

export function schemaInjectionPlugin(options = {}) {
  const {
    enabled = process.env.AUDIT_MODE === 'true',
    schemas = {}
  } = options;

  if (!enabled) {
    return {
      name: 'schema-injection',
      // No-op when disabled
    };
  }

  return {
    name: 'schema-injection',
    
    transformIndexHtml: {
      enforce: 'post',
      transform(html, context) {
        // Only inject for specific entry points
        const entryName = context.bundle?.[context.filename]?.facadeModuleId;
        if (!entryName) return html;

        // Determine which schemas to inject based on entry point
        let schemasToInject = [];
        
        if (entryName.includes('admin')) {
          schemasToInject = schemas.admin || [];
        } else if (entryName.includes('main-site')) {
          schemasToInject = schemas.main || [];
        } else if (entryName.includes('tenant')) {
          schemasToInject = schemas.tenant || [];
        }

        if (schemasToInject.length === 0) return html;

        // Generate schema scripts
        const schemaScripts = schemasToInject.map(schema => 
          `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
        ).join('\n');

        // Inject before closing head tag
        return html.replace('</head>', `\n${schemaScripts}\n</head>`);
      }
    }
  };
}
