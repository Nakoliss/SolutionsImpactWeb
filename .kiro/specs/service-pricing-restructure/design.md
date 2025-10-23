# Design Document

## Overview

This design restructures the service pricing display system to provide a more comprehensive and organized presentation of services across all website design variations. The solution involves updating the service data structure, reorganizing content into 6 logical categories, and ensuring consistent presentation across all 10 business design themes while maintaining each design's unique visual identity.

## Architecture

### Data Structure Architecture

The service data will be restructured into 6 main categories:

1. **Sites Web** - Core website development services (Site de base: 1 000 $ - 8 000 $, Site Premium: 5000$ - 15 000$, E-commerce: 5 000$ - 50 000$)
2. **Maintenance (Mensuel)** - Ongoing website maintenance tiers (Basic: 50 $ – 75 $, Standard: 80 $ – 150 $, Plus: 200 $ – 500 $+)
3. **SEO, AEO, GEO & AI Optimization (Mensuel)** - Search and AI optimization services (SEO: 500 - 1000, AEO: 500 $ – 1 000 $, GEO: 1 000 $ – 1 500 $, SEO Audit: 1 000 $ – 2 000 $)
4. **Marketing Automation & Analytics** - Digital marketing tools and analytics (SMS Marketing: 800 $ setup + 100–250 $/mo, Email Automation: 200 $ setup + 100 $/mo, Analytics Pack: 50–200 $/mo, AEO/GEO Audit: 500 $ – 1 500 $)
5. **Advanced Features & Compliance** - Additional features and legal compliance (Chatbot: 150 $ setup + 75–299 $/mo, Blog: 200 $ setup + 150–1 200 $/mo, Booking: 600–1 500 $ setup + 50 $/mo, Bilingue (FR/EN): 50–100 $/mo, Compliance Loi 25: 300–600 $ setup + 100–200 $/mo, Payments: 600–1 500 $ setup + frais transaction)
6. **Social Media & Business Profile** - Social media and online presence management (Google Business Profile (GBP): 299 $ setup + 249 $/mo, Social Media Management tiers: Starter: 650 $/mo, Growth: 1 100 $/mo, Pro: 1 800 $/mo)

### Component Architecture

- **Service Data Layer**: JSON files (`services.fr.json`, `services.en.json`) containing structured service information
- **Business Carousel Component**: Main component that renders different design variations
- **Service Display Logic**: Consistent service rendering logic that adapts to each design's visual style
- **Responsive Layout System**: Ensures proper display across all device sizes

## Components and Interfaces

### Service Data Interface

```typescript
interface ServiceTier {
  name: string;
  price: string;
  bullets: string[];
  setupCost?: string; // For services with separate setup costs
  recurring?: string; // For services with recurring costs
}

interface ServiceCategory {
  title: string;
  description?: string;
  tiers: ServiceTier[];
}

interface ServicesData {
  websites: ServiceCategory;
  maintenance: ServiceCategory;
  seoOptimization: ServiceCategory;
  marketingAutomation: ServiceCategory;
  advancedFeatures: ServiceCategory;
  socialMediaBusiness: ServiceCategory;
}
```

### Service Display Component

Each business design will implement a consistent service display pattern:

- **Grid Layout**: 2x3 or 3x2 grid depending on design aesthetic
- **Card Design**: Each service category displayed as a card with consistent information hierarchy
- **Pricing Display**: Clear separation of setup costs, monthly costs, and price ranges
- **Feature Lists**: Bullet points highlighting key features for each service tier
- **Call-to-Action**: Consistent CTA buttons leading to contact form

## Data Models

### Updated Service Categories

#### 1. Sites Web
```json
{
  "title": "SITES WEB",
  "description": "Solutions complètes de développement web",
  "tiers": [
    {
      "name": "Site de base",
      "price": "1 000 $ - 8 000 $",
      "bullets": ["1-5 pages", "Design moderne", "Responsive", "Loi 25 compliance"]
    },
    {
      "name": "Site Premium", 
      "price": "5 000 $ - 15 000 $",
      "bullets": ["6-15 pages", "Design avancé", "Animations", "Bilingue FR/EN"]
    },
    {
      "name": "E-commerce",
      "price": "5 000 $ - 50 000 $",
      "bullets": ["Catalogue produits", "Paiements sécurisés", "Gestion commandes", "SEO optimisé"]
    }
  ]
}
```

