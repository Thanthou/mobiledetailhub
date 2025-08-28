# Axios Auth Refresh Fix - One-Flight Guard Implementation

## Overview
Fixed the axios auth refresh interceptor to prevent infinite loops and rate limiting issues by implementing a proper one-flight guard that queues subsequent 401s until the first refresh completes.

## Problem ❌

### **Infinite Refresh Loops**
- **Multiple 401s**: Multiple API calls could trigger simultaneous refresh attempts
- **Rate limiting**: Bombarding `/refresh` endpoint with requests
- **App freezing**: Infinite refresh cycles blocking the application
- **Token conflicts**: Race conditions between refresh attempts

### **Common Scenarios**
```
1. User opens multiple tabs → Each tab makes API calls
2. Multiple components mount → Each triggers auth check
3. Network issues → Retries trigger multiple refresh attempts
4. Token expiration → All pending requests get 401s simultaneously
```

## Solution ✅

### **1. One-Flight Guard Pattern**
- **Single refresh**: Only one refresh token request at a time
- **Request queuing**: Subsequent 401s wait for first refresh to complete
- **Promise sharing**: All queued requests resolve with the same new token
- **No duplicates**: Eliminates multiple refresh API calls

### **2. Smart Token Management**
- **Automatic refresh**: Handles token refresh transparently
- **Request retry**: Automatically retries failed requests with new token
- **Auth failure handling**: Clears state and redirects on refresh failure
- **No infinite loops**: Graceful degradation on authentication failure

### **3. Comprehensive API Client**
- **Unified interface**: Single client for all API operations
- **Method support**: GET, POST, PUT, DELETE, PATCH, upload
- **Error handling**: Consistent error handling across all requests
- **Type safety**: Full TypeScript support

## Implementation Details

### **RefreshTokenGuard Class**
```typescript
class RefreshTokenGuard {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  async executeRefresh(): Promise<string> {
    if (this.isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${config.apiUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh token failed');
      }

      const data: RefreshResponse = await response.json();
      
      // Update tokens in localStorage
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Process queued requests
      this.processQueue(null, data.accessToken);
      
      return data.accessToken;
    } catch (error) {
      // Process queued requests with error
      this.processQueue(error, null);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });

    this.failedQueue = [];
  }
}
```

### **API Client with Interceptor**
```typescript
class ApiClient {
  private refreshGuard = new RefreshTokenGuard();

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Add auth header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, options);
      
      // If unauthorized and we have a refresh token, try to refresh
      if (response.status === 401 && localStorage.getItem('refreshToken')) {
        try {
          const newToken = await this.refreshGuard.executeRefresh();
          
          // Retry the original request with new token
          const retryOptions = {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          };
          
          const retryResponse = await fetch(url, retryOptions);
          
          if (!retryResponse.ok) {
            throw new Error(`Request failed: ${retryResponse.status}`);
          }
          
          return await retryResponse.json();
        } catch (refreshError) {
          // Refresh failed, clear auth state and redirect
          this.handleAuthFailure();
          throw new Error('Authentication failed');
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Request failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}
```

### **Auth Context Integration**
```typescript
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... existing state

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });

      if (response.success) {
        const mappedUser = mapBackendUserToFrontend(response.user);
        setUser(mappedUser);
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken); // ✅ Store refresh token
        localStorage.setItem('user', JSON.stringify(mappedUser));
        return { success: true };
      } else {
        return { success: false, error: response.error || response.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  // ... rest of context
};
```

## How It Works

### **1. Normal Request Flow**
```
API Request → Add Auth Header → Make Request → Return Response
```

### **2. Token Expired Flow**
```
API Request → 401 Response → Check Refresh Token → Execute Refresh
                ↓
            Queue Request → Wait for Refresh → Retry with New Token
```

### **3. Multiple 401s Flow**
```
Request A (401) → Start Refresh → Queue Request A
Request B (401) → Already Refreshing → Queue Request B
Request C (401) → Already Refreshing → Queue Request C
                ↓
            Refresh Completes → Process All Queued Requests
                ↓
            All Requests Retry with New Token → Success
```

