# Tenant Dashboard Data Bridge

This document describes the tenant dashboard data bridge implementation that provides aggregated analytics endpoints for tenant dashboards.

## Overview

The tenant dashboard data bridge combines data from multiple services (bookings, reviews, performance metrics, etc.) into comprehensive analytics endpoints that power tenant dashboards. This eliminates the need for frontend applications to make multiple API calls and handle data aggregation.

## Architecture

### Backend Components

1. **Tenant Analytics Service** (`backend/services/tenantAnalyticsService.js`)
   - Core service that aggregates data from multiple sources
   - Provides functions for different analytics categories
   - Handles data transformation and calculation

2. **Tenant Dashboard Controller** (`backend/controllers/tenantDashboardController.js`)
   - HTTP request/response handling
   - Input validation and error handling
   - Response formatting using shared contract

3. **Tenant Dashboard Routes** (`backend/routes/tenantDashboard.js`)
   - RESTful API endpoints
   - Middleware integration for authentication and tenant validation
   - Route-specific documentation

### Frontend Components

1. **Dashboard API Client** (`frontend/src/shared/api/tenantDashboardApi.ts`)
   - TypeScript client for dashboard API calls
   - Type definitions for all dashboard data structures
   - Error handling and response validation

2. **Dashboard Hooks** (`frontend/src/shared/hooks/useTenantDashboard.ts`)
   - React Query integration for caching and state management
   - Specialized hooks for different dashboard sections
   - Loading and error state management

## API Endpoints

### Base URL: `/api/dashboard/:tenantSlug`

All endpoints require authentication and tenant context validation.

#### GET `/dashboard`
**Comprehensive Dashboard Analytics**

Returns complete dashboard data including overview, reviews, performance, activity, and services.

**Query Parameters:**
- `dateRange`: 7d, 30d, 90d, 1y (default: 30d)
- `includeDetails`: true/false (default: false)

**Response Structure:**
```typescript
{
  success: boolean;
  data: {
    tenant: { id, dateRange, generatedAt };
    overview: TenantOverview;
    reviews: ReviewAnalytics;
    performance: PerformanceAnalytics;
    activity: ActivityAnalytics;
    services: ServiceAnalytics;
    summary: DashboardSummary;
    meta: { requestId, generatedAt, tenantSlug, dateRange, includeDetails };
  };
}
```

#### GET `/dashboard/overview`
**Basic Tenant Overview Statistics**

Returns essential tenant metrics and KPIs.

**Query Parameters:**
- `dateRange`: 7d, 30d, 90d, 1y (default: 30d)

#### GET `/dashboard/reviews`
**Detailed Review Analytics**

Returns review distribution, recent reviews, and trends.

**Query Parameters:**
- `dateRange`: 7d, 30d, 90d, 1y (default: 30d)
- `limit`: Number of recent reviews (default: 10)
- `offset`: Pagination offset (default: 0)

#### GET `/dashboard/performance`
**Performance Analytics**

Returns website performance metrics, SEO scores, and social media engagement.

**Query Parameters:**
- `dateRange`: 7d, 30d, 90d, 1y (default: 30d)

#### GET `/dashboard/activity`
**Recent Activity Summary**

Returns timeline of recent activities and engagement metrics.

**Query Parameters:**
- `dateRange`: 7d, 30d, 90d, 1y (default: 30d)
- `limit`: Number of activities (default: 20)

## Data Sources

### Current Integration

1. **Reviews Data** (`reputation.reviews` table)
   - Review counts and ratings
   - Review distribution by rating
   - Recent reviews with details
   - Review trends over time

2. **Tenant Data** (`tenants.business` table)
   - Basic tenant information
   - Service areas and configuration
   - Business metrics and status

3. **Services Data** (`tenants.services` table)
   - Service categories and counts
   - Active vs total services
   - Service performance metrics

### Future Integration Points

1. **Booking Data** (when booking system is implemented)
   - Booking counts and revenue
   - Service popularity metrics
   - Customer retention rates

