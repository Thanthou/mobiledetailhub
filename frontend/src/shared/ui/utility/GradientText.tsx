import { ReactNode } from 'react';

export interface GradientTextProps {
  children: ReactNode;
  /**
   * Variant of the gradient effect
   * - 'cyan-purple': Simple cyan to purple gradient (used in header logo)
   * - 'shimmer': Animated shimmer effect with blue/cyan/teal colors (used in section titles)
   */
  variant?: 'cyan-purple' | 'shimmer';
  /**
   * Custom color array for multi-color gradients with equal distribution
   * When provided, overrides the variant prop
   * @example ['#EA4335', '#4285F4', '#FBBC04', '#34A853'] for Google colors
   */
  colors?: string[];
  /**
   * Additional CSS classes to apply to the span
   */
  className?: string;
  /**
   * HTML element to render (defaults to 'span')
   */
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

/**
 * GradientText component - Applies a gradient text effect with background-clip
 * 
 * @example
 * ```tsx
 * <GradientText variant="cyan-purple">That Smart Site</GradientText>
 * <GradientText variant="shimmer">Smart</GradientText>
 * <GradientText colors={['#EA4335', '#4285F4', '#FBBC04', '#34A853']}>Google</GradientText>
 * ```
 */
export default function GradientText({
  children,
  variant = 'cyan-purple',
  colors,
  className = '',
  as: Component = 'span',
}: GradientTextProps) {
  const variantClasses = {
    'cyan-purple': 'bg-gradient-to-r from-cyan-400 to-purple-400',
    'shimmer': 'bg-gradient-to-r from-blue-400 via-white via-cyan-300 via-white to-teal-400 animate-shimmer bg-[length:200%_auto]',
  };

  // Generate custom gradient from colors array with equal distribution
  const generateCustomGradient = (colorArray: string[]) => {
    if (colorArray.length === 0) return '';
    if (colorArray.length === 1) return colorArray[0];
    
    const step = 100 / (colorArray.length - 1);
    const stops = colorArray.map((color, index) => {
      const position = index * step;
      return `${color} ${position}%`;
    });
    
    return `linear-gradient(to right, ${stops.join(', ')})`;
  };

  // If custom colors are provided, use them; otherwise use variant
  const style = colors && colors.length > 0 
    ? { 
        backgroundImage: generateCustomGradient(colors),
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    : undefined;

  const gradientClass = !colors ? variantClasses[variant] : '';

  return (
    <Component
      className={`${!colors ? gradientClass : ''} ${colors ? '' : 'bg-clip-text text-transparent'} ${className}`.trim()}
      style={style}
    >
      {children}
    </Component>
  );
}

