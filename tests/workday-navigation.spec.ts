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
