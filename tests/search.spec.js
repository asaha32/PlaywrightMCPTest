// tests/search.spec.js
import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should open search and submit a query', async ({ page }) => {
    // Click search button
    const searchButton = page.getByRole('button', { name: 'Search' }).first();
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    // Wait for search input
    const searchInput = page.getByRole('textbox', { name: /search/i });
    await expect(searchInput).toBeVisible();
    await searchInput.fill('AI');
    await searchInput.press('Enter');

    // Verify search results page
    await expect(page.url()).toContain('search');
    await expect(page.getByRole('heading', { name: /search results/i })).toBeVisible();
  });
});
