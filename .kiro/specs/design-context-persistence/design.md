# Design Context Persistence - Technical Design

## Overview

This system will enable seamless design theme persistence across page navigation by implementing URL-based design context, React state management, and dynamic theme application. Users will experience consistent branding from their selected business design throughout their entire journey on the website.

## Architecture

### High-Level Flow
```
Home Page (BusinessCarousel) 
  ↓ User selects design
  ↓ Design context stored in URL & state
Navigation Click
  ↓ Design context passed to destination
Destination Page
  ↓ Theme applied dynamically
  ↓ All components styled with design theme
```

### URL Structure
```
Base URLs:
- /{locale}/services
- /{locale}/packages  
- /{locale}/pricing

With Design Context:
- /{locale}/services?design=medical
- /{locale}/packages?design=autoGarage
- /{locale}/pricing?design=restaurant
```

## Components and Interfaces

### 1. Design Context Provider

**Location:** `web/lib/designContext.tsx`

```typescript
interface DesignContextType {
  currentDesign: BusinessType;
  setCurrentDesign: (design: BusinessType) => void;
  getDesignConfig: () => DesignConfig;
  getDesignTheme: () => ThemeConfig;
}

interface ThemeConfig {
  gradient: string;
  accent: string;
  contrastText: string;
  background: string;
  text: string;
  hoverShadow: string;
  borderHover: string;
}
```

**Responsibilities:**
- Manage current design state across the application
- Provide theme configuration based on current design
- Handle design changes and URL updates
- Persist design context in URL parameters

### 2. Enhanced Navigation Hook

**Location:** `web/lib/useDesignNavigation.ts`

```typescript
interface NavigationOptions {
  preserveDesign?: boolean;
  newDesign?: BusinessType;
}

function useDesignNavigation() {
  const navigate = (href: string, options?: NavigationOptions) => void;
  const getCurrentDesignParam = () => string;
  const updateURLWithDesign = (design: BusinessType) => void;
}
```

**Responsibilities:**
- Handle navigation while preserving design context
- Update URLs with design parameters
- Manage browser history with design state

### 3. Theme-Aware Components

**Enhanced Components:**
- `Header.tsx` - Navigation links with design context
- `PricingTable.tsx` - Dynamic theming
- `ServiceGrid.tsx` - Design-aware styling
- Page components - Theme application

**Theme Application Pattern:**
```typescript
const ThemeAwareComponent = () => {
  const { getDesignTheme } = useDesignContext();
  const theme = getDesignTheme();
  
  return (
    <div 
      className="base-classes"
      style={{
        '--theme-gradient': theme.gradient,
        '--theme-accent': theme.accent,
        '--theme-hover-shadow': theme.hoverShadow
      }}
    >
      {/* Component content */}
    </div>
  );
};
```

### 4. URL Parameter Management

**Location:** `web/lib/urlUtils.ts`

```typescript
function getDesignFromURL(): BusinessType | null;
function setDesignInURL(design: BusinessType): void;
function removeDesignFromURL(): void;
function buildURLWithDesign(path: string, design: BusinessType): string;
```

## Data Models

### Design Configuration Extension

**Location:** `web/lib/businessDesigns.ts`

```typescript
interface DesignConfig {
  // Existing properties...
  theme: {
    gradient: string;
    accent: string;
    contrastText: string;
    background: string;
    text: string;
    hoverEffects: {
      shadow: string;
      borderColor: string;
      transform: string;
    };
    buttonStyles: {
      primary: string;
      secondary: string;
      hover: string;
    };
  };
}
```

### Theme CSS Variables

**Location:** `web/styles/themes.css`

```css
:root {
  /* Default theme variables */
  --theme-gradient: linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6);
  --theme-accent: #06b6d4;
  --theme-hover-shadow: rgba(6, 182, 212, 0.2);
  --theme-border-hover: rgba(6, 182, 212, 0.3);
}

.theme-medical {
  --theme-gradient: linear-gradient(to right, #10b981, #059669, #047857);
  --theme-accent: #10b981;
  --theme-hover-shadow: rgba(16, 185, 129, 0.2);
}

.theme-restaurant {
  --theme-gradient: linear-gradient(to right, #f59e0b, #d97706, #b45309);
  --theme-accent: #f59e0b;
  --theme-hover-shadow: rgba(245, 158, 11, 0.2);
}
```

## Error Handling

### Design Context Recovery

1. **Invalid Design Parameter**
   - Detect invalid design in URL
   - Log warning and default to AI_AGENCY
   - Update URL to reflect actual design

2. **Missing Design Context**
   - Check for design parameter on page load
   - If missing, check localStorage as fallback
   - Default to AI_AGENCY if no context found

3. **Theme Application Failure**
   - Wrap theme application in try-catch
   - Fall back to default theme on error
   - Log error for debugging

### URL State Management

```typescript
function safeGetDesignFromURL(): BusinessType {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const design = urlParams.get('design');
    
    if (design && isValidBusinessType(design)) {
      return design as BusinessType;
    }
  } catch (error) {
    console.warn('Failed to get design from URL:', error);
  }
  
  return BusinessType.AI_AGENCY; // Default fallback
}
```

## Testing Strategy

### Unit Tests

1. **Design Context Provider**
   - Test design state management
   - Test theme configuration retrieval
   - Test URL parameter handling

2. **Navigation Hook**
   - Test URL building with design context
   - Test navigation with preserved context
   - Test fallback behavior

3. **Theme Application**
   - Test CSS variable injection
   - Test component styling updates
   - Test theme switching

### Integration Tests

1. **End-to-End Navigation Flow**
   - Select design on home page
   - Navigate to services page
   - Verify theme consistency
   - Test browser back/forward

2. **URL Sharing**
   - Generate URL with design context
   - Open URL in new tab/window
   - Verify theme application

3. **Error Scenarios**
   - Invalid design parameter
   - Missing design context
   - Theme application failures

## Implementation Phases

### Phase 1: Core Infrastructure
- Create DesignContext provider
- Implement URL parameter management
- Set up theme CSS variables
- Update businessDesigns.ts with theme configs

### Phase 2: Navigation Integration
- Update Header component with design context
- Implement useDesignNavigation hook
- Update all navigation links
- Test basic navigation flow

### Phase 3: Theme Application
- Update all page components to use design context
- Apply dynamic theming to cards and buttons
- Implement theme-aware hover effects
- Test visual consistency

### Phase 4: Error Handling & Polish
- Implement fallback mechanisms
- Add error logging and recovery
- Optimize performance
- Add comprehensive testing

## Performance Considerations

- **Theme Switching**: Use CSS variables for instant theme changes
- **URL Updates**: Debounce URL updates to prevent excessive history entries
- **Context Propagation**: Minimize re-renders with proper memoization
- **Bundle Size**: Lazy load theme configurations when needed

## Security Considerations

- **URL Parameter Validation**: Sanitize and validate design parameters
- **XSS Prevention**: Escape any user-controlled theme values
- **CSP Compliance**: Ensure dynamic styles comply with Content Security Policy