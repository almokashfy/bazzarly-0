import React from 'react';
import { Loader2 } from 'lucide-react';

// Main loading spinner component
export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  text = '',
  overlay = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-500',
  };

  const spinner = (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
      />
      {text && (
        <span className={`ml-2 text-sm ${colorClasses[color]}`}>
          {text}
        </span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Page loading component
export const PageLoading = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-secondary-600 text-lg">{message}</p>
    </div>
  </div>
);

// Section loading component
export const SectionLoading = ({ message = 'Loading...', className = '' }) => (
  <div className={`flex items-center justify-center py-12 ${className}`}>
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-2 text-secondary-600">{message}</p>
    </div>
  </div>
);

// Inline loading component
export const InlineLoading = ({ text = 'Loading...', size = 'sm' }) => (
  <div className="flex items-center">
    <LoadingSpinner size={size} />
    <span className="ml-2 text-secondary-600 text-sm">{text}</span>
  </div>
);

// Button loading state
export const ButtonLoading = ({ children, loading = false, ...props }) => (
  <button {...props} disabled={loading || props.disabled}>
    {loading ? (
      <div className="flex items-center justify-center">
        <LoadingSpinner size="sm" color="white" />
        <span className="ml-2">Loading...</span>
      </div>
    ) : (
      children
    )}
  </button>
);

// Skeleton loading components
export const SkeletonBox = ({ width = 'full', height = '4', className = '' }) => (
  <div 
    className={`bg-secondary-200 animate-pulse rounded ${className}`}
    style={{ 
      width: typeof width === 'number' ? `${width}px` : width === 'full' ? '100%' : width,
      height: typeof height === 'number' ? `${height}px` : `${height}rem`
    }}
  />
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonBox 
        key={index}
        width={index === lines - 1 ? '75%' : 'full'}
        height="1"
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white rounded-lg border border-secondary-200 p-4 ${className}`}>
    <SkeletonBox height="48" className="mb-4" />
    <SkeletonBox height="1.5" className="mb-2" />
    <SkeletonText lines={2} />
    <div className="flex items-center justify-between mt-4">
      <SkeletonBox width="20" height="1.5" />
      <SkeletonBox width="16" height="1" />
    </div>
  </div>
);

export const SkeletonProductCard = ({ className = '' }) => (
  <div className={`card overflow-hidden ${className}`}>
    <SkeletonBox height="48" />
    <div className="p-4 space-y-3">
      <SkeletonBox height="1.5" />
      <SkeletonText lines={2} />
      <div className="flex items-center justify-between">
        <SkeletonBox width="24" height="2" />
        <SkeletonBox width="16" height="1" />
      </div>
      <div className="flex items-center justify-between">
        <SkeletonBox width="32" height="1" />
        <SkeletonBox width="20" height="1" />
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ items = 6, renderItem: RenderItem = SkeletonCard }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <RenderItem key={index} />
    ))}
  </div>
);

export const SkeletonGrid = ({ 
  items = 8, 
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  renderItem: RenderItem = SkeletonProductCard 
}) => (
  <div className={`grid ${columns} gap-6`}>
    {Array.from({ length: items }).map((_, index) => (
      <RenderItem key={index} />
    ))}
  </div>
);

// Loading states for specific components
export const ProductListSkeleton = () => (
  <SkeletonGrid 
    items={12}
    columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    renderItem={SkeletonProductCard}
  />
);

export const CategoryGridSkeleton = () => (
  <SkeletonGrid 
    items={6}
    columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
    renderItem={() => (
      <div className="card p-6 text-center">
        <SkeletonBox height="32" className="mb-4" />
        <SkeletonBox height="1.5" className="mb-1" />
        <SkeletonBox width="50%" height="1" />
      </div>
    )}
  />
);

export const HeaderSkeleton = () => (
  <header className="bg-white shadow-lg">
    <div className="bg-secondary-200 animate-pulse h-8" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-4">
        <SkeletonBox width="32" height="10" />
        <SkeletonBox width="96" height="12" className="hidden md:block" />
        <div className="flex items-center space-x-4">
          <SkeletonBox width="6" height="6" className="rounded-full" />
          <SkeletonBox width="6" height="6" className="rounded-full" />
          <SkeletonBox width="6" height="6" className="rounded-full" />
        </div>
      </div>
    </div>
    <div className="bg-secondary-100 h-12" />
  </header>
);

// Loading wrapper component
export const LoadingWrapper = ({ 
  loading, 
  error, 
  children, 
  loadingComponent: LoadingComponent = SectionLoading,
  errorComponent: ErrorComponent = null,
  retryAction = null 
}) => {
  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    if (ErrorComponent) {
      return <ErrorComponent error={error} retry={retryAction} />;
    }
    
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-secondary-800 mb-2">
          Something went wrong
        </h3>
        <p className="text-secondary-600 mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        {retryAction && (
          <button onClick={retryAction} className="btn-primary">
            Try Again
          </button>
        )}
      </div>
    );
  }

  return children;
};

export default LoadingSpinner; 