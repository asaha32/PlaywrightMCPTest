// tests/customer-stories.spec.js
import { test, expect } from '@playwright/test';

test.describe('Customer Stories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display customer stories section', async ({ page }) => {
    // Check "Forward thinkers. Inspiring results." heading
    const heading = page.getByRole('heading', { name: /Forward thinkers\. Inspiring results\./i });
    await expect(heading).toBeVisible();

    // Check "See all customer stories" link
    const allStoriesLink = page.getByRole('link', { name: /All Customer Stories/i });
    await expect(allStoriesLink).toBeVisible();
    
    // Verify customer story cards
    const customerStories = [
      { company: 'PUMA', text: /Simplified processes/i },
      { company: 'McLaren', text: /Improved financial forecasting/i },
      { company: 'Villeroy & Boch', text: /Streamlined HR processes/i },
      { company: 'Just Eat Takeaway', text: /Resilient platform/i }
    ];

    for (const story of customerStories) {
      const logo = page.getByRole('img', { name: new RegExp(story.company, 'i') });
      await expect(logo).toBeVisible();
      const text = page.getByText(story.text);
      await expect(text).toBeVisible();
    }
  });

  test('should navigate to customer story details', async ({ page, context }) => {
    const storyLink = page.getByRole('link', { name: /Read the PUMA customer story/i });
    await expect(storyLink).toBeVisible();
    
    // Click the link and wait for the new page
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      storyLink.click()
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    
    // Verify we're on the PUMA story page
    await expect(newPage.url()).toContain('puma');
  });
});
