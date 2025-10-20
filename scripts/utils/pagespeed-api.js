#!/usr/bin/env node
/**
 * pagespeed-api.js — PageSpeed Insights API Integration
 * --------------------------------------------------------------
 * Provides Google-hosted Lighthouse audits via PageSpeed API
 * ✅ No Windows headless Chrome issues
 * ✅ Tests live production URLs
 * ✅ Same Lighthouse engine as CI/CD
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

/**
 * Run PageSpeed Insights API for a given URL
 * @param {string} url - The URL to test
 * @param {string} apiKey - Google PageSpeed API key
 * @param {string} strategy - 'mobile' or 'desktop'
 * @returns {Promise<Object>} - Lighthouse result with SEO score
 */
export async function runPageSpeedAPI(url, apiKey, strategy = 'mobile') {
  return new Promise((resolve, reject) => {
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&category=seo&strategy=${strategy}&key=${apiKey}`;
    
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`PageSpeed API returned ${res.statusCode}: ${data}`));
        }
        
        try {
          const result = JSON.parse(data);
          const lighthouseResult = result.lighthouseResult;
          
          if (!lighthouseResult) {
            return reject(new Error('No Lighthouse result in PageSpeed response'));
          }
          
          const seoScore = lighthouseResult.categories?.seo?.score * 100 || 0;
          
          resolve({
            score: Math.round(seoScore),
            fullReport: lighthouseResult,
            fetchTime: lighthouseResult.fetchTime,
            finalUrl: lighthouseResult.finalUrl,
            audits: lighthouseResult.audits,
          });
        } catch (err) {
          reject(new Error(`Failed to parse PageSpeed response: ${err.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`PageSpeed API request failed: ${err.message}`));
    });
  });
}

/**
 * Run PageSpeed for all apps and save reports
 * @param {Array} apps - Array of app configs with { name, liveUrl, description }
 * @param {string} apiKey - Google PageSpeed API key
 * @param {string} outputDir - Directory to save JSON reports
 * @returns {Promise<Array>} - Array of results with scores
 */
export async function runPageSpeedForApps(apps, apiKey, outputDir) {
  const results = [];
  
  for (const app of apps) {
    if (!app.liveUrl) {
      console.warn(`⚠️  Skipping ${app.name} - no live URL configured`);
      results.push({ app: app.name, score: 0, error: 'No live URL' });
      continue;
    }
    
    console.log(`⚡ Analyzing ${app.name} (${app.liveUrl}) via PageSpeed API...`);
    
    try {
      const result = await runPageSpeedAPI(app.liveUrl, apiKey);
      
      // Save full Lighthouse report in same format as local Lighthouse
      const reportPath = path.join(outputDir, `${app.name}-seo.json`);
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
      fs.writeFileSync(reportPath, JSON.stringify(result.fullReport, null, 2));
      
      console.log(`✅ ${app.name} score: ${result.score}/100 (via PageSpeed API)`);
      
      results.push({
        app: app.name,
        score: result.score,
        source: 'PageSpeed API',
        url: result.finalUrl,
        fetchTime: result.fetchTime,
      });
    } catch (err) {
      console.error(`❌ PageSpeed API failed for ${app.name}:`, err.message);
      results.push({
        app: app.name,
        score: 0,
        error: err.message,
        source: 'PageSpeed API (failed)',
      });
    }
  }
  
  return results;
}

