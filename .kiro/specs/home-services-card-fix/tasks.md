# Implementation Plan

- [x] 1. Fix existing hardcoded service references
  - Update `socialMediaBusiness` reference to `reviewManagement` in the Home Services design
  - Update `advancedFeatures` reference to `additionalServices` in the Home Services design
  - Test that both cards now open modals correctly
  - _Requirements: 2.1, 2.2, 2.4_

- [ ] 2. Add missing service cards to complete the 7-card layout
  - Add `websites` service card as the first/primary service card
  - Add `advertising` service card to the grid
  - Add `marketingAutomation` service card to the grid
  - Ensure proper grid layout accommodates all 7 cards
  - _Requirements: 1.1, 1.2, 3.2_

- [ ] 3. Update service card titles and pricing display
  - Ensure all service cards display correct titles from servicesData
  - Update pricing display to show accurate information from service tiers
  - Add proper fallback text for missing service data
  - _Requirements: 4.1, 4.2, 4.4_

- [ ] 4. Test modal functionality for all service types
  - Verify that all 7 service cards open their respective modals
  - Test modal rendering for `additionalServices` which has different data structure
  - Ensure modal content displays correctly for all service types
  - _Requirements: 2.1, 2.2, 2.3, 4.3_

- [ ] 5. Verify responsive layout and visual consistency
  - Test grid layout with 7 cards on different screen sizes
  - Ensure consistent styling across all service cards
  - Verify hover effects and transitions work properly
  - Test that layout matches other designs in terms of functionality
  - _Requirements: 1.3, 3.1, 3.3_