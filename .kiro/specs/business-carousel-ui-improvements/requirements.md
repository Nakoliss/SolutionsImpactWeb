# Requirements Document

## Introduction

This feature focuses on comprehensive improvements to the BusinessCarousel component based on specific design requirements. The improvements include updating card titles in the "Agence IA" section, clarifying button functionality, and converting service cards in the "Ce que nous livrons" section to modal-based interactions. These changes will enhance user experience through better content organization, clearer navigation, and interactive service exploration.

## Requirements

### Requirement 1

**User Story:** As a user viewing the "Agence IA — Plans modulaires pour leaders automatisation" section, I want to see improved and appropriate card titles, so that I can better understand the available services and their value propositions.

#### Acceptance Criteria

1. WHEN viewing the AI Agency business design section THEN the system SHALL display reworked card titles that are more descriptive and engaging
2. WHEN the section loads THEN the system SHALL replace the current section title "Agence IA — Plans modulaires pour leaders automatisation" with a more suitable alternative
3. WHEN card titles are updated THEN the system SHALL maintain consistency with the overall branding and tone
4. WHEN titles are changed THEN the system SHALL ensure they accurately reflect the service content and value proposition
5. WHEN displaying titles THEN the system SHALL ensure proper localization for both French and English versions

### Requirement 2

**User Story:** As a user encountering the "Voir le Design Agence IA" button, I want to understand its intended function clearly, so that I can make informed decisions about interacting with it.

#### Acceptance Criteria

1. WHEN the "Voir le Design Agence IA" button is displayed THEN the system SHALL provide clear indication of its intended function
2. WHEN button functionality is clarified THEN the system SHALL ensure the button label accurately reflects its action
3. WHEN the button is implemented THEN the system SHALL only proceed with development after the intended function is confirmed
4. WHEN button behavior is defined THEN the system SHALL ensure it provides appropriate user feedback and navigation

### Requirement 3

**User Story:** As a user browsing the "Ce que nous livrons" section, I want to see service cards converted to modal interactions with short explanations, so that I can quickly scan services and access detailed information on demand.

#### Acceptance Criteria

1. WHEN viewing the "Ce que nous livrons" section THEN the system SHALL display cards with only short explanations visible
2. WHEN a service card is clicked THEN the system SHALL open a modal displaying the full service information
3. WHEN the modal opens THEN the system SHALL show comprehensive details that were previously displayed directly on the card
4. WHEN multiple cards are available THEN the system SHALL ensure consistent modal behavior across all service cards
5. WHEN cards are converted THEN the system SHALL maintain visual hierarchy and readability of the short explanations

### Requirement 4

**User Story:** As a user interacting with service modals in the "Ce que nous livrons" section, I want consistent and intuitive modal controls, so that I can easily close modals and navigate the interface efficiently.

#### Acceptance Criteria

1. WHEN any service modal is opened THEN the system SHALL display a close button (X) in the top-right corner
2. WHEN the close button is clicked THEN the system SHALL close the modal and return to the main view
3. WHEN the user clicks outside the modal content area THEN the system SHALL close the modal
4. WHEN the modal is displayed THEN the system SHALL ensure the close button is easily accessible and clearly visible
5. WHEN the close button is hovered THEN the system SHALL provide appropriate visual feedback
6. WHEN modals are implemented THEN the system SHALL ensure consistent positioning and styling of close buttons across all modals

### Requirement 5

**User Story:** As a user interacting with service modals across different business designs, I want to have a consistent close button (X) available on all modal cards, so that I can easily dismiss any modal regardless of which design I'm viewing.

#### Acceptance Criteria

1. WHEN any service modal is opened from any business design THEN the system SHALL display a close button (X) in the top-right corner
2. WHEN the close button is clicked THEN the system SHALL close the modal and return to the main view
3. WHEN the close button is hovered THEN the system SHALL provide visual feedback consistent with each design's theme
4. WHEN comparing modals across different designs THEN the system SHALL ensure the close button is positioned consistently in the same location
5. WHEN the modal is displayed THEN the system SHALL ensure the close button is easily accessible and clearly visible against the modal background