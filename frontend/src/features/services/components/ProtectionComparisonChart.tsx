// src/components/ProtectionComparisonChart.tsx
import React from 'react';

// Define types locally to avoid import resolution issues
type MetricKey = 'protection' | 'longevity' | 'ease' | 'chipResistance';
type ProductKey = 'wax' | 'sealant' | 'ceramic' | 'ppf';
type Ratings = Record<ProductKey, Record<MetricKey, 1|2|3|4|5>>;

// Define constants locally with explicit types
const DEFAULT_RATINGS: Ratings = {
  wax:      { protection: 1, longevity: 1, ease: 2, chipResistance: 1 },
  sealant:  { protection: 2, longevity: 2, ease: 2, chipResistance: 1 },
  ceramic:  { protection: 4, longevity: 4, ease: 4, chipResistance: 1 },
  ppf:      { protection: 5, longevity: 5, ease: 3, chipResistance: 5 },
};

const METRIC_LABELS: Record<MetricKey, string> = {
  protection: 'Protection',
  longevity: 'Longevity',
  ease: 'Ease of Wash',
  chipResistance: 'Rock-Chip Resistance',
};

const PRODUCT_LABELS: Record<ProductKey, string> = {
  wax: 'Wax',
  sealant: 'Sealant',
  ceramic: 'Ceramic',
  ppf: 'PPF',
};

export interface ProtectionComparisonChartProps {
  ratings?: Ratings;
  title?: string;
  className?: string;
}

const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className = '' }) => (
  <svg 
    viewBox="0 0 16 16" 
    className={`w-4 h-4 ${className}`}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1"
  >
    <path d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" />
  </svg>
);

// Helper functions for type-safe access
const getProductLabel = (product: ProductKey): string => PRODUCT_LABELS[product];
const getMetricLabel = (metric: MetricKey): string => METRIC_LABELS[metric];

const RatingStars: React.FC<{ 
  rating: number; 
  product: ProductKey; 
  metric: MetricKey;
  className?: string;
}> = ({ rating, product, metric, className = '' }) => {
  return (
    <div 
      className={`flex items-center gap-1 ${className}`}
      role="img"
      aria-label={`${getProductLabel(product)} — ${getMetricLabel(metric)}: ${String(rating)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon 
          key={star}
          filled={star <= rating}
          className={star <= rating ? 'text-orange-500' : 'text-stone-600'}
        />
      ))}
      <span className="sr-only">{rating}/5</span>
    </div>
  );
};

export const ProtectionComparisonChart: React.FC<ProtectionComparisonChartProps> = ({
  ratings = DEFAULT_RATINGS,
  title = 'Protection Options Compared',
  className = ''
}) => {
  const metrics: MetricKey[] = ['protection', 'longevity', 'ease', 'chipResistance'];
  const products: ProductKey[] = ['wax', 'sealant', 'ceramic', 'ppf'];
  
  // Type-safe accessor for ratings
  const getRating = (product: ProductKey, metric: MetricKey): number => ratings[product][metric];

  return (
    <figure className={`rounded-2xl border border-stone-600 p-4 md:p-6 bg-stone-800 shadow-sm ${className}`}>
      <div className="mb-6 text-center">
        <figcaption className="text-lg md:text-xl font-semibold text-white">
          {title}
        </figcaption>
      </div>

      {/* Mobile: Stacked layout */}
      <div className="block md:hidden space-y-4">
        {metrics.map((metric) => (
          <div key={metric} className="border border-stone-600 rounded-lg p-3">
            <h3 className="text-sm font-medium text-white mb-3">
              {getMetricLabel(metric)}
            </h3>
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 min-w-0 flex-shrink-0 mr-3">
                    {getProductLabel(product)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <RatingStars 
                      rating={getRating(product, metric)} 
                      product={product} 
                      metric={metric}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:block">
        {/* Header row */}
        <div className="grid grid-cols-5 gap-6 mb-4">
          <div className="text-sm font-medium text-slate-400"></div>
          {products.map((product) => (
            <div 
              key={product}
              className="text-sm font-medium text-center text-white"
            >
              {getProductLabel(product)}
            </div>
          ))}
        </div>

        {/* Metric rows */}
        {metrics.map((metric) => (
          <div key={metric} className="grid grid-cols-5 gap-6 items-center py-3 border-b border-stone-600 last:border-b-0">
            <div className="text-sm font-medium text-slate-300">
              {getMetricLabel(metric)}
            </div>
            {products.map((product) => (
              <div key={product} className="flex justify-center">
                <RatingStars 
                  rating={getRating(product, metric)} 
                  product={product} 
                  metric={metric}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </figure>
  );
};
