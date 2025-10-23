# Design Document

## Overview

This design addresses the transformation of the current website from a generic medical clinic presentation to a professional bilingual AI web agency with proper legal compliance and search engine optimization. The solution leverages the existing Next.js 15 architecture with next-intl for internationalization, while implementing comprehensive branding unification, Law 25 compliance, and technical SEO improvements.

## Architecture

### Current System Analysis
- **Framework**: Next.js 15 with App Router
- **Internationalization**: next-intl with FR/EN support
- **Styling**: Tailwind CSS with custom components
- **Content Management**: JSON-based message files and MDX content
- **SEO Foundation**: Basic robots.ts and sitemap.ts already exist
- **Schema Markup**: StructuredData component with organization support

### Design Principles
1. **Incremental Enhancement**: Build upon existing architecture without breaking changes
2. **Compliance-First**: Implement Law 25 requirements as foundational elements
3. **SEO-Optimized**: Ensure all technical SEO elements are properly implemented
4. **Brand Consistency**: Unify all brand touchpoints across the application
5. **Performance-Conscious**: Maintain fast loading times while adding new features

## Components and Interfaces

### 1. Brand Identity System

#### Brand Configuration
```typescript
interface BrandConfig {
  name: string;
  tagline: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  logo?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
```

#### Implementation Strategy
- Create centralized brand configuration file
- Update all message files to reflect chosen brand (Nadiel or Web Impact Solutions)
- Modify BusinessCarousel component to use AI agency branding consistently
- Update meta titles, descriptions, and structured data

### 2. Legal Compliance System

#### Cookie Consent Manager
```typescript
interface CookieConsentConfig {
  essential: string[];
  analytics: string[];
  marketing: string[];
  preferences: string[];
}

interface ConsentState {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: Date;
}
```

#### Privacy Policy System
- Dynamic privacy policy component with subcontractor listing
- Data access/deletion request handling
- Cookie policy integration
- Law 25 specific compliance features

#### Components Required
- `CookieConsentBanner`: Blocking banner with granular controls
- `PrivacyPolicyPage`: Dynamic policy with subcontractor registry
- `DataRequestForm`: User data access/deletion requests
- `ComplianceFooter`: Legal links and compliance indicators

### 3. SEO Enhancement System

#### Metadata Management
```typescript
interface SEOConfig {
  title: {
    template: string;
    default: string;
  };
  description: string;
  keywords: string[];
  hreflang: {
    [locale: string]: string;
  };
}
```

#### Schema Markup Extensions
- Enhanced Organization schema with AI agency details
- LocalBusiness schema for Quebec targeting
- FAQ schema for common questions
- Service schema for package offerings

#### Components Required
- `EnhancedMetadata`: Improved metadata generation
- `HrefLangManager`: Proper hreflang implementation
- `SchemaGenerator`: Extended structured data
- `SEOAudit`: Development-time SEO validation

### 4. Content Localization System

#### Package Translation Strategy
```typescript
interface PackageTranslation {
  [locale: string]: {
    name: string;
    description: string;
    features: string[];
    cta: string;
  };
}
```

#### Implementation Approach
- Audit existing package names for consistency
- Create translation mapping for service tiers
- Update service JSON files with proper translations
- Implement fallback mechanisms for missing translations

## Data Models

### 1. Brand Configuration Model
```typescript
export interface BrandData {
  identity: {
    name: string;
    legalName: string;
    tagline: LocalizedString;
    description: LocalizedString;
  };
  contact: {
    email: string;
    phone: string;
    address: Address;
  };
  social: {
    [platform: string]: string;
  };
  compliance: {
    registrationNumber?: string;
    taxNumber?: string;
    licenses: string[];
  };
}
```

### 2. Compliance Data Model
```typescript
export interface ComplianceData {
  subcontractors: Subcontractor[];
  dataTypes: DataType[];
  retentionPolicies: RetentionPolicy[];
  userRights: UserRight[];
  cookieCategories: CookieCategory[];
}

interface Subcontractor {
  name: string;
  purpose: string;
  dataShared: string[];
  location: string;
  privacyPolicy: string;
}
```

### 3. SEO Data Model
```typescript
export interface SEOData {
  pages: {
    [path: string]: PageSEO;
  };
  schemas: {
    organization: OrganizationSchema;
    localBusiness: LocalBusinessSchema;
    faqs: FAQSchema[];
  };
  redirects: Redirect[];
}
```

## Error Handling

### 1. Compliance Error Handling
- Graceful degradation when consent is not given
- Fallback content for blocked tracking scripts
- Error logging for compliance violations
- User-friendly error messages for data requests

### 2. SEO Error Handling
- Fallback metadata for missing translations
- Default structured data when dynamic content fails
- Sitemap generation error recovery
- Canonical URL validation

### 3. Localization Error Handling
- Fallback to default language for missing translations
- Mojibake detection and correction (already implemented)
- Content validation for consistency across locales

## Testing Strategy

### 1. Compliance Testing
- Cookie consent functionality across browsers
- Data request form validation
- Privacy policy completeness
- Subcontractor registry accuracy

### 2. SEO Testing
- Metadata uniqueness validation
- Hreflang implementation verification
- Structured data validation
- Sitemap accuracy testing

### 3. Brand Consistency Testing
- Visual regression testing for brand elements
- Content consistency across locales
- Package naming validation
- CTA uniformity verification

### 4. Accessibility Testing
- Cookie banner accessibility
- Privacy policy readability
- Form accessibility for data requests
- Screen reader compatibility

## Implementation Phases

### Phase 1: Brand Unification
1. Create brand configuration system
2. Update message files with chosen brand identity
3. Modify BusinessCarousel component for AI agency focus
4. Update meta titles and descriptions

### Phase 2: Legal Compliance
1. Implement cookie consent system
2. Create privacy policy infrastructure
3. Add data request handling
4. Integrate subcontractor registry

### Phase 3: SEO Enhancement
1. Enhance metadata generation
2. Implement proper hreflang tags
3. Extend structured data schemas
4. Optimize sitemap generation

### Phase 4: Content Optimization
1. Audit and fix package translations
2. Ensure content consistency
3. Implement content validation
4. Add FAQ schema markup

## Technical Considerations

### Performance Impact
- Cookie consent banner: ~2KB additional JavaScript
- Privacy policy: Static generation, no runtime impact
- Enhanced metadata: Minimal impact, generated at build time
- Structured data: ~1-2KB additional HTML per page

### Browser Compatibility
- Cookie consent: Modern browsers with localStorage support
- Privacy features: Progressive enhancement approach
- SEO features: Server-side generated, universal compatibility

### Maintenance Requirements
- Regular subcontractor registry updates
- Periodic compliance policy reviews
- SEO performance monitoring
- Brand consistency audits

## Security Considerations

### Data Protection
- Minimal data collection before consent
- Secure handling of data deletion requests
- Proper encryption for sensitive compliance data
- Regular security audits of privacy features

### Cookie Security
- Secure cookie attributes
- SameSite cookie policies
- Regular cookie audit and cleanup
- Consent timestamp validation

## Monitoring and Analytics

### Compliance Monitoring
- Consent rate tracking
- Data request volume monitoring
- Privacy policy engagement metrics
- Compliance violation alerts

### SEO Monitoring
- Search console integration
- Structured data validation
- Hreflang implementation monitoring
- Core Web Vitals tracking

### Brand Consistency Monitoring
- Content audit automation
- Translation consistency checks
- Visual regression detection
- User feedback collection