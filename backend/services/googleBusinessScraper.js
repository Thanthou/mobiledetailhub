/**
 * Google Business Profile Scraper Service
 * Scrapes rating and review count from Google Business Profile pages
 */

import puppeteer from 'puppeteer';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('google-business-scraper');

class GoogleBusinessScraper {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      logger.info('Google Business Scraper initialized');
    } catch (error) {
      logger.error('Failed to initialize Google Business Scraper:', error);
      throw error;
    }
  }

  async scrapeBusinessProfile(gbpUrl) {
    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser.newPage();
    
    try {
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Set viewport
      await page.setViewport({ width: 1366, height: 768 });
      
      logger.info(`Scraping Google Business Profile: ${gbpUrl}`);
      
      // Navigate to the page and follow redirects
      await page.goto(gbpUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Get the final URL after redirects
      const finalUrl = page.url();
      logger.info(`Final URL after redirects: ${finalUrl}`);
      
      // Check if we ended up on a Google search results page
      if (finalUrl.includes('google.com/search')) {
        return {
          success: false,
          error: 'The Google Business Profile URL redirects to a search results page. This usually means the business profile is not publicly accessible or the share link is invalid.',
          urlType: 'Google Search Results (Redirected)',
          originalUrl: gbpUrl,
          finalUrl: finalUrl
        };
      }
      
      // Check if we hit Google's "sorry" page
      if (finalUrl.includes('google.com/sorry')) {
        return {
          success: false,
          error: 'Google blocked the request (likely due to bot detection). This is a temporary issue - try again later.',
          urlType: 'Google Blocked',
          originalUrl: gbpUrl,
          finalUrl: finalUrl
        };
      }

      // Wait for the page to load and try multiple selectors
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Try to extract rating and review count
      const scrapedData = await page.evaluate(() => {
        const result = {
          averageRating: null,
          totalReviews: null,
          businessName: null,
          debugInfo: {
            // eslint-disable-next-line no-undef -- Running in browser context via Puppeteer
            pageTitle: document.title,
            // eslint-disable-next-line no-undef -- Running in browser context via Puppeteer
            url: window.location.href,
            foundElements: []
          }
        };

        // Log all elements that might contain rating info
        // eslint-disable-next-line no-undef -- Running in browser context via Puppeteer
        const allElements = document.querySelectorAll('*');
        for (let i = 0; i < Math.min(allElements.length, 100); i++) {
          const el = allElements[i];
          const text = el.textContent || '';
          if (text.includes('star') || text.includes('rating') || text.match(/\d+\.?\d*\s*(?:star|rating)/i)) {
            result.debugInfo.foundElements.push({
              tag: el.tagName,
              text: text.substring(0, 100),
              className: el.className,
              id: el.id
            });
          }
        }

        // Multiple selectors for rating (Google changes these frequently)
        const ratingSelectors = [
          '[data-value]', // Common rating selector
          '.fontDisplayLarge', // Large font display for rating
          '[aria-label*="star"]', // ARIA label with star
          '.DU9Pgb', // Google's rating class
          '[jsaction*="rating"]', // JS action with rating
          '[aria-label*="rating"]',
          '.review-score',
          '.rating',
          '[data-test-id*="rating"]'
        ];

        // Try to find rating - more comprehensive approach
        for (const selector of ratingSelectors) {
          // eslint-disable-next-line no-undef -- Running in browser context via Puppeteer
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            const text = element.textContent || element.getAttribute('data-value') || element.getAttribute('aria-label') || '';
            const ratingMatch = text.match(/(\d+\.?\d*)/);
            if (ratingMatch) {
              const rating = parseFloat(ratingMatch[1]);
              if (rating >= 1 && rating <= 5) {
                result.averageRating = rating.toString();
                result.debugInfo.ratingFound = { selector, text, rating };
                break;
              }
            }
          }
          if (result.averageRating) {break;}
        }

        // Try to find review count - search through all elements for text containing "review"
        // eslint-disable-next-line no-undef -- Running in browser context via Puppeteer
        const reviewElements = document.querySelectorAll('*');
        for (const element of reviewElements) {
          const text = element.textContent || '';
          const reviewMatch = text.match(/(\d+)\s*(?:reviews?|review)/i);
          if (reviewMatch) {
            const count = parseInt(reviewMatch[1]);
            if (count > 0 && count < 100000) { // Reasonable range for review count
              result.totalReviews = reviewMatch[1];
              result.debugInfo.reviewCountFound = { 
                tagName: element.tagName, 
                className: element.className,
                text: text.substring(0, 100), 
                count: reviewMatch[1] 
              };
              break;
            }
          }
        }

        // Try to get business name
        const businessNameSelectors = [
          'h1',
          '[data-attrid="title"]',
          '.x3AX1-LfntMc-header-title-title',
          '.business-title',
          '.business-name'
        ];

        for (const selector of businessNameSelectors) {
          // eslint-disable-next-line no-undef -- Running in browser context via Puppeteer
          const element = document.querySelector(selector);
          if (element && element.textContent.trim()) {
            result.businessName = element.textContent.trim();
            result.debugInfo.businessNameFound = { selector, name: result.businessName };
            break;
          }
        }

        return result;
      });

      logger.info('Scraped data:', scrapedData);

      return {
        success: true,
        data: scrapedData
      };

    } catch (error) {
      logger.error('Error scraping Google Business Profile:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      await page.close();
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info('Google Business Scraper closed');
    }
  }
}

// Create a singleton instance
const scraper = new GoogleBusinessScraper();

export default scraper;