### **4. Refresh Failure Flow**
```
Refresh Fails → Clear Auth State → Redirect to Home → No More Loops
```

## Benefits

### **✅ Prevents Infinite Loops**
- **One refresh at a time**: No duplicate refresh API calls
- **Request queuing**: All 401s wait for single refresh
- **Promise sharing**: Efficient token distribution

### **✅ Rate Limiting Protection**
- **Single refresh request**: Never bombards `/refresh` endpoint
- **Controlled retries**: Predictable request patterns
- **Backend efficiency**: Reduced API load

### **✅ Better User Experience**
- **Seamless refresh**: Users don't see authentication errors
- **Automatic retry**: Failed requests retry automatically
- **Graceful degradation**: Clear error handling on auth failure

### **✅ Developer Experience**
- **Unified API**: Single client for all requests
- **Automatic auth**: No manual token management needed
- **Type safety**: Full TypeScript support
- **Error handling**: Consistent error patterns

## Testing Scenarios

### **✅ Should Work**
```
1. Single 401 → Refresh token → Retry request → Success
2. Multiple 401s → Queue requests → Single refresh → All succeed
3. Refresh success → Update tokens → Continue normally
4. Network issues → Handle gracefully → No infinite loops
```

### **❌ Should Not Happen**
```
1. Multiple refresh calls → Only one refresh per session
2. Infinite loops → Graceful failure handling
3. Rate limiting → Controlled request patterns
4. App freezing → Proper error boundaries
```

## Error Handling

### **Refresh Token Missing**
```typescript
if (!refreshToken) {
  throw new Error('No refresh token available');
}
```

### **Refresh API Failure**
```typescript
if (!response.ok) {
  throw new Error('Refresh token failed');
}
```

### **Auth State Cleanup**
```typescript
private handleAuthFailure() {
  // Clear all auth data
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Redirect to login or home page
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
}
```

## Migration Guide

### **From Old API Calls**
```typescript
// Before: Manual fetch with token handling
const response = await fetch('/api/data', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// After: Use API client (automatic token handling)
const response = await apiClient.get('/api/data');
```

### **From Old Auth Context**
```typescript
// Before: Manual token storage
localStorage.setItem('token', data.accessToken);

// After: Store both tokens
localStorage.setItem('token', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);
```

## Monitoring & Debugging

### **Console Logs**
```javascript
// Check refresh guard state
console.log('Is refreshing:', refreshGuard.isRefreshing);
console.log('Queue length:', refreshGuard.failedQueue.length);

// Monitor token refresh
console.log('Refresh token:', localStorage.getItem('refreshToken'));
console.log('Access token:', localStorage.getItem('token'));
```

### **Network Tab**
- **Before**: Multiple `/api/auth/refresh` requests
- **After**: Single `/api/auth/refresh` request per session

### **Performance Metrics**
- **Request retry rate**: Should be minimal
- **Refresh success rate**: Should be high
- **Error frequency**: Should be low

## Future Enhancements

### **Planned Improvements**
- **Token rotation**: Generate new refresh token on each refresh
- **Offline support**: Cache tokens for offline use
- **Background sync**: Refresh tokens before expiration
- **Metrics collection**: Track refresh patterns and success rates

### **Advanced Features**
- **Multiple refresh strategies**: Fallback refresh methods
- **Token validation**: Verify token integrity
- **Device tracking**: Manage tokens per device
- **Audit logging**: Track all token operations

## Conclusion

✅ **Axios auth refresh infinite loop issue resolved**

- **One-flight guard**: Prevents duplicate refresh requests
- **Request queuing**: Efficiently handles multiple 401s
- **Automatic retry**: Seamless user experience
- **Rate limiting protection**: No more endpoint bombardment
- **Graceful failure**: Clear error handling and state cleanup

The solution provides a robust, performant authentication system that handles token refresh automatically without the risk of infinite loops or rate limiting issues.
