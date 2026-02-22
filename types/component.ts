/**
 * JSON-based UI Component Schema System
 * Defines TypeScript types for dynamic component rendering
 */

export type ComponentType = 
  // Container Components
  | 'Card'
  | 'Carousel'
  | 'Grid'
  | 'Row'
  | 'Column'
  // Content Components
  | 'Text'
  | 'Title'
  | 'Caption'
  | 'Image'
  | 'Badge'
  | 'Divider'
  | 'Spacer'
  // Interactive Components
  | 'Button'
  | 'QuantitySelector'
  | 'IconButton';

export interface ComponentSchema {
  type: ComponentType;
  props?: Record<string, any>;
  children?: ComponentSchema[];
}

export interface ActionSchema {
  type: 'add_to_cart' | 'remove_from_cart' | 'view_details' | 'message' | 'navigate';
  payload?: Record<string, any>;
}

// Specific prop types for type safety
export interface CardProps {
  variant?: 'default' | 'subtle' | 'outline';
  padding?: string;
  className?: string;
}

export interface CarouselProps {
  showArrows?: boolean;
  showDots?: boolean;
  slidesToShow?: number;
  gap?: string;
  className?: string;
}

export interface GridProps {
  columns?: number;
  gap?: string;
  className?: string;
}

export interface RowProps {
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  align?: 'start' | 'end' | 'center' | 'stretch';
  gap?: string;
  wrap?: boolean;
  className?: string;
}

export interface ColumnProps {
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  align?: 'start' | 'end' | 'center' | 'stretch';
  gap?: string;
  padding?: string;
  className?: string;
}

export interface TextProps {
  text: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'accent';
  className?: string;
}

export interface TitleProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export interface CaptionProps {
  text: string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  fit?: 'cover' | 'contain' | 'fill' | 'none';
  fallback?: string;
  className?: string;
}

export interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'secondary';
  icon?: 'leaf' | 'flame' | 'star' | 'check' | 'clock';
  className?: string;
}

export interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  action?: ActionSchema;
  className?: string;
}

export interface QuantitySelectorProps {
  id: string;
  min?: number;
  max?: number;
  default?: number;
  className?: string;
}

export interface IconButtonProps {
  icon: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  action?: ActionSchema;
  className?: string;
}

export interface DividerProps {
  className?: string;
}

export interface SpacerProps {
  height?: string;
  className?: string;
}
