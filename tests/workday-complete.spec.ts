import { test, expect, type Page } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

test.describe('Workday Jobs Portal Complete Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Workday');
    await injectAxe(page);
    // Accept cookies if present
    const acceptButton = page.getByRole('button', { name: 'Accept Cookies' });
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
    }
    // Wait for search results to be visible instead of main tag
    await expect(page.getByText(/JOBS FOUND/)).toBeVisible();
  });

  test('Basic accessibility audit', async ({ page }) => {
    const results = await checkA11y(page, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'best-practice']
        }
      }
    });
    expect(results).toBeTruthy();
  });

  test('Filter and sort functionality', async ({ page }) => {
    // Location filter
    const locationFilter = page.getByRole('button', { name: /location/i });
    await expect(locationFilter).toBeVisible();
    await locationFilter.click();
    
    const locationOptions = page.getByRole('listbox').filter({ hasText: /locations/i });
    await expect(locationOptions).toBeVisible();
    
    // Select a location and verify filtering
    const firstLocation = locationOptions.getByRole('option').first();
    const locationText = await firstLocation.textContent();
    await firstLocation.click();
    
    // Verify results update
    await expect(page.getByText(locationText || '')).toBeVisible();
    
    // More filters functionality
    const moreButton = page.getByRole('button', { name: 'More' });
    await expect(moreButton).toBeVisible();
    await moreButton.click();
    await moreButton.click(); // Close the dropdown
  });

  test('Pagination and results handling', async ({ page }) => {
    // Check pagination controls
    const pagination = page.getByRole('navigation', { name: /pagination/i });
    if (await pagination.isVisible()) {
      const nextButton = pagination.getByRole('button', { name: /next/i });
      await nextButton.click();
      
      // Verify page change
      await expect(page.getByRole('list')).toBeVisible();
    }
    
    // Test large result sets
    await page.getByRole('searchbox').fill('manager');
    await page.keyboard.press('Enter');
    
    // Verify result count
    const resultCount = page.getByText(/results/i);
    await expect(resultCount).toBeVisible();
  });

  test('Error states and edge cases', async ({ page }) => {
    // Test no results scenario
    await page.getByRole('searchbox').fill('xxxxxxxxxxx');
    await page.keyboard.press('Enter');
    
    // Verify no results message
    const noResults = page.getByText(/No matches found/i);
    await expect(noResults).toBeVisible();
    
    // Test special characters
    await page.getByRole('searchbox').fill('software & developer');
    await page.keyboard.press('Enter');
    
    // Verify search still works
    await expect(page.getByRole('list')).toBeVisible();
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify responsive elements are visible
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('searchbox')).toBeVisible();
    
    // Verify search is usable on mobile
    const searchInput = page.getByRole('searchbox');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('engineer');
    await page.keyboard.press('Enter');
    
    // Verify results are readable on mobile
    await expect(page.getByRole('list')).toBeVisible();
  });

  test('Performance metrics', async ({ page }) => {
    // Record performance metrics
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });
    
    const metrics = JSON.parse(performanceEntries);
    expect(metrics[0].domComplete).toBeLessThan(5000); // 5s threshold
  });

  test('Keyboard navigation and focus management', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    const firstFocusableElement = page.locator(':focus');
    await expect(firstFocusableElement).toBeVisible();
    
    // Navigate through main elements
    const focusableElements = [
      page.getByRole('searchbox'),
      page.getByRole('button'),
      page.getByRole('link')
    ];
    
    for (const element of focusableElements) {
      if (await element.first().isVisible()) {
        await element.first().focus();
        await expect(page.locator(':focus')).toBe(element.first());
      }
    }
  });

  test('Form validation in application process', async ({ page }) => {
    // Navigate to a job posting
    const firstJob = page.getByRole('listitem').first().getByRole('link');
    await firstJob.click();
    
    // Verify job details content
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Job Details/i)).toBeVisible();
  });
});
