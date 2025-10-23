import { describe, it, expect } from 'vitest';
import { getImageProps } from '@/lib/imageOptimization';
import { generateBreadcrumbsFromPath } from '@/lib/seo/structuredData';

describe('Image Optimization Utils', () => {
  it('should return correct image props for hero type', () => {
    const props = getImageProps('hero');
    
    expect(props).toEqual({
      width: 1200,
      height: 630,
      quality: 90,
      priority: true,
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
    });
  });

  it('should return correct image props for card type', () => {
    const props = getImageProps('card');
    
    expect(props).toEqual({
      width: 400,
      height: 250,
      quality: 85,
      priority: false,
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px',
    });
  });

  it('should apply overrides correctly', () => {
    const props = getImageProps('hero', { quality: 95 });
    
    expect(props.quality).toBe(95);
    expect(props.width).toBe(1200);
  });
});

describe('SEO Structured Data Utils', () => {
  it('should generate breadcrumbs for simple path', () => {
    const breadcrumbs = generateBreadcrumbsFromPath('/fr/compliance', 'fr');
    
    expect(breadcrumbs.itemListElement).toHaveLength(2);
    expect(breadcrumbs.itemListElement[0]!).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Accueil',
      item: 'https://webimpactsolutions.ca/fr'
    });
    expect(breadcrumbs.itemListElement[1]!).toEqual({
      '@type': 'ListItem', 
      position: 2,
      name: 'Conformite',
      item: 'https://webimpactsolutions.ca/fr/compliance'
    });
  });

  it('should generate breadcrumbs for nested path', () => {
    const breadcrumbs = generateBreadcrumbsFromPath('/en/content/guides/something', 'en');
    
    expect(breadcrumbs.itemListElement).toHaveLength(4);
    expect(breadcrumbs.itemListElement[0]!.name).toBe('Home');
    expect(breadcrumbs.itemListElement[1]!.name).toBe('Content');
    expect(breadcrumbs.itemListElement[2]!.name).toBe('Guides');
    expect(breadcrumbs.itemListElement[3]!.name).toBe('Something');
  });
});
