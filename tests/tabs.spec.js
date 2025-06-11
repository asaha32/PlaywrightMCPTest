// tests/tabs.spec.js
import { test, expect } from '@playwright/test';

test.describe('Homepage Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const tabs = [
    'All',
    'For HR',
    'For Finance',
    'For IT',
    'For Legal',
  ];

  for (const tab of tabs) {
    test(`should switch to tab: ${tab} and display content`, async ({ page }) => {
      // Wait for tab panel to be ready
      await page.waitForLoadState('domcontentloaded');
      
      const tabBtn = page.getByRole('tab', { name: tab }).first();
      await expect(tabBtn).toBeVisible();
      await tabBtn.click();
      
      // Wait for tab panel to update
      await page.waitForTimeout(1000);
      
      // Check tab panel visibility
      const tabPanel = page.getByRole('tabpanel').first();
      await expect(tabPanel).toBeVisible();
    });
  }
});
