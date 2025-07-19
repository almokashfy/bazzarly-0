import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import config from '../config/config';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2),
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (config.ENVIRONMENT === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Here you would typically log to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    if (config.SERVICES.SENTRY_DSN) {
      // Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent, showDetails = false } = this.props;

      // Custom fallback component
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            retry={this.handleRetry}
            reload={this.handleReload}
          />
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            </div>
            
            <h1 className="text-xl font-semibold text-secondary-800 mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-secondary-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </p>

            {showDetails && config.ENVIRONMENT === 'development' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="font-medium text-red-800 mb-2">Error Details:</h3>
                <p className="text-sm text-red-700 mb-2">
                  <strong>Error:</strong> {this.state.error?.toString()}
                </p>
                <p className="text-sm text-red-700">
                  <strong>Error ID:</strong> {this.state.errorId}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <details className="mt-2">
                    <summary className="text-sm font-medium text-red-800 cursor-pointer">
                      Component Stack
                    </summary>
                    <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 btn-primary flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="flex-1 btn-secondary flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-secondary-200">
              <Link
                to="/"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm"
              >
                <Home className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
            </div>

            {this.state.errorId && (
              <p className="mt-4 text-xs text-secondary-500">
                Error ID: {this.state.errorId}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Async error boundary for handling async errors
export class AsyncErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Async Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">Something went wrong</h3>
          <p className="text-red-600 text-sm mt-1">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 