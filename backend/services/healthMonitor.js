/**
 * Health Monitoring Service
 * Monitors website performance, SEO, security, and uptime for tenant websites
 */

import axios from 'axios';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import * as chromeLauncher from 'chrome-launcher';
import logger from '../utils/logger.js';

class HealthMonitor {
  constructor() {
    this.pageSpeedApiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    this.cruxApiKey = process.env.GOOGLE_CRUX_API_KEY;
    
    logger.info(`HealthMonitor initialized - PageSpeed API Key: ${this.pageSpeedApiKey ? 'SET' : 'NOT SET'}`);
    logger.info(`HealthMonitor initialized - CrUX API Key: ${this.cruxApiKey ? 'SET' : 'NOT SET'}`);
  }

  /**
   * Fetch PageSpeed Insights data for a given URL
   * @param {string} url - The website URL to analyze
   * @param {string} strategy - 'mobile' or 'desktop'
   * @returns {Promise<Object>} PageSpeed Insights data
   */
  async fetchPageSpeedInsights(url, strategy = 'mobile') {
    try {
      if (!this.pageSpeedApiKey) {
        logger.warn('Google PageSpeed API key not configured');
        return {
          success: false,
          error: 'PageSpeed API key not configured'
        };
      }

      logger.info(`Fetching PageSpeed Insights for ${url} (${strategy})`);

      const apiUrl = 'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed';
      const params = {
        url: url,
        strategy: strategy,
        key: this.pageSpeedApiKey,
        category: ['performance', 'accessibility', 'best-practices', 'seo']
      };

      logger.info(`Making API request to PageSpeed Insights...`);
      const response = await axios.get(apiUrl, {
        params,
        timeout: 30000 // 30 second timeout
      });
      logger.info(`PageSpeed Insights API response received`);

      if (response.data && response.data.lighthouseResult) {
        const lighthouse = response.data.lighthouseResult;
        
        return {
          success: true,
          data: {
            // Overall scores (0-100)
            performance: Math.round((lighthouse.categories.performance?.score || 0) * 100),
            accessibility: Math.round((lighthouse.categories.accessibility?.score || 0) * 100),
            bestPractices: Math.round((lighthouse.categories['best-practices']?.score || 0) * 100),
            seo: Math.round((lighthouse.categories.seo?.score || 0) * 100),
            
            // Core Web Vitals
            coreWebVitals: this.extractCoreWebVitals(lighthouse),
            
            // Additional metrics
            metrics: this.extractMetrics(lighthouse),
            
            // Opportunities and diagnostics
            opportunities: this.extractOpportunities(lighthouse.audits),
            diagnostics: this.extractDiagnostics(lighthouse.audits),
            
            // Strategy used
            strategy: strategy,
            
            // Timestamp
            timestamp: new Date().toISOString()
          }
        };
      }

      return {
        success: false,
        error: 'Invalid response from PageSpeed Insights API'
      };

    } catch (error) {
      logger.error('PageSpeed Insights API error:', error.message);
      logger.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        params: error.config?.params
      });
      return {
        success: false,
        error: error.message,
        details: error.response?.data || null
      };
    }
  }

  /**
   * Extract Core Web Vitals from Lighthouse result
   * @param {Object} lighthouse - Lighthouse result object
   * @returns {Object} Core Web Vitals data
   */
  extractCoreWebVitals(lighthouse) {
    const audits = lighthouse.audits;
    
    return {
      lcp: {
        value: audits['largest-contentful-paint']?.numericValue,
        score: audits['largest-contentful-paint']?.score,
        displayValue: audits['largest-contentful-paint']?.displayValue
      },
      fid: {
        value: audits['max-potential-fid']?.numericValue,
        score: audits['max-potential-fid']?.score,
        displayValue: audits['max-potential-fid']?.displayValue
      },
      cls: {
        value: audits['cumulative-layout-shift']?.numericValue,
        score: audits['cumulative-layout-shift']?.score,
        displayValue: audits['cumulative-layout-shift']?.displayValue
      },
      fcp: {
        value: audits['first-contentful-paint']?.numericValue,
        score: audits['first-contentful-paint']?.score,
        displayValue: audits['first-contentful-paint']?.displayValue
      },
      ttfb: {
        value: audits['server-response-time']?.numericValue,
        score: audits['server-response-time']?.score,
        displayValue: audits['server-response-time']?.displayValue
      }
    };
  }

  /**
   * Extract key performance metrics
   * @param {Object} lighthouse - Lighthouse result object
   * @returns {Object} Key metrics
   */
  extractMetrics(lighthouse) {
    const audits = lighthouse.audits;
    
    return {
      speedIndex: {
        value: audits['speed-index']?.numericValue,
        score: audits['speed-index']?.score,
        displayValue: audits['speed-index']?.displayValue
      },
      interactive: {
        value: audits['interactive']?.numericValue,
        score: audits['interactive']?.score,
        displayValue: audits['interactive']?.displayValue
      },
      totalBlockingTime: {
        value: audits['total-blocking-time']?.numericValue,
        score: audits['total-blocking-time']?.score,
        displayValue: audits['total-blocking-time']?.displayValue
      }
    };
  }

  /**
   * Extract optimization opportunities
   * @param {Object} audits - Lighthouse audits object
   * @returns {Array} Array of optimization opportunities
   */
  extractOpportunities(audits) {
    const opportunities = [];
    const opportunityKeys = [
      'unused-css-rules',
      'unused-javascript',
      'render-blocking-resources',
      'unminified-css',
      'unminified-javascript',
      'efficient-animated-content',
      'modern-image-formats',
      'uses-text-compression',
      'uses-optimized-images'
    ];

    opportunityKeys.forEach(key => {
      const audit = audits[key];
      if (audit && audit.details && audit.details.overallSavingsMs) {
        opportunities.push({
          id: key,
          title: audit.title,
          description: audit.description,
          savings: audit.details.overallSavingsMs,
          savingsBytes: audit.details.overallSavingsBytes || 0
        });
      }
    });

    return opportunities.sort((a, b) => b.savings - a.savings);
  }

  /**
   * Extract diagnostic information
   * @param {Object} audits - Lighthouse audits object
   * @returns {Array} Array of diagnostic items
   */
  extractDiagnostics(audits) {
    const diagnostics = [];
    const diagnosticKeys = [
      'mainthread-work-breakdown',
      'bootup-time',
      'uses-rel-preconnect',
      'font-display',
      'dom-size',
      'no-document-write',
      'uses-http2'
    ];

    diagnosticKeys.forEach(key => {
      const audit = audits[key];
      if (audit && audit.score !== null) {
        diagnostics.push({
          id: key,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          displayValue: audit.displayValue
        });
      }
    });

    return diagnostics;
  }

  /**
   * Fetch CrUX (Chrome User Experience Report) data
   * @param {string} url - The website URL to analyze
   * @returns {Promise<Object>} CrUX data
   */
  async fetchCrUXData(url) {
    try {
      if (!this.cruxApiKey) {
        logger.warn('Google CrUX API key not configured');
        return {
          success: false,
          error: 'CrUX API key not configured'
        };
      }

      logger.info(`Fetching CrUX data for ${url}`);

      // Note: CrUX API requires proper URL formatting and may not work for all domains
      const apiUrl = `https://chromeuxreport.googleapis.com/v1/records:queryRecord`;
      
      const requestBody = {
        url: url,
        metrics: ['largest_contentful_paint', 'first_input_delay', 'cumulative_layout_shift']
      };

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          key: this.cruxApiKey
        },
        timeout: 30000
      });

      if (response.data && response.data.record) {
        return {
          success: true,
          data: this.parseCrUXData(response.data.record)
        };
      }

      return {
        success: false,
        error: 'No CrUX data available for this URL'
      };

    } catch (error) {
      logger.error('CrUX API error:', error.message);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || null
      };
    }
  }

  /**
   * Parse CrUX API response data
   * @param {Object} record - CrUX record data
   * @returns {Object} Parsed CrUX data
   */
  parseCrUXData(record) {
    const metrics = record.metrics || {};
    
    return {
      lcp: this.parseCrUXMetric(metrics.largest_contentful_paint),
      fid: this.parseCrUXMetric(metrics.first_input_delay),
      cls: this.parseCrUXMetric(metrics.cumulative_layout_shift),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Parse individual CrUX metric
   * @param {Object} metric - CrUX metric object
   * @returns {Object} Parsed metric data
   */
  parseCrUXMetric(metric) {
    if (!metric || !metric.percentiles) {
      return null;
    }

    const percentiles = metric.percentiles;
    
    return {
      p75: percentiles.p75,
      p95: percentiles.p95,
      p99: percentiles.p99,
      histogram: metric.histogram || []
    };
  }

  /**
   * Get comprehensive health data for a tenant website
   * @param {string} tenantUrl - The tenant's website URL
   * @returns {Promise<Object>} Complete health analysis
   */
  async getWebsiteHealth(tenantUrl) {
    try {
      logger.info(`Starting comprehensive health analysis for ${tenantUrl}`);

      let mobilePSI = { success: false, error: 'PageSpeed API key not configured' };
      let desktopPSI = { success: false, error: 'PageSpeed API key not configured' };
      let cruxData = { success: false, error: 'CrUX API key not configured' };

      // Check if this is a development/staging URL that might not be accessible to Google
      const isDevelopmentUrl = this.isDevelopmentUrl(tenantUrl);
      let testUrl = tenantUrl;

      // For development URLs, use Lighthouse CLI instead of Google PageSpeed API
      if (isDevelopmentUrl) {
        logger.info('Development URL detected, using Lighthouse CLI for local analysis...');
        
        // Convert development domain to localhost for analysis
        const analysisUrl = this.convertToLocalhost(tenantUrl);
        logger.info(`Converting ${tenantUrl} to ${analysisUrl} for Lighthouse analysis`);
        
        try {
          // Run mobile analysis first with retry
          logger.info('Running Lighthouse for mobile...');
          mobilePSI = await this.runLighthouseLocalWithRetry(analysisUrl, 'mobile');
          logger.info(`Mobile Lighthouse analysis completed - success: ${mobilePSI.success}`);
          
          // Wait a moment between analyses to ensure clean resource usage
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Run desktop analysis second
          logger.info('Running Lighthouse for desktop...');
          desktopPSI = await this.runLighthouseLocal(analysisUrl, 'desktop');
          logger.info(`Desktop Lighthouse analysis completed - success: ${desktopPSI.success}`);
          
          // If both analyses fail, return failure
          if (!mobilePSI.success && !desktopPSI.success) {
            logger.error('Lighthouse analysis failed for both mobile and desktop');
          }
        } catch (lighthouseError) {
          logger.error(`Lighthouse CLI not available or failed: ${lighthouseError.message || lighthouseError.toString()}`);
          logger.error('Lighthouse error details:', {
            error: lighthouseError.message || lighthouseError.toString(),
            stack: lighthouseError.stack,
            cause: lighthouseError.cause
          });
        }
      } else {
        // For production URLs, use Google PageSpeed API
        if (this.pageSpeedApiKey) {
          logger.info(`Production URL detected, using Google PageSpeed API for ${testUrl}...`);
          logger.info(`Fetching mobile PageSpeed data for ${testUrl}...`);
          mobilePSI = await this.fetchPageSpeedInsights(testUrl, 'mobile');
          logger.info(`Mobile PageSpeed data fetched - success: ${mobilePSI.success}`);
          
          logger.info(`Fetching desktop PageSpeed data for ${testUrl}...`);
          desktopPSI = await this.fetchPageSpeedInsights(testUrl, 'desktop');
          logger.info(`Desktop PageSpeed data fetched - success: ${desktopPSI.success}`);
        } else {
          logger.warn('PageSpeed API key not configured - skipping PageSpeed analysis');
        }

        // For production URLs with failed API calls, log the errors
        if (this.pageSpeedApiKey && !mobilePSI.success && !desktopPSI.success) {
          logger.warn('PageSpeed API calls failed for production URL');
          logger.warn('Mobile PSI error:', mobilePSI.error);
          logger.warn('Desktop PSI error:', desktopPSI.error);
        }
      }

      // Only fetch CrUX data if API key is configured
      if (this.cruxApiKey) {
        cruxData = await this.fetchCrUXData(tenantUrl);
      } else {
        logger.warn('CrUX API key not configured - skipping CrUX analysis');
      }

      // Calculate overall health score
      logger.info(`Calculating health score...`);
      logger.info(`Mobile PSI success: ${mobilePSI.success}, Desktop PSI success: ${desktopPSI.success}`);
      if (mobilePSI.success && mobilePSI.data) {
        logger.info(`Mobile performance score: ${mobilePSI.data.performance}`);
      }
      if (desktopPSI.success && desktopPSI.data) {
        logger.info(`Desktop performance score: ${desktopPSI.data.performance}`);
      }
      const healthScore = this.calculateHealthScore(mobilePSI, desktopPSI, cruxData);
      logger.info(`Health score calculated: ${healthScore}`);

      logger.info(`Generating health summary...`);
      const summary = this.generateHealthSummary(mobilePSI, desktopPSI, cruxData);
      logger.info(`Health summary generated`);

      return {
        success: true,
        data: {
          url: tenantUrl,
          timestamp: new Date().toISOString(),
          overallScore: healthScore,
          mobile: mobilePSI.success ? mobilePSI.data : null,
          desktop: desktopPSI.success ? desktopPSI.data : null,
          crux: cruxData.success ? cruxData.data : null,
          summary: summary,
          apiKeysConfigured: {
            pageSpeed: !!this.pageSpeedApiKey,
            crux: !!this.cruxApiKey
          }
        }
      };

    } catch (error) {
      logger.error('Website health analysis error:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause,
        tenantUrl: tenantUrl
      });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calculate overall health score from various metrics
   * @param {Object} mobilePSI - Mobile PageSpeed Insights data
   * @param {Object} desktopPSI - Desktop PageSpeed Insights data
   * @param {Object} cruxData - CrUX data
   * @returns {number} Overall health score (0-100)
   */
  calculateHealthScore(mobilePSI, desktopPSI, _cruxData) {
    let totalScore = 0;
    let scoreCount = 0;

    // Weight mobile performance more heavily (60% mobile, 40% desktop)
    if (mobilePSI.success && mobilePSI.data) {
      totalScore += mobilePSI.data.performance * 0.6;
      scoreCount += 0.6;
    }

    if (desktopPSI.success && desktopPSI.data) {
      totalScore += desktopPSI.data.performance * 0.4;
      scoreCount += 0.4;
    }

    return scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
  }

  /**
   * Check if a URL is a development/staging URL that might not be accessible to Google
   * @param {string} url - The URL to check
   * @returns {boolean} True if this appears to be a development URL
   */
  isDevelopmentUrl(url) {
    const developmentPatterns = [
      /localhost/i,
      /127\.0\.0\.1/i,
      /\.local/i,
      /\.dev/i,
      /\.test/i,
      /\.staging/i,
      /thatsmartsite\.com/i, // Your development domain
      /^http:\/\//i, // HTTP (not HTTPS) URLs
      /192\.168\./i, // Local network IPs
      /10\./i, // Local network IPs
      /172\.(1[6-9]|2[0-9]|3[0-1])\./i // Local network IPs
    ];
    
    return developmentPatterns.some(pattern => pattern.test(url));
  }

  /**
   * Convert development domain to localhost for Lighthouse analysis
   * @param {string} url - The original URL
   * @returns {string} The localhost equivalent
   */
  convertToLocalhost(url) {
    if (url.includes('thatsmartsite.com')) {
      return 'http://localhost:4173';
    }
    return url;
  }

  /**
   * Run Lighthouse locally with retry for mobile (more prone to timing issues)
   * @param {string} url - The URL to analyze
   * @param {string} strategy - 'mobile' or 'desktop'
   * @returns {Promise<Object>} Lighthouse results
   */
  async runLighthouseLocalWithRetry(url, strategy = 'mobile', maxRetries = 2) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.info(`Lighthouse ${strategy} analysis attempt ${attempt}/${maxRetries}`);
        const result = await this.runLighthouseLocal(url, strategy);
        if (result.success) {
          return result;
        }
        if (attempt < maxRetries) {
          logger.warn(`Lighthouse ${strategy} attempt ${attempt} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before retry
        }
      } catch (error) {
        logger.warn(`Lighthouse ${strategy} attempt ${attempt} failed: ${error.message || error.toString()}`);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before retry
        }
      }
    }
    
    // All attempts failed
    logger.error(`Lighthouse ${strategy} analysis failed after ${maxRetries} attempts`);
    return {
      success: false,
      error: `Lighthouse ${strategy} analysis failed after ${maxRetries} attempts`
    };
  }

  /**
   * Run Lighthouse locally for development URLs
   * @param {string} url - The URL to analyze
   * @param {string} strategy - 'mobile' or 'desktop'
   * @returns {Promise<Object>} Lighthouse results
   */
  async runLighthouseLocal(url, strategy = 'mobile') {
    let browser = null;
    try {
      logger.info(`Running Lighthouse locally for ${url} (${strategy}) with Puppeteer`);
      
      // Launch Chrome with Puppeteer
      logger.info('Launching Chrome with Puppeteer for Lighthouse analysis...');
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--disable-software-rasterizer'
        ],
      });
      
      const page = await browser.newPage();
      logger.info('Navigating to page and waiting for React to render...');
      
      // Load the page and wait for network to be idle
      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 120000 
      });
      
      // Wait for React to render real content
      logger.info('Waiting for React SPA to fully render...');
      
      // First, let's see what's actually in the root element
      const rootContent = await page.evaluate(() => {
        const root = document.querySelector('#root');
        return {
          exists: !!root,
          innerHTML: root ? root.innerHTML : 'null',
          innerText: root ? root.innerText : 'null',
          childrenCount: root ? root.children.length : 0
        };
      });
      
      logger.info('Root element debug info:', rootContent);
      
      // Try multiple wait conditions
      try {
        // Wait for any content in root (more lenient)
        await page.waitForFunction(() => {
          const root = document.querySelector('#root');
          return root && (root.children.length > 0 || root.innerText.trim().length > 10);
        }, { timeout: 30000 });
        logger.info('React content detected with lenient condition');
      } catch (error) {
        logger.warn('Lenient wait failed, trying to wait for any DOM changes...');
        
        // Even more lenient - just wait for any content
        try {
          await page.waitForFunction(() => {
            const root = document.querySelector('#root');
            return root && root.innerHTML !== '';
          }, { timeout: 15000 });
          logger.info('React content detected with very lenient condition');
        } catch (error2) {
          logger.warn('All wait conditions failed, waiting 10 seconds as fallback...');
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      }
      
      logger.info('Proceeding with Lighthouse analysis...');
      
      // Get Puppeteer's debugging port for Lighthouse
      const wsEndpoint = browser.wsEndpoint();
      const port = new URL(wsEndpoint).port;
      
      const options = {
        logLevel: 'error',
        output: 'json',
        port: parseInt(port),
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: strategy,
        screenEmulation: { 
          mobile: strategy === 'mobile',
          width: strategy === 'mobile' ? 375 : 1350,
          height: strategy === 'mobile' ? 667 : 940,
          deviceScaleFactor: 1,
          disabled: false
        },
        throttlingMethod: 'provided',
      };

      const config = { 
        extends: 'lighthouse:default',
        settings: {
          formFactor: strategy === 'mobile' ? 'mobile' : 'desktop',
          throttling: {
            rttMs: 40,
            throughputKbps: 10240,
            cpuSlowdownMultiplier: 1,
            requestLatencyMs: 0,
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0
          }
        }
      };
      
      // Run Lighthouse using the same Chrome instance
      const runnerResult = await lighthouse(url, options, config);
      
      if (runnerResult && runnerResult.lhr) {
        const lhr = runnerResult.lhr;
        
        // Debug logging
        logger.info(`Lighthouse analysis completed for ${url}`);
        logger.info(`Lighthouse finalUrl: ${lhr.finalUrl}`);
        
        const performanceScore = Math.round((lhr.categories.performance?.score || 0) * 100);
        const accessibilityScore = Math.round((lhr.categories.accessibility?.score || 0) * 100);
        const bestPracticesScore = Math.round((lhr.categories['best-practices']?.score || 0) * 100);
        const seoScore = Math.round((lhr.categories.seo?.score || 0) * 100);
        
        logger.info(`Calculated scores - Performance: ${performanceScore}, Accessibility: ${accessibilityScore}, Best Practices: ${bestPracticesScore}, SEO: ${seoScore}`);
        
        return {
          success: true,
          data: {
            performance: performanceScore,
            accessibility: accessibilityScore,
            bestPractices: bestPracticesScore,
            seo: seoScore,
            coreWebVitals: this.extractCoreWebVitals(lhr),
            metrics: this.extractMetrics(lhr),
            opportunities: this.extractOpportunities(lhr.audits),
            diagnostics: this.extractDiagnostics(lhr.audits),
            strategy: strategy,
            timestamp: new Date().toISOString(),
            source: 'lighthouse-local'
          }
        };
      }

      return {
        success: false,
        error: 'Lighthouse returned empty results'
      };

    } catch (error) {
      logger.error(`Lighthouse local analysis error: ${error.message || error.toString()}`);
      return {
        success: false,
        error: error.message || error.toString()
      };
    } finally {
      // Clean up browser instance
      if (browser) {
        try {
          await browser.close();
          logger.info('Chrome instance cleaned up successfully');
        } catch (killError) {
          // Don't throw the error, just log it - Chrome cleanup failures are common on Windows
          logger.warn(`Chrome cleanup failed (this is usually harmless): ${killError.message || killError.toString()}`);
        }
      }
    }
  }


  /**
   * Generate health summary with recommendations
   * @param {Object} mobilePSI - Mobile PageSpeed Insights data
   * @param {Object} desktopPSI - Desktop PageSpeed Insights data
   * @param {Object} cruxData - CrUX data
   * @returns {Object} Health summary
   */
  generateHealthSummary(mobilePSI, desktopPSI, _cruxData) {
    const summary = {
      status: 'good',
      priority: [],
      recommendations: []
    };

    // Check if API keys are configured
    if (!this.pageSpeedApiKey) {
      summary.status = 'warning';
      summary.priority.push('Google PageSpeed API key not configured');
      summary.recommendations.push({
        title: 'Configure Google PageSpeed API',
        description: 'Add GOOGLE_PAGESPEED_API_KEY to your environment variables to enable performance monitoring',
        savings: 0
      });
      return summary;
    }

    // Check if we're using Lighthouse local analysis
    if (mobilePSI.success && mobilePSI.data && mobilePSI.data.source === 'lighthouse-local') {
      summary.priority.push('Local Lighthouse analysis - Real metrics from your development site');
    }

    // Determine overall status
    const mobileScore = mobilePSI.success ? mobilePSI.data.performance : 0;
    const desktopScore = desktopPSI.success ? desktopPSI.data.performance : 0;

    if (mobileScore < 50 || desktopScore < 50) {
      summary.status = 'critical';
    } else if (mobileScore < 80 || desktopScore < 80) {
      summary.status = 'warning';
    }

    // Add priority items based on scores
    if (mobileScore < 80) {
      summary.priority.push('Mobile performance needs improvement');
    }
    if (desktopScore < 80) {
      summary.priority.push('Desktop performance needs improvement');
    }

    // Add recommendations from opportunities
    if (mobilePSI.success && mobilePSI.data.opportunities && mobilePSI.data.opportunities.length > 0) {
      summary.recommendations.push(...mobilePSI.data.opportunities.slice(0, 3));
    }

    return summary;
  }
}

// Create singleton instance
const healthMonitor = new HealthMonitor();

export default healthMonitor;
