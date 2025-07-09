import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
import { ai } from '@zerostep/playwright';

test.describe('Workday Careers Site - Sanity & Accessibility', () => {
  test('Home page loads, cookie consent, and job search are accessible', async ({ page }) => {
    await page.goto('https://workday.wd5.myworkdayjobs.com/Workday');
    await expect(page.getByRole('heading', { name: /Careers at Workday/i })).toBeVisible();
    const acceptCookies = page.getByRole('button', { name: /Accept Cookies/i });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
    await page.getByRole('button', { name: /Search for Jobs/i }).click();
    await expect(page.getByText(/JOBS FOUND/)).toBeVisible();
    await expect(page.getByRole('searchbox', { name: /Search/i })).toBeVisible();
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
    if (ai) {
      await ai('Search for a job and validate results are shown', { page, test });
    } else {
      const searchBox = page.getByRole('searchbox', { name: /Search/i });
      await searchBox.fill('engineer');
      await page.getByRole('button', { name: /^Search$/i }).click();
      await expect(page.getByText(/engineer/i)).toBeVisible();
    }
  });

  test('Talent Community and Accessibility', async ({ page }) => {
    await page.goto('https://workday.wd5.myworkdayjobs.com/Workday');
    const acceptCookies = page.getByRole('button', { name: /Accept Cookies/i });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
    await page.getByRole('button', { name: /Search for Jobs/i }).click();
    const talentLink = page.getByRole('link', { name: /Talent Community/i });
    await expect(talentLink).toBeVisible();
    await talentLink.click();
    await expect(page).toHaveURL(/introduceYourself/);
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });
});

// Thorough E2E and accessibility test for Workday Careers site

test.describe('Workday Careers Site - Full E2E & Accessibility', () => {
  test('Job search, filters, and navigation are accessible and functional', async ({ page }) => {
    await page.goto('https://workday.wd5.myworkdayjobs.com/Workday');
    // Accept cookies if visible
    const acceptCookies = page.getByRole('button', { name: /Accept Cookies/i });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
    // Home page heading
    await expect(page.getByRole('heading', { name: /Careers at Workday/i })).toBeVisible();
    // Accessibility check on home
    await injectAxe(page);
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });

    // Navigate to job search
    await page.getByRole('button', { name: /Search for Jobs/i }).click();
    await expect(page.getByText(/JOBS FOUND/)).toBeVisible();
    await expect(page.getByRole('searchbox', { name: /Search/i })).toBeVisible();
    // Accessibility check on job search
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });

    // Test job search functionality
    const searchBox = page.getByRole('searchbox', { name: /Search/i });
    await searchBox.fill('engineer');
    await page.getByRole('button', { name: /^Search$/i }).click();
    await expect(page.getByText(/engineer/i)).toBeVisible();
    // Test filters
    await expect(page.getByRole('button', { name: /Distance or Location/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Time Type/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Remote Type/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /More/i })).toBeVisible();
    // Pagination
    await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
    // Accessibility check after search
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
  });

  test('Talent Community, informational links, and accessibility', async ({ page }) => {
    await page.goto('https://workday.wd5.myworkdayjobs.com/Workday');
    const acceptCookies = page.getByRole('button', { name: /Accept Cookies/i });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
    await page.getByRole('button', { name: /Search for Jobs/i }).click();
    // Talent Community link
    const talentLink = page.getByRole('link', { name: /Talent Community/i });
    await expect(talentLink).toBeVisible();
    await talentLink.click();
    await expect(page).toHaveURL(/introduceYourself/);
    await injectAxe(page);
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
    // Check informational links
    await page.goBack();
    await expect(page.getByRole('link', { name: /benefits/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Contractor Positions at Workday page/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Recruitment Privacy Statement/i })).toBeVisible();
  });

  test('Accessibility: Skip to main content and keyboard navigation', async ({ page }) => {
    await page.goto('https://workday.wd5.myworkdayjobs.com/Workday');
    // Tab to skip link
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: /Skip to main content/i })).toBeVisible();
    // Accessibility check
    await injectAxe(page);
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
  });
});