2. **Performance Monitoring** (when monitoring is implemented)
   - Website performance metrics
   - Core Web Vitals
   - SEO scores and rankings

3. **Analytics Data** (when analytics integration is complete)
   - Page views and traffic
   - Conversion rates
   - User engagement metrics

## Frontend Usage

### Basic Dashboard Hook

```typescript
import { useTenantDashboard } from '@/shared/hooks/useTenantDashboard';

function DashboardPage() {
  const { data: dashboard, isLoading, error } = useTenantDashboard({
    dateRange: '30d',
    includeDetails: true
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>{dashboard.overview.businessName}</h1>
      <p>Rating: {dashboard.overview.averageRating}/5</p>
      <p>Health Score: {dashboard.summary.overallHealth}%</p>
    </div>
  );
}
```

### Specialized Hooks

```typescript
import { 
  useTenantOverview, 
  useTenantReviews, 
  useDashboardHealth 
} from '@/shared/hooks/useTenantDashboard';

function OverviewSection() {
  const { data: overview } = useTenantOverview('30d');
  const { healthScore, recommendations } = useDashboardHealth('30d');
  const { data: reviews } = useTenantReviews({ dateRange: '30d', limit: 5 });

  return (
    <div>
      <OverviewStats data={overview} />
      <HealthScore score={healthScore} />
      <RecentReviews reviews={reviews?.recentReviews} />
      <Recommendations items={recommendations} />
    </div>
  );
}
```

### Refresh and Cache Management

```typescript
import { useRefreshDashboard } from '@/shared/hooks/useTenantDashboard';

function DashboardControls() {
  const { refreshAll, refreshByDateRange } = useRefreshDashboard();

  return (
    <div>
      <button onClick={refreshAll}>Refresh All Data</button>
      <button onClick={() => refreshByDateRange('7d')}>Refresh 7 Days</button>
      <button onClick={() => refreshByDateRange('30d')}>Refresh 30 Days</button>
    </div>
  );
}
```

## Performance Considerations

### Caching Strategy

- **Overview Data**: 10 minutes cache (changes infrequently)
- **Review Data**: 5 minutes cache (moderate change frequency)
- **Activity Data**: 2 minutes cache (changes frequently)
- **Performance Data**: 15 minutes cache (changes slowly)

### Data Aggregation

- All analytics queries are executed in parallel using `Promise.all()`
- Database queries are optimized with proper indexing
- Response data is transformed and cached at the service level

### Error Handling

- Graceful degradation when individual data sources fail
- Comprehensive error logging with correlation IDs
- Standardized error response format

## Security and Validation

### Authentication
- All endpoints require valid authentication token
- Tenant context validation ensures users can only access their own data

### Authorization
- Admin users can access any tenant's dashboard
- Regular users can only access their own tenant's dashboard
- Tenant approval status validation

### Input Validation
- Date range validation (only allowed values)
- Pagination parameter validation
- Tenant slug validation through middleware

## Monitoring and Logging

### Request Logging
- All dashboard requests are logged with correlation IDs
- Performance metrics are tracked (response time, data points)
- Error rates and types are monitored

### Analytics Logging
- Dashboard generation is logged for audit purposes
- Data source failures are logged with details
- Cache hit/miss ratios are tracked

## Future Enhancements

### Real-time Updates
- WebSocket integration for live dashboard updates
- Push notifications for important metric changes
- Real-time activity feeds

### Advanced Analytics
- Machine learning insights and predictions
- Comparative analytics (industry benchmarks)
- Custom metric definitions

### Export and Reporting
- PDF report generation
- CSV data export
- Scheduled report delivery

### Integration Expansion
- CRM system integration
- Email marketing analytics
- Social media performance tracking
- Third-party review platform integration

## Testing

### Unit Tests
- Service layer functions with mock data
- Controller validation and error handling
- Hook behavior with various states

### Integration Tests
- End-to-end API testing with real database
- Frontend hook integration testing
- Performance testing with large datasets

### Load Testing
- Concurrent dashboard requests
- Database query performance under load
- Memory usage with large datasets
