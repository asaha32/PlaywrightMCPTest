// tests/navigation.spec.js
import { test, expect } from '@playwright/test';

test.describe('Main Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Handle cookie consent if it appears
    const cookieButton = page.getByRole('button', { name: /accept|agree|got it/i });
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
    }
  });

  test('should display all main navigation items', async ({ page }) => {
    // Check main navigation items that are buttons within headings
    const headerButtons = ['Products', 'Industries', 'Customers', 'Learn', 'Partners', 'Company'];
    for (const label of headerButtons) {
      const heading = page.getByRole('heading', { name: label, level: 2 });
      await expect(heading).toBeVisible();
      const btn = heading.getByRole('button');
      await expect(btn).toBeVisible();
    }

    // Check special buttons
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in options' })).toBeVisible();
    
    // Check Contact Sales link
    await expect(page.getByRole('link', { name: 'Contact Sales' })).toBeVisible();
  });
});
