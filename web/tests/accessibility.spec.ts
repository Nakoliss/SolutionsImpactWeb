import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Test configuration
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Homepage (French) should not have accessibility violations', async ({ page }) => {
    await page.goto(`${baseURL}/fr`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Homepage (English) should not have accessibility violations', async ({ page }) => {
    await page.goto(`${baseURL}/en`);
    
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Compliance hub (French) should not have accessibility violations', async ({ page }) => {
    await page.goto(`${baseURL}/fr/compliance`);
    
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Compliance hub (English) should not have accessibility violations', async ({ page }) => {
    await page.goto(`${baseURL}/en/compliance`);
    
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Bill 64 content page should not have accessibility violations', async ({ page }) => {
    await page.goto(`${baseURL}/fr/content/compliance/bill-64-data-residency-guide`);
    
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Should have proper heading hierarchy', async ({ page }) => {
    await page.goto(`${baseURL}/fr/compliance`);
    
    await page.waitForLoadState('networkidle');
    
    // Check for h1 element
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBeGreaterThan(0);
    expect(h1Elements).toBe(1); // Should have exactly one h1
    
    // Check heading order (h1 should come before h2, etc.)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels = await Promise.all(
      headings.map(async (heading) => {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        return parseInt(tagName.charAt(1));
      })
    );
    
    // First heading should be h1
    expect(headingLevels[0]).toBe(1);
  });

  test('Should have proper color contrast', async ({ page }) => {
    await page.goto(`${baseURL}/fr/compliance`);
    
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('*')
      .analyze();

    // Filter for color contrast violations specifically
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('Forms should be accessible', async ({ page }) => {
    await page.goto(`${baseURL}/fr/content/compliance/bill-64-data-residency-guide`);
    
    await page.waitForLoadState('networkidle');
    
    // Check if forms exist on page
    const forms = await page.locator('form').count();
    
    if (forms > 0) {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .include('form')
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
      
      // Additional form-specific checks
      const inputs = await page.locator('input[type="text"], input[type="email"], select, textarea').all();
      
      for (const input of inputs) {
        // Each input should have a label or aria-label
        const hasLabel = await input.evaluate(el => {
          const id = el.getAttribute('id');
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledBy = el.getAttribute('aria-labelledby');
          
          if (ariaLabel || ariaLabelledBy) return true;
          if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            return !!label;
          }
          return false;
        });
        
        expect(hasLabel).toBe(true);
      }
    }
  });

  test('Should have proper focus management', async ({ page }) => {
    await page.goto(`${baseURL}/fr/compliance`);
    
    await page.waitForLoadState('networkidle');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = await page.locator(':focus').first();
    const isVisible = await focusedElement.isVisible();
    
    expect(isVisible).toBe(true);
  });

  test('Should have proper ARIA landmarks', async ({ page }) => {
    await page.goto(`${baseURL}/fr/compliance`);
    
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();

    // Filter for landmark violations
    const landmarkViolations = accessibilityScanResults.violations.filter(
      violation => violation.id.includes('landmark') || violation.id.includes('region')
    );

    expect(landmarkViolations).toEqual([]);
  });

  test('Should handle screen reader text properly', async ({ page }) => {
    await page.goto(`${baseURL}/fr/compliance`);
    
    await page.waitForLoadState('networkidle');
    
    // Check for proper use of screen reader only text
    const srOnlyElements = await page.locator('.sr-only, .screen-reader-text').all();
    
    for (const element of srOnlyElements) {
      const text = await element.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });
});

// Accessibility utilities for custom tests
export class AccessibilityHelper {
  static async checkColorContrast(page: any, selector: string) {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(selector)
      .withTags(['wcag2aa'])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );

    return contrastViolations.length === 0;
  }

  static async checkKeyboardNavigation(page: any) {
    // Tab through all focusable elements
    let focusableCount = 0;
    let previousElement = null;
    
    while (focusableCount < 20) { // Prevent infinite loop
      await page.keyboard.press('Tab');
      const currentElement = await page.locator(':focus').first();
      
      if (previousElement && await currentElement.isVisible()) {
        const isSameElement = await currentElement.evaluate((el, prev) => el === prev, previousElement);
        if (isSameElement) break;
      }
      
      previousElement = currentElement;
      focusableCount++;
    }
    
    return focusableCount > 0;
  }

  static async generateAccessibilityReport(page: any) {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    return {
      violations: accessibilityScanResults.violations.length,
      passes: accessibilityScanResults.passes.length,
      incomplete: accessibilityScanResults.incomplete.length,
      inapplicable: accessibilityScanResults.inapplicable.length,
      url: page.url(),
      timestamp: new Date().toISOString()
    };
  }
}