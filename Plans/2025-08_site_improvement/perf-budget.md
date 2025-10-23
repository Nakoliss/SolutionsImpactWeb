# Performance Budget

## Bundle Size Targets

- **First Load JS**: < 130KB gzipped
- **Initial CSS**: < 50KB gzipped
- **Total Page Weight**: < 1MB

## Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Lighthouse Scores (Mobile)

- **Performance**: > 85
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 95

## Current Status (2025-08-24)

Build analysis shows:
- First Load JS: ~155KB (above target)
- BusinessCarousel component: 52KB (optimization candidate)
- Performance needs optimization

## Action Items

1. Code split BusinessCarousel component
2. Implement lazy loading for heavy components
3. Optimize Framer Motion usage
4. Review bundle analyzer output regularly