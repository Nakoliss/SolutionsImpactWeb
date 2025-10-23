/**
 * Image optimization utilities for AI Web Agency
 * Provides consistent image handling across the application
 */

export interface ImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  sizes?: string;
}

/**
 * Standard image configurations for different use cases
 */
export const imageConfigs = {
  hero: {
    quality: 90,
    priority: true,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
  },
  card: {
    quality: 85,
    priority: false,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px',
  },
  thumbnail: {
    quality: 80,
    priority: false,
    sizes: '(max-width: 768px) 50vw, 200px',
  },
  logo: {
    quality: 95,
    priority: true,
    sizes: '200px',
  },
  avatar: {
    quality: 85,
    priority: false,
    sizes: '(max-width: 768px) 80px, 120px',
  },
  fullWidth: {
    quality: 85,
    priority: false,
    sizes: '100vw',
  },
};

/**
 * Recommended image dimensions for different use cases
 */
export const imageDimensions = {
  hero: { width: 1200, height: 630 },
  card: { width: 400, height: 250 },
  thumbnail: { width: 200, height: 200 },
  logo: { width: 200, height: 60 },
  avatar: { width: 120, height: 120 },
  fullWidth: { width: 1920, height: 1080 },
  og: { width: 1200, height: 630 },
  favicon: { width: 32, height: 32 },
};

/**
 * Generate optimized image props for different use cases
 */
export function getImageProps(
  type: keyof typeof imageConfigs,
  overrides: Partial<ImageConfig> = {}
): Omit<ImageConfig, 'src' | 'alt'> {
  const baseConfig = imageConfigs[type];
  const dimensions = imageDimensions[type];
  
  return {
    width: dimensions.width,
    height: dimensions.height,
    ...baseConfig,
    ...overrides,
  };
}

/**
 * Generate blur data URL for placeholder
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  // Simple SVG blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#gradient)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Validate image file type
 */
export function isValidImageType(filename: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validExtensions.includes(extension);
}

/**
 * Generate responsive image sizes string
 */
export function generateSizes(breakpoints: { size: string; width: string }[]): string {
  return breakpoints
    .map(bp => `(max-width: ${bp.size}) ${bp.width}`)
    .join(', ');
}

/**
 * Image optimization checklist
 */
export const imageOptimizationChecklist = {
  // Format priorities (best to worst for web)
  formats: ['avif', 'webp', 'jpg', 'png'],
  
  // Quality settings by use case
  quality: {
    hero: 90,        // High quality for main visuals
    content: 85,     // Good quality for content images
    thumbnail: 80,   // Lower quality for small images
    icons: 95,       // High quality for logos/icons
  },
  
  // Size limits (in KB)
  maxSizes: {
    hero: 150,       // 150KB max for hero images
    content: 100,    // 100KB max for content images
    thumbnail: 50,   // 50KB max for thumbnails
    icon: 20,        // 20KB max for icons
  },
  
  // Responsive breakpoints
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
    wide: '1440px',
  },
};

/**
 * Performance monitoring for images
 */
export function trackImagePerformance(src: string, loadTime: number): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`Image loaded: ${src} in ${loadTime}ms`);
    
    // Track slow loading images
    if (loadTime > 1000) {
      console.warn(`Slow image load detected: ${src} (${loadTime}ms)`);
    }
  }
}

/**
 * Convert SVG icons to data URLs for inline use
 */
export function svgToDataURL(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Image loading states for UI feedback
 */
export const imageLoadingStates = {
  loading: 'animate-pulse bg-gray-200',
  loaded: 'transition-opacity duration-300',
  error: 'bg-gray-100 flex items-center justify-center text-gray-400',
};