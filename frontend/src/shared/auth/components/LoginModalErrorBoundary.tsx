import React from 'react';

interface LoginModalErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

// Enhanced error boundary for better error handling
class LoginModalErrorBoundary extends React.Component<
  LoginModalErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: LoginModalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LoginModal lazy loading error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default LoginModalErrorBoundary;
