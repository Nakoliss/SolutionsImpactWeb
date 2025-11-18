# Chatbot Gate Testing Guide

## Overview

This document provides manual testing steps and GA4 event verification for the bilingual AI receptionist (chatbot) implementation with consent gate.

## Prerequisites

1. Set `NEXT_PUBLIC_CRISP_ID` environment variable with your Crisp website ID
2. Ensure GA4 is configured and tracking is enabled
3. Have access to:
   - Browser DevTools (Network tab, Console, Application/Storage)
   - Google Analytics 4 Real-time reports
   - Crisp dashboard

## Manual Testing Checklist

### 1. Consent Gate Banner Display

- [ ] **Fresh visit (no consent stored)**
  - Visit `/fr` or `/en`
  - Verify consent banner appears at bottom of page
  - Verify banner shows correct language (FR/EN)
  - Verify banner includes privacy policy link
  - Verify banner has "Enable chat" and "No thanks" buttons

- [ ] **Banner styling**
  - Verify banner is visible and not hidden behind other elements
  - Verify banner is responsive on mobile devices
  - Verify banner z-index allows interaction

### 2. Consent Persistence

- [ ] **Accept consent**
  - Click "Enable chat" button
  - Clear page cache and reload
  - Verify banner does NOT reappear
  - Check `localStorage` for `chatbot_consent` key
  - Verify consent object has `granted: true` and `timestamp`

- [ ] **Decline consent**
  - Clear `localStorage` and reload
  - Click "No thanks" button
  - Reload page
  - Verify banner does NOT reappear
  - Check `localStorage` for `chatbot_consent` with `granted: false`

- [ ] **Privacy link**
  - Click privacy policy link in banner
  - Verify it navigates to `/{locale}/compliance/privacy`
  - Verify privacy page loads correctly

### 3. Script Loading (Post-Consent)

- [ ] **No script before consent**
  - Open DevTools → Network tab
  - Filter by "crisp" or "l.js"
  - Visit page without consent
  - Verify NO Crisp script is loaded
  - Verify no `window.$crisp` object exists

- [ ] **Script loads after consent**
  - Grant consent via banner
  - Check Network tab
  - Verify `https://client.crisp.chat/l.js` is loaded
  - Verify `window.$crisp` object exists
  - Verify `window.CRISP_WEBSITE_ID` is set correctly
  - Verify `window.CRISP_RUNTIME_CONFIG.locale` matches page locale

### 4. Crisp Configuration

- [ ] **Locale configuration**
  - On `/fr` page, grant consent
  - Check `window.CRISP_RUNTIME_CONFIG.locale` = `'fr'`
  - On `/en` page, grant consent
  - Check `window.CRISP_RUNTIME_CONFIG.locale` = `'en'`

- [ ] **Pre-chat form**
  - Open Crisp chat widget (after consent)
  - Verify pre-chat form requests Name and Email
  - Verify project question is displayed (if configured in Crisp dashboard)
  - Verify booking button/link to `/{locale}/contact` is visible (if configured)

### 5. GA4 Event Tracking

All events should only fire AFTER consent is granted.

- [ ] **chat_consent_granted event**
  - Open DevTools → Console
  - Clear console
  - Click "Enable chat" button
  - Verify event is logged (in development) or sent to GA4
  - Check GA4 Real-time → Events
  - Verify `chat_consent_granted` event appears
  - Verify event properties include `provider: 'crisp'` and `locale: 'fr'` or `'en'`

- [ ] **chat_loaded event**
  - Grant consent
  - Open Crisp chat widget
  - Verify `chat_loaded` event fires
  - Check GA4 Real-time → Events
  - Verify event appears with correct properties

- [ ] **chat_booking_click event**
  - Grant consent and open chat
  - Send a message containing "book", "réservation", or "diagnostic"
  - Verify `chat_booking_click` event fires
  - Check GA4 Real-time → Events
  - Verify event appears

### 6. Bilingual Flow

- [ ] **French locale**
  - Visit `/fr`
  - Verify banner text is in French
  - Grant consent
  - Verify Crisp widget language is French
  - Verify all GA4 events have `locale: 'fr'`

- [ ] **English locale**
  - Visit `/en`
  - Verify banner text is in English
  - Grant consent
  - Verify Crisp widget language is English
  - Verify all GA4 events have `locale: 'en'`

### 7. Privacy Policy Updates

- [ ] **Subcontractors section**
  - Visit `/{locale}/compliance/privacy`
  - Scroll to subcontractors/processors section
  - Verify Crisp is listed with:
    - Service: "AI chatbot and live chat support"
    - Purpose description (FR/EN)
    - Data handled: Name, Email, Chat messages, IP address, Browser metadata
    - Location: European Union (GDPR compliant, ISO 27001)
    - Privacy URL: https://crisp.chat/en/privacy/

- [ ] **Data collected section**
  - Verify chatbot data collection is mentioned
  - Verify it states data is collected "only after explicit consent"

- [ ] **Individual rights section**
  - Verify 30-day data access/deletion process is mentioned
  - Verify it mentions coordination with Crisp for data removal

### 8. Edge Cases

- [ ] **Missing Crisp ID**
  - Remove `NEXT_PUBLIC_CRISP_ID` env variable
  - Verify component does not render
  - Verify no errors in console

- [ ] **Invalid consent storage**
  - Manually set invalid JSON in `localStorage.chatbot_consent`
  - Reload page
  - Verify banner appears (consent reset)
  - Verify no console errors

- [ ] **Script load failure**
  - Block `client.crisp.chat` in DevTools → Network conditions
  - Grant consent
  - Verify no infinite retry loops
  - Verify error is logged gracefully

## GA4 Event Reference

### Event: `chat_consent_granted`
- **When**: User clicks "Enable chat" button
- **Properties**:
  - `provider`: `'crisp'`
  - `locale`: `'fr'` or `'en'`

### Event: `chat_loaded`
- **When**: Crisp chat widget opens after consent
- **Properties**:
  - `provider`: `'crisp'`
  - `locale`: `'fr'` or `'en'`

### Event: `chat_booking_click`
- **When**: User sends message containing booking-related keywords
- **Properties**:
  - `provider`: `'crisp'`
  - `locale`: `'fr'` or `'en'`

## Monthly Reporting

For SEO/AEO and Maintenance reports, track:
- `chat_consent_granted` - Consent rate
- `chat_loaded` - Chat engagement
- `chat_booking_click` - Conversion to booking

## Troubleshooting

### Banner not appearing
- Check `localStorage` for existing consent
- Clear `localStorage.chatbot_consent` and reload
- Verify component is mounted in layout

### Script not loading
- Verify `NEXT_PUBLIC_CRISP_ID` is set
- Check Network tab for script request
- Verify consent was granted
- Check console for errors

### GA4 events not firing
- Verify GA4 is initialized
- Check browser console for errors
- Verify consent was granted (events only fire post-consent)
- Check GA4 Real-time reports (may take a few seconds)

### Crisp widget not showing
- Verify script loaded successfully
- Check `window.$crisp` exists
- Verify `window.CRISP_WEBSITE_ID` is set
- Check Crisp dashboard for widget configuration

## Notes

- Pre-chat form configuration (Name + Email fields, project question, booking button) should be configured in the Crisp dashboard under Settings > Pre-chat form
- The booking button link to `/{locale}/contact` should be added via Crisp's automation rules or custom messages in the dashboard
- All GA4 events are only tracked after explicit user consent to comply with Law 25

