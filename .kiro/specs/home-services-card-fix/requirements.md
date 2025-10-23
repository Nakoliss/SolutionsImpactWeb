# Requirements Document

## Introduction

The Home Services design (design 10) in the BusinessCarousel component has several issues that need to be resolved. Currently, it only displays 6 service cards instead of 7, and two of the cards ("Réseaux Sociaux & GBP" and "Fonctionnalités Avancées") don't open because they reference non-existent services in the services data.

## Requirements

### Requirement 1

**User Story:** As a user viewing the Home Services design, I want to see all 7 available service cards so that I can access all services offered.

#### Acceptance Criteria

1. WHEN I view design 10 (Home Services) THEN the system SHALL display exactly 7 service cards
2. WHEN I count the service cards THEN the system SHALL show the same number of cards as all other designs
3. WHEN I compare with other designs THEN the system SHALL maintain consistency in the number of services displayed

### Requirement 2

**User Story:** As a user, I want all service cards to be clickable and functional so that I can view detailed information about each service.

#### Acceptance Criteria

1. WHEN I click on the "Réseaux Sociaux & GBP" card THEN the system SHALL open a modal with service details
2. WHEN I click on the "Fonctionnalités Avancées" card THEN the system SHALL open a modal with service details
3. WHEN I click on any service card THEN the system SHALL display the appropriate service information
4. IF a service reference doesn't exist THEN the system SHALL map it to an appropriate existing service

### Requirement 3

**User Story:** As a developer, I want the Home Services design to use the same service data structure as other designs so that maintenance is consistent.

#### Acceptance Criteria

1. WHEN the Home Services design renders service cards THEN the system SHALL use the same servicesData object as other designs
2. WHEN new services are added to the JSON files THEN the system SHALL automatically include them in the Home Services design
3. WHEN service data is updated THEN the system SHALL reflect changes consistently across all designs
4. IF hardcoded service references are used THEN the system SHALL map them to valid services in the servicesData object

### Requirement 4

**User Story:** As a user, I want the service cards in the Home Services design to display accurate pricing and descriptions so that I can make informed decisions.

#### Acceptance Criteria

1. WHEN I view a service card THEN the system SHALL display the correct service title from the services data
2. WHEN I view a service card THEN the system SHALL display the correct pricing information
3. WHEN I view service details in the modal THEN the system SHALL show all available tiers and pricing options
4. WHEN the service data is missing THEN the system SHALL display appropriate fallback text