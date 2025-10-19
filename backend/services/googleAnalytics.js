import { getPool } from '../database/pool.js';
import { logger } from '../config/logger.js';

/**
 * Google Analytics Data Service
 * Handles fetching analytics data from GA4 using stored OAuth tokens
 */

/**
 * Get stored tokens for a tenant
 */
async function getStoredTokens(tenantId) {
  try {
    const result = await pool.query(
      'SELECT access_token, refresh_token, expires_at, property_id, scopes FROM analytics.google_analytics_tokens WHERE tenant_id = $1',
      [tenantId]
    );

    if (result.rows.length === 0) {
      throw new Error('No Google Analytics tokens found for tenant');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Error getting stored tokens:', error);
    throw error;
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(refreshToken) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const tokenData = await response.json();
    return tokenData.access_token;
  } catch (error) {
    logger.error('Error refreshing access token:', error);
    throw error;
  }
}

/**
 * Update stored access token in database
 */
async function updateStoredToken(tenantId, newAccessToken, expiresIn) {
  try {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    await pool.query(
      'UPDATE analytics.google_analytics_tokens SET access_token = $1, expires_at = $2, updated_at = NOW() WHERE tenant_id = $3',
      [newAccessToken, expiresAt, tenantId]
    );

    logger.info('Updated access token for tenant', { tenantId });
  } catch (error) {
    logger.error('Error updating stored token:', error);
    throw error;
  }
}

/**
 * Get valid access token (refresh if needed)
 */
async function getValidAccessToken(tenantId) {
  const tokens = await getStoredTokens(tenantId);
  const { access_token, refresh_token, expires_at } = tokens;

  // Check if token is expired or expires within 5 minutes
  const now = new Date();
  const expiresAt = new Date(expires_at);
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

  if (expiresAt <= fiveMinutesFromNow) {
    logger.info('Access token expired or expiring soon, refreshing...', { tenantId });
    
    if (!refresh_token) {
      throw new Error('No refresh token available - tenant needs to re-authenticate');
    }

    const tokenData = await refreshAccessToken(refresh_token);
    await updateStoredToken(tenantId, tokenData.access_token, tokenData.expires_in);
    
    return tokenData.access_token;
  }

  return access_token;
}

/**
 * Get GA4 property ID for tenant
 */
async function getGA4PropertyId(tenantId) {
  try {
    const tokens = await getStoredTokens(tenantId);
    let propertyId = tokens.property_id;

    // If no property ID stored, try to fetch it
    if (!propertyId || propertyId === 'unknown') {
      const accessToken = await getValidAccessToken(tenantId);
      
      const response = await fetch(
        'https://analyticsadmin.googleapis.com/v1beta/accounts',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.accounts && data.accounts.length > 0) {
          propertyId = data.accounts[0].name; // First account
          
          // Update the stored property ID
          await pool.query(
            'UPDATE analytics.google_analytics_tokens SET property_id = $1 WHERE tenant_id = $2',
            [propertyId, tenantId]
          );
        }
      }
    }

    return propertyId;
  } catch (error) {
    logger.error('Error getting GA4 property ID:', error);
    throw error;
  }
}

/**
 * Fetch analytics summary data from GA4
 */
async function getAnalyticsSummary(tenantId, days = 7) {
  try {
    const accessToken = await getValidAccessToken(tenantId);
    const propertyId = await getGA4PropertyId(tenantId);

    if (!propertyId) {
      throw new Error('No Google Analytics property found');
    }

    // Extract property ID from full path (e.g., "accounts/123456789" -> "123456789")
    const propertyIdOnly = propertyId.replace('accounts/', '');

    const endDate = new Date().toISOString().split('T')[0]; // Today
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // N days ago

    const requestBody = {
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' }
      ],
      dimensions: [
        { name: 'date' }
      ],
      dateRanges: [
        {
          startDate: startDate,
          endDate: endDate
        }
      ],
      orderBys: [
        {
          dimension: { dimensionName: 'date' }
        }
      ]
    };

    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyIdOnly}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('GA4 API error:', { status: response.status, error: errorText });
      throw new Error(`GA4 API error: ${response.status}`);
    }

    const data = await response.json();

    // Process the data into a more usable format
    const summary = {
      totalSessions: 0,
      totalUsers: 0,
      totalPageViews: 0,
      averageBounceRate: 0,
      averageSessionDuration: 0,
      dailyData: [],
      period: `${days} days`,
      lastUpdated: new Date().toISOString()
    };

    if (data.rows && data.rows.length > 0) {
      let totalBounceRate = 0;
      let totalSessionDuration = 0;
      let dayCount = 0;

      data.rows.forEach(row => {
        const date = row.dimensionValues[0].value;
        const sessions = parseInt(row.metricValues[0].value) || 0;
        const users = parseInt(row.metricValues[1].value) || 0;
        const pageViews = parseInt(row.metricValues[2].value) || 0;
        const bounceRate = parseFloat(row.metricValues[3].value) || 0;
        const sessionDuration = parseFloat(row.metricValues[4].value) || 0;

        summary.totalSessions += sessions;
        summary.totalUsers += users;
        summary.totalPageViews += pageViews;
        totalBounceRate += bounceRate;
        totalSessionDuration += sessionDuration;
        dayCount++;

        summary.dailyData.push({
          date,
          sessions,
          users,
          pageViews,
          bounceRate,
          sessionDuration
        });
      });

      summary.averageBounceRate = dayCount > 0 ? totalBounceRate / dayCount : 0;
      summary.averageSessionDuration = dayCount > 0 ? totalSessionDuration / dayCount : 0;
    }

    logger.info('Analytics summary fetched successfully', { 
      tenantId, 
      totalSessions: summary.totalSessions,
      totalUsers: summary.totalUsers 
    });

    return summary;

  } catch (error) {
    logger.error('Error fetching analytics summary:', error);
    throw error;
  }
}

/**
 * Get real-time analytics data
 */
async function getRealtimeData(tenantId) {
  try {
    const accessToken = await getValidAccessToken(tenantId);
    const propertyId = await getGA4PropertyId(tenantId);

    if (!propertyId) {
      throw new Error('No Google Analytics property found');
    }

    const propertyIdOnly = propertyId.replace('accounts/', '');

    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyIdOnly}:runRealtimeReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: [
            { name: 'activeUsers' }
          ],
          dimensions: [
            { name: 'country' }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('GA4 Realtime API error:', { status: response.status, error: errorText });
      throw new Error(`GA4 Realtime API error: ${response.status}`);
    }

    const data = await response.json();

    const realtimeData = {
      activeUsers: 0,
      countries: [],
      lastUpdated: new Date().toISOString()
    };

    if (data.rows && data.rows.length > 0) {
      data.rows.forEach(row => {
        const country = row.dimensionValues[0].value;
        const users = parseInt(row.metricValues[0].value) || 0;
        
        realtimeData.activeUsers += users;
        realtimeData.countries.push({ country, users });
      });
    }

    return realtimeData;

  } catch (error) {
    logger.error('Error fetching realtime data:', error);
    throw error;
  }
}

export {
  getAnalyticsSummary,
  getRealtimeData,
  getValidAccessToken,
  getGA4PropertyId
};
