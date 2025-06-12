// tests/external-links.spec.js
import { test, expect } from '@playwright/test';

test.describe('External Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should open social media links in new tabs', async ({ page, context }) => {
    const socialLinks = [
      { name: 'Go to X', url: 'x.com/workday' },
      { name: 'Go to LinkedIn', url: 'linkedin.com/company/workday' },
      { name: 'Go to Facebook', url: 'facebook.com/workday' },
      { name: 'Go to Instagram', url: 'instagram.com/workday' },
      { name: 'Go to YouTube', url: 'youtube.com/user/workdayvideo' }
    ];

    for (const social of socialLinks) {
      const link = page.getByRole('link', { name: social.name });
      await expect(link).toBeVisible();
      
      // Click the link and verify new tab
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        link.click()
      ]);
      
      await expect(newPage.url()).toContain(social.url);
      await newPage.close();
    }
  });

  test('should open external content in new tabs', async ({ page, context }) => {
    const externalLinks = [
      { name: /Investor Relations/i, url: 'investor.workday.com' },
      { name: /Blog/i, url: 'blog.workday.com' },
      { name: /Marketplace/i, url: 'marketplace.workday.com' }
    ];

    for (const link of externalLinks) {
      const linkElement = page.getByRole('link', { name: new RegExp(link.name + /.*Opens in a new tab/i.source) });
      await expect(linkElement).toBeVisible();
      
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        linkElement.click()
      ]);
      
      await expect(newPage.url()).toContain(link.url);
      await newPage.close();
    }
  });
});
