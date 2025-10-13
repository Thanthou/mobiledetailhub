/**
 * Health Monitoring Service
 * Monitors website performance, SEO, security, and uptime for tenant websites
 */

const axios = require('axios');
const logger = require('../utils/logger');

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

      // Only fetch PageSpeed data if API key is configured
      if (this.pageSpeedApiKey) {
        logger.info(`Fetching mobile PageSpeed data...`);
        mobilePSI = await this.fetchPageSpeedInsights(tenantUrl, 'mobile');
        logger.info(`Mobile PageSpeed data fetched`);
        
        logger.info(`Fetching desktop PageSpeed data...`);
        desktopPSI = await this.fetchPageSpeedInsights(tenantUrl, 'desktop');
        logger.info(`Desktop PageSpeed data fetched`);
      } else {
        logger.warn('PageSpeed API key not configured - skipping PageSpeed analysis');
      }

      // Only fetch CrUX data if API key is configured
      if (this.cruxApiKey) {
        cruxData = await this.fetchCrUXData(tenantUrl);
      } else {
        logger.warn('CrUX API key not configured - skipping CrUX analysis');
      }

      // Calculate overall health score
      logger.info(`Calculating health score...`);
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
      logger.error('Website health analysis error:', error.message);
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

module.exports = healthMonitor;
