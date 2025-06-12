// tests/language-selector.spec.js
import { test, expect } from '@playwright/test';

test.describe('Language and Region Selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should open language selector', async ({ page }) => {
    // Find and click language selector button
    const langButton = page.getByRole('button', { name: 'Language and Region Selector' });
    await expect(langButton).toBeVisible();
    await langButton.click();
    
    // Verify language selection interface appears
    const langSelect = page.getByRole('application', { name: /Language and Region Selector/i });
    await expect(langSelect).toBeVisible();
  });
});
