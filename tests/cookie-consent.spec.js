// tests/cookie-consent.spec.js
import { test, expect } from '@playwright/test';

test.describe('Cookie Consent', () => {
  test('should display and handle cookie consent', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Find cookie preferences link
    const cookiePrefsLink = page.getByRole('link', { name: /Cookie Preferences/i });
    await expect(cookiePrefsLink).toBeVisible();

    // Check cookie dialog
    const cookieDialog = page.getByRole('dialog', { name: /Your choices regarding the use of cookies/i });
    await expect(cookieDialog).toBeVisible();

    // Verify cookie preferences modal can be opened
    await cookiePrefsLink.click();
    const modal = page.getByRole('complementary', { name: /Open Cookie Preferences Modal/i });
    await expect(modal).toBeVisible();
  });
});
