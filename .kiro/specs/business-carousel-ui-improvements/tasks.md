# Implementation Plan

- [x] 1. Update AI Agency section card titles and content
- [x] 1.1 Rework section title "Agence IA — Plans modulaires pour leaders automatisation"
  - Replace current section title with more engaging and appropriate alternative
  - Update both French and English versions in message files
  - Ensure new title aligns with brand voice and service positioning
  - _Requirements: 1.2, 1.3_

- [x] 1.2 Enhance AI Agency service card titles
  - Review current card titles in business messages configuration
  - Rewrite titles to be more descriptive and value-focused
  - Maintain consistency with overall branding and tone
  - Update localization files for both French and English
  - _Requirements: 1.1, 1.3, 1.4_

- [x] 2. Clarify and implement "Voir le Design Agence IA" button functionality
- [x] 2.1 Identify current button implementation and clarify intended function
  - Locate button in component code and analyze current behavior
  - Document button's intended purpose based on context and user requirements
  - Define specific functionality (modal, navigation, or other action)
  - _Requirements: 2.1, 2.2_

- [x] 2.2 Implement confirmed button functionality
  - Code the appropriate behavior based on clarified requirements
  - Ensure button provides clear user feedback and proper navigation
  - Test button interaction and integrate with existing component flow
  - _Requirements: 2.2, 2.4_

- [x] 3. Convert "Ce que nous livrons" section cards to modal-based interactions
- [x] 3.1 Enhance service data structure for modal display
  - Add shortDescription field to service data model
  - Create summary content for card display (title, short description, price)
  - Maintain full service details for modal content
  - Update service loading and processing logic
  - _Requirements: 3.1, 3.3_

- [x] 3.2 Create service detail modal component
  - Build modal component for displaying full service information
  - Implement modal state management for service details
  - Create modal content layout with comprehensive service information
  - Ensure modal styling is consistent with existing design system
  - _Requirements: 3.2, 3.3_

- [x] 3.3 Update ServiceGrid component for modal integration
  - Modify service cards to display only summary information
  - Add click handlers to trigger service detail modals
  - Implement modal opening logic with proper service data passing
  - Ensure cards maintain visual hierarchy and readability
  - _Requirements: 3.1, 3.2, 3.4_

- [x] 4. Implement consistent modal close button functionality
- [x] 4.1 Create standardized close button component
  - Build reusable close button component with X icon
  - Implement consistent positioning (top-right corner)
  - Add proper accessibility attributes and keyboard support
  - Create theme-adaptive styling for different business designs
  - _Requirements: 4.1, 4.4, 4.5_

- [x] 4.2 Update existing business design modals with standard close button
  - Replace inconsistent close button implementations across all modals
  - Apply standardized close button to all business design modals
  - Ensure close button adapts to each theme's color scheme
  - Test close button visibility and accessibility across all designs
  - _Requirements: 4.1, 4.2, 4.3, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 4.3 Implement click-outside-to-close functionality for all modals
  - Add click-outside detection to close modals consistently
  - Ensure behavior works for both existing and new service modals
  - Test modal closing behavior across different interaction patterns
  - Maintain keyboard accessibility (ESC key support)
  - _Requirements: 4.3, 4.6_

- [ ]* 5. Create comprehensive test coverage for modal improvements
- [ ]* 5.1 Write unit tests for service modal functionality
  - Test service card to modal conversion logic
  - Verify modal opening/closing state management
  - Test service data loading and display in modals
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 5.2 Write unit tests for close button standardization
  - Test close button rendering across all modal types
  - Verify click and keyboard interaction functionality
  - Test theme adaptation and hover states
  - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [ ]* 5.3 Create integration tests for complete modal workflows
  - Test end-to-end user journey from card click to modal close
  - Verify modal behavior across different business design themes
  - Test responsive behavior and accessibility compliance
  - _Requirements: 3.2, 4.3, 4.6_

- [ ] 6. Validate and test all improvements
- [x] 6.1 Test updated AI Agency section content and titles
  - Verify new section title and card titles render correctly
  - Test localization for both French and English versions
  - Ensure content maintains consistency with brand voice
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 6.2 Validate button functionality implementation
  - Test "Voir le Design Agence IA" button behavior
  - Verify button provides appropriate user feedback
  - Ensure button integration works with overall component flow
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 6.3 Test service modal conversion and close button consistency
  - Verify service cards display summary information correctly
  - Test modal opening with full service details
  - Validate consistent close button behavior across all modals
  - Test click-outside-to-close functionality
  - Ensure responsive design and accessibility compliance
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_