// tests/cta.spec.js
import { test, expect } from '@playwright/test';

test.describe('Homepage CTAs and Headings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display "Register Now" CTA', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const registerNow = page.getByRole('link', { name: /Register Now/i }).first();
    await expect(registerNow).toBeVisible();
  });

  test('should display "Solutions for businesses of all sizes." heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /Solutions for businesses of all sizes/i });
    await expect(heading).toBeVisible();
  });

  test('should display "Ready to talk? Get in touch." heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /Ready to talk\? Get in touch\./i });
    await expect(heading).toBeVisible();
  });
});