#### 2. Maintenance (Mensuel)
```json
{
  "title": "MAINTENANCE (MENSUEL)",
  "description": "Support technique et maintenance continue",
  "tiers": [
    {
      "name": "Basic",
      "price": "50 $ – 75 $",
      "bullets": ["Monitoring uptime", "SSL check", "Sauvegarde mensuelle"]
    },
    {
      "name": "Standard",
      "price": "80 $ – 150 $", 
      "bullets": ["Inclut Basic", "Mises à jour contenu", "Scan performance", "1 post GBP/mois"]
    },
    {
      "name": "Plus",
      "price": "200 $ – 500 $+",
      "bullets": ["Inclut Standard", "Corrections bugs prioritaires", "Audit SEO mensuel", "Vérification IA"]
    }
  ]
}
```

#### 3. SEO, AEO, GEO & AI Optimization (Mensuel)
```json
{
  "title": "SEO, AEO, GEO & AI OPTIMIZATION (MENSUEL)",
  "description": "Optimisation pour moteurs de recherche et IA",
  "tiers": [
    {
      "name": "SEO",
      "price": "500 $ - 1 000 $",
      "bullets": ["Optimisation contenu", "Suivi positions", "Rapports mensuels"]
    },
    {
      "name": "AEO (Answer Engine Optimization)",
      "price": "500 $ – 1 000 $",
      "bullets": ["Contenu Q&A structuré", "FAQ schema IA", "Vérification mentions IA"]
    },
    {
      "name": "GEO (Generative Engine Optimization)", 
      "price": "1 000 $ – 1 500 $",
      "bullets": ["Articles optimisés IA", "Métadonnées avancées", "Citations IA"]
    },
    {
      "name": "SEO Audit (One-time)",
      "price": "1 000 $ – 2 000 $",
      "bullets": ["Diagnostic complet", "Rapport PDF bilingue", "Recommandations"]
    }
  ]
}
```

#### 4. Marketing Automation & Analytics
```json
{
  "title": "MARKETING AUTOMATION & ANALYTICS",
  "description": "Outils de marketing digital et analyse",
  "tiers": [
    {
      "name": "SMS Marketing",
      "price": "100–250 $/mo",
      "setupCost": "800 $ setup",
      "bullets": ["Campagnes SMS", "Segmentation", "Automatisation"]
    },
    {
      "name": "Email Automation",
      "price": "100 $/mo",
      "setupCost": "200 $ setup", 
      "bullets": ["Séquences automatisées", "Templates", "Analytics"]
    },
    {
      "name": "Analytics Pack",
      "price": "50–200 $/mo",
      "bullets": ["Google Analytics 4", "Hotjar", "Rapports personnalisés"]
    }
  ]
}
```

#### 5. Website Functionality & Compliance
```json
{
  "title": "FONCTIONNALITÉS & CONFORMITÉ",
  "description": "Fonctionnalités avancées et conformité légale",
  "tiers": [
    {
      "name": "Chatbot",
      "price": "75–299 $/mo",
      "setupCost": "150 $ setup",
      "bullets": ["Chat automatisé", "Intégration CRM", "Support multilingue"]
    },
    {
      "name": "Blog",
      "price": "150–1 200 $/mo", 
      "setupCost": "200 $ setup",
      "bullets": ["Gestion contenu", "SEO optimisé", "Publication automatique"]
    },
    {
      "name": "Booking",
      "price": "50 $/mo",
      "setupCost": "600–1 500 $ setup",
      "bullets": ["Réservation en ligne", "Calendrier intégré", "Notifications"]
    },
    {
      "name": "Bilingue (FR/EN)",
      "price": "50–100 $/mo",
      "bullets": ["Traduction professionnelle", "Gestion multilingue", "SEO bilingue"]
    },
    {
      "name": "Compliance Loi 25",
      "price": "100–200 $/mo",
      "setupCost": "300–600 $ setup",
      "bullets": ["Privacy Policy FR/EN", "Cookie banner", "Registre sous-traitants"]
    },
    {
      "name": "Payments",
      "price": "frais transaction",
      "setupCost": "600–1 500 $ setup", 
      "bullets": ["Stripe integration", "Paiements sécurisés", "Gestion commandes"]
    }
  ]
}
```

