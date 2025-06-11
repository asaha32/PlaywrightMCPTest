// tests/footer.spec.js
import { test, expect } from '@playwright/test';

test.describe('Footer Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const footerLinks = [
    'For Finance',
    'For HR',
    'For Planning',
    'For Legal',
    'Platform',
    'Artificial Intelligence',
    'Why Workday',
    'Solutions for Small & Midsize Business',
    'Workday Suite',
    'Marketplace',
    'Customer Experience',
    'Partners',
    'Financial Services',
    'Healthcare',
    'Higher Education',
    'Professional & Business Services',
    'Public Sector',
    'Retail',
    'Technology',
    'See More Industries',
    'Customer Stories',
    'Events',
    'Webinars',
    'Demos',
    'Resource Library',
    'Education & Training',
    'Topics Hub',
    'Blog',
    'About Workday',
    'Corporate Responsibility',
    'Investor Relations',
    'Newsroom',
    'Careers',
    'Login Help',
    'Legal',
    'Privacy',
    'Accessibility',
    'Subscriptions',
    'Your Privacy Choices',
    'Cookie Preferences',
  ];

  for (const linkText of footerLinks) {
    test(`should display footer link: ${linkText}`, async ({ page }) => {
      await page.waitForLoadState('domcontentloaded');
      
      // Handle special cases for non-link elements
      if (linkText === 'Your Privacy Choices') {
        const element = page.getByText(linkText).first();
        await expect(element).toBeVisible();
      } else {
        const link = page.getByRole('link', { name: new RegExp(linkText, 'i') }).first();
        await expect(link).toBeVisible();
      }
    });
  }
});
