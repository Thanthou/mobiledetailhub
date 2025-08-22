# Error Boundaries

This directory contains comprehensive error boundary components for handling React runtime errors gracefully.

## Components

### 1. ErrorBoundary (Class Component)
The main error boundary component that catches JavaScript errors anywhere in the child component tree.

**Usage:**
```tsx
import { ErrorBoundary } from '../shared';

<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {
    // Custom error handling logic
    console.log('Error caught:', error);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### 2. useErrorBoundary (Hook)
A hook-based error boundary for functional components.

**Usage:**
```tsx
import { useErrorBoundary } from '../shared';

const MyComponent = () => {
  const { hasError, error, handleError, resetError } = useErrorBoundary();

  if (hasError) {
    return (
      <div>
        <p>Something went wrong</p>
        <button onClick={resetError}>Try again</button>
      </div>
    );
  }

  return <YourContent />;
};
```

### 3. withErrorBoundary (HOC)
Higher-order component for wrapping components with error boundaries.

**Usage:**
```tsx
import { withErrorBoundary } from '../shared';

const WrappedComponent = withErrorBoundary(YourComponent, {
  fallback: <CustomErrorUI />,
  onError: (error, errorInfo) => {
    // Error handling
  }
});
```

### 4. withAsyncErrorBoundary (HOC)
Specialized HOC for components with async operations.

**Usage:**
```tsx
import { withAsyncErrorBoundary } from '../shared';

const WrappedComponent = withAsyncErrorBoundary(YourAsyncComponent);
```

## Features

- **Graceful Error Handling**: Catches runtime errors and displays user-friendly error messages
- **Custom Fallback UI**: Support for custom error UI components
- **Error Logging**: Built-in error logging with support for external services
- **Development Mode**: Enhanced error details in development environment
- **Global Error Handling**: Catches unhandled promise rejections and global errors
- **Recovery Options**: Provides refresh and retry mechanisms

## Best Practices

1. **Wrap Critical Components**: Use error boundaries around main app sections
2. **Custom Fallbacks**: Provide meaningful error messages for users
3. **Error Logging**: Implement proper error logging for production debugging
4. **Recovery Mechanisms**: Offer ways for users to recover from errors
5. **Granular Boundaries**: Use multiple error boundaries for different sections

## Integration Examples

### App-Level Error Boundary
```tsx
// App.tsx
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

### Route-Level Error Boundary
```tsx
<Route 
  path="/dashboard" 
  element={
    <ErrorBoundary fallback={<DashboardError />}>
      <Dashboard />
    </ErrorBoundary>
  } 
/>
```

### Component-Level Error Boundary
```tsx
const MyComponent = () => {
  return (
    <ErrorBoundary>
      <ComplexFeature />
    </ErrorBoundary>
  );
};
```

## Error Reporting

The error boundaries automatically log errors to the console. For production applications, consider integrating with:

- Sentry
- LogRocket
- Bugsnag
- Custom error reporting service

Example integration:
```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Send to external service
    Sentry.captureException(error, { extra: errorInfo });
  }}
>
  <YourComponent />
</ErrorBoundary>
```