#### 6. Social Media Management
```json
{
  "title": "GESTION MÉDIAS SOCIAUX",
  "description": "Présence et gestion des réseaux sociaux",
  "tiers": [
    {
      "name": "Google Business Profile (GBP)",
      "price": "249 $/mo",
      "setupCost": "299 $ setup",
      "bullets": ["2 posts/mois", "Réponses avis via IA", "Optimisation profil"]
    },
    {
      "name": "Starter (FB+IG, 8 posts/mo)",
      "price": "650 $/mo",
      "bullets": ["Facebook + Instagram", "8 posts par mois", "Création contenu"]
    },
    {
      "name": "Growth (FB+IG+GBP, 12 posts/mo)",
      "price": "1 100 $/mo", 
      "bullets": ["FB + IG + GBP", "12 posts par mois", "Engagement communauté"]
    },
    {
      "name": "Pro (FB+IG+LinkedIn/TikTok, 16 posts/mo)",
      "price": "1 800 $/mo",
      "bullets": ["Multi-plateformes", "16 posts par mois", "Gestion commentaires", "Analytics avancés"]
    }
  ]
}
```

## Error Handling

### Data Loading Error Handling
- **Fallback Mechanism**: If English services fail to load, fallback to French services
- **Loading States**: Display loading spinner while service data is being fetched
- **Error States**: Show user-friendly error message if service data cannot be loaded
- **Graceful Degradation**: If specific service categories fail, show available categories

### Responsive Design Error Handling
- **Overflow Protection**: Ensure service cards don't overflow on small screens
- **Text Truncation**: Implement ellipsis for long service names on mobile
- **Image Fallbacks**: Provide fallback icons if service icons fail to load

## Testing Strategy

### Unit Testing
- **Service Data Validation**: Test that all service categories contain required fields
- **Price Format Validation**: Ensure price strings follow consistent format
- **Localization Testing**: Verify French and English content loads correctly

### Integration Testing  
- **Cross-Design Consistency**: Test that services display consistently across all 10 business designs
- **Responsive Testing**: Verify service display on mobile, tablet, and desktop viewports
- **Language Switching**: Test that language switching updates service content correctly

### Visual Regression Testing
- **Design Consistency**: Ensure service cards maintain visual consistency within each business design theme
- **Layout Testing**: Verify service grid layouts work correctly across different screen sizes
- **Typography Testing**: Ensure service text remains readable across all designs

### User Acceptance Testing
- **Service Discovery**: Test that users can easily find and understand service offerings
- **Price Clarity**: Verify that pricing information is clear and not confusing
- **Call-to-Action**: Test that service CTAs lead to appropriate contact methods

## Performance Considerations

### Data Loading Optimization
- **Lazy Loading**: Load service data only when services section comes into view
- **Caching Strategy**: Cache service data in browser storage to reduce repeated requests
- **Bundle Optimization**: Minimize service JSON file sizes while maintaining readability

### Rendering Performance
- **Virtual Scrolling**: For mobile devices, implement virtual scrolling if service list becomes long
- **Image Optimization**: Optimize service category icons for fast loading
- **Animation Performance**: Ensure hover animations don't impact performance on lower-end devices

## Accessibility Considerations

### Screen Reader Support
- **Semantic HTML**: Use proper heading hierarchy for service categories
- **ARIA Labels**: Provide descriptive labels for service pricing information
- **Focus Management**: Ensure keyboard navigation works smoothly through service cards

### Visual Accessibility
- **Color Contrast**: Maintain sufficient contrast ratios for service text and pricing
- **Font Sizing**: Ensure service information remains readable when text is scaled up
- **Focus Indicators**: Provide clear focus indicators for interactive service elements

## Localization Strategy

### Content Management
- **Consistent Translation**: Ensure service names and descriptions are consistently translated
- **Cultural Adaptation**: Adapt pricing display formats for French Canadian preferences
- **Currency Display**: Maintain consistent Canadian dollar formatting across both languages

### Technical Implementation
- **Dynamic Loading**: Load appropriate language service data based on current locale
- **Fallback Strategy**: Provide French content as fallback if English translation is missing
- **URL Structure**: Maintain language-specific URLs for service sections