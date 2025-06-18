import { test, expect } from '@playwright/test';

test.describe('Workday Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Workday');
    // Accept cookies if present
    const acceptButton = page.getByRole('button', { name: 'Accept Cookies' });
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
    }
    await expect(page.getByText(/JOBS FOUND/)).toBeVisible();
  });

  test('Homepage matches visual snapshot', async ({ page }) => {
    // Take screenshot of the entire page
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      mask: [page.getByRole('searchbox')], // Mask dynamic elements
      timeout: 10000
    });
  });

  test('Job listing cards match visual snapshot', async ({ page }) => {
    // Focus on the job listings section
    const jobList = page.getByRole('list', { name: /Page 1 of/ });
    await expect(jobList).toBeVisible();
    await expect(jobList).toHaveScreenshot('job-listings.png', {
      timeout: 10000
    });
  });

  test('Filter dropdowns match visual snapshot', async ({ page }) => {
    // Capture each filter dropdown
    const filters = [
      'Distance or Location',
      'Time Type',
      'Remote Type',
      'More'
    ];

    for (const filterName of filters) {
      const filterButton = page.getByRole('button', { name: filterName });
      await filterButton.click();
      await expect(page).toHaveScreenshot(`filter-${filterName.toLowerCase().replace(/\s+/g, '-')}.png`, {
        animations: 'disabled',
        timeout: 10000
      });
      await filterButton.click(); // Close dropdown
    }
  });

  test('Job details page matches visual snapshot', async ({ page }) => {
    // Click first job listing
    await page.getByRole('listitem').first().getByRole('link').click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Take screenshot of job details
    await expect(page).toHaveScreenshot('job-details.png', {
      fullPage: true,
      timeout: 10000
    });
  });

  test('Mobile layout matches visual snapshot', async ({ page }) => {
    // Test various mobile viewport sizes
    const viewports = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 390, height: 844 }, // iPhone 12
      { width: 414, height: 896 }, // iPhone 11 Pro Max
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(page).toHaveScreenshot(`mobile-${viewport.width}x${viewport.height}.png`, {
        timeout: 10000
      });
    }
  });

  test('Dark mode layout matches visual snapshot', async ({ page }) => {
    // Emulate dark color scheme
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page).toHaveScreenshot('dark-mode.png', {
      fullPage: true,
      timeout: 10000
    });
  });
});
