# Design Document

## Overview

This design addresses the issues with the Home Services design (design 10) in the BusinessCarousel component. The solution involves fixing the hardcoded service references and ensuring all 7 service cards are displayed and functional.

## Architecture

The fix will modify the existing Home Services design section within the BusinessCarousel component. The current implementation uses hardcoded service references that don't match the actual services data structure.

### Current Issues
- Only 6 cards displayed instead of 7
- Two cards reference non-existent services: `socialMediaBusiness` and `advancedFeatures`
- Inconsistent with other designs that dynamically render all services

### Proposed Solution
Map the hardcoded service references to actual services in the servicesData object, and add the missing 7th service card.

## Components and Interfaces

### Service Mapping Strategy

The Home Services design currently has these hardcoded references:
1. `seoOptimization` → ✅ Exists in services data
2. `socialMediaBusiness` → ❌ Map to `reviewManagement`
3. `advancedFeatures` → ❌ Map to `additionalServices`
4. `maintenance` → ✅ Exists in services data

Missing services to add:
5. `websites` (most important service)
6. `advertising` 
7. `marketingAutomation`

### Component Structure

The Home Services design will maintain its current visual layout but with corrected service references:

```typescript
// Current problematic structure
<div onClick={() => openService('socialMediaBusiness')}>
  <h4>{servicesData?.socialMediaBusiness?.title ?? 'Réseaux Sociaux & GBP'}</h4>
</div>

// Fixed structure
<div onClick={() => openService('reviewManagement')}>
  <h4>{servicesData?.reviewManagement?.title ?? 'Réseaux Sociaux & GBP'}</h4>
</div>
```

## Data Models

### Service Reference Mapping

```typescript
const serviceMapping = {
  'socialMediaBusiness': 'reviewManagement',
  'advancedFeatures': 'additionalServices'
};
```

### Service Card Configuration

Each service card will have:
- Service key (mapped to actual services data)
- Display title (with fallback)
- Icon component
- Color scheme
- Pricing display

## Error Handling

### Missing Service Data
- If a mapped service doesn't exist, display fallback text
- Log warnings for missing service references
- Gracefully handle undefined service properties

### Modal Rendering
- Ensure modal renders correctly for all service types
- Handle edge cases for services with different data structures (like `additionalServices`)

## Testing Strategy

### Unit Tests
- Test service mapping functionality
- Verify all 7 cards render correctly
- Test modal opening for each service type

### Integration Tests
- Test complete user flow from card click to modal display
- Verify consistency with other designs
- Test with different locale settings

### Visual Regression Tests
- Ensure layout remains consistent
- Verify all cards are properly styled
- Test responsive behavior

## Implementation Plan

### Phase 1: Fix Existing Cards
1. Update `socialMediaBusiness` reference to `reviewManagement`
2. Update `advancedFeatures` reference to `additionalServices`
3. Test modal functionality for corrected references

### Phase 2: Add Missing Cards
1. Add `websites` service card (primary service)
2. Add `advertising` service card
3. Add `marketingAutomation` service card
4. Ensure proper grid layout with 7 cards

### Phase 3: Consistency Check
1. Verify all cards use consistent styling
2. Test modal rendering for all service types
3. Ensure proper responsive behavior

## Design Decisions

### Service Mapping Rationale
- `socialMediaBusiness` → `reviewManagement`: Both relate to online reputation and social presence
- `advancedFeatures` → `additionalServices`: Natural mapping for advanced/additional features

### Card Layout
- Maintain existing 4-column grid on large screens
- Ensure proper responsive behavior for 7 cards
- Consider 2-3-2 or 3-4 layout distribution

### Visual Consistency
- Keep existing color scheme and styling
- Maintain icon associations where appropriate
- Ensure consistent hover effects and transitions