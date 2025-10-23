# Implementation Plan

- [X] 1. Create brand configuration system and update core branding
  - Create centralized brand configuration file with chosen brand identity (Nadiel or Web Impact Solutions)
  - Update root layout metadata to reflect AI web agency instead of medical clinic
  - Modify BusinessCarousel component to remove medical clinic references and focus on AI agency
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [X] 2. Update message files for brand consistency and proper translations
  - Update FR/EN message files to reflect AI web agency services instead of medical services
  - Fix package name translations (e.g., "Soins Avancés" → "Advanced Care")
  - Ensure consistent naming conventions across all FR/EN content
  - Add proper AI web agency hero titles and descriptions
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 5.1, 5.2, 5.3_

- [X] 3. Implement cookie consent system with Law 25 compliance
  - Create CookieConsentBanner component that blocks trackers before consent
  - Implement granular consent controls for different cookie categories
  - Add consent state management with localStorage persistence
  - Create cookie policy content with proper Law 25 language
  - _Requirements: 3.1, 3.2, 3.6_

- [X] 4. Create privacy policy infrastructure with subcontractor registry
  - Build dynamic PrivacyPolicyPage component with Law 25 compliance
  - Create subcontractor registry listing Vercel, Resend/MailerLite, Cal.com, etc.
  - Add data access and deletion procedures to privacy policy
  - Implement footer links to privacy policy in both languages
  - _Requirements: 3.2, 3.3, 3.5_

- [X] 5. Implement data deletion endpoint and request handling
  - Create /api/delete endpoint for data deletion requests
  - Build DataRequestForm component for user data access/deletion
  - Add proper validation and security for data request handling
  - Implement email notifications for data request processing
  - _Requirements: 3.4, 3.5_

- [X] 6. Enhance metadata generation for unique titles and descriptions
  - Update generateMetadata functions to ensure unique titles per page
  - Create proper meta descriptions for all pages in both languages
  - Implement template-based title generation system
  - Add Open Graph and Twitter Card metadata
  - _Requirements: 4.1, 4.6_

- [X] 7. Implement proper hreflang tags for bilingual SEO
  - Update HrefLangLinks component to include all page variations
  - Ensure proper hreflang implementation across all routes
  - Add canonical URL management for duplicate content prevention
  - Test hreflang implementation with SEO validation tools
  - _Requirements: 4.2_

- [X] 8. Extend structured data schemas for local business and FAQ
  - Enhance StructuredData component with LocalBusiness schema
  - Add Organization schema with AI web agency details
  - Implement FAQ schema markup for common questions
  - Add Service schema for package offerings
  - _Requirements: 4.4, 4.5_

- [X] 9. Update robots.txt and enhance sitemap generation
  - Review and update robots.txt for proper crawler directives
  - Enhance sitemap.ts to include all relevant pages and locales
  - Add proper priority and changeFrequency values
  - Implement sitemap validation and error handling
  - _Requirements: 4.3_

- [X] 10. Create content validation system for brand consistency
  - Build content audit script to check for medical clinic references
  - Implement translation consistency validation
  - Add automated checks for package naming consistency
  - Create brand compliance validation for all content
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [X] 11. Implement compliance footer and legal navigation
  - Update footer component with proper legal links
  - Add compliance indicators and certifications
  - Ensure footer consistency across all pages and languages
  - Implement proper legal page navigation structure
  - _Requirements: 3.2, 3.6_

- [X] 12. Add comprehensive testing for all compliance and SEO features
  - Create unit tests for cookie consent functionality
  - Add integration tests for privacy policy and data requests
  - Implement SEO validation tests for metadata and structured data
  - Create accessibility tests for compliance components
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5_