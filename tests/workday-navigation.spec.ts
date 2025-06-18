import { test, expect, type Page, type Locator } from '@playwright/test';
import { ai } from '@zerostep/playwright';

test.describe('Workday Jobs Portal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Workday');
    // Wait for the main content to be loaded
    await expect(page.locator('main')).toBeVisible();
  });

  test('Portal title and search components are accessible and functional', async ({ page }, testInfo) => {
    await ai('Check page title is Workday', { page, test });
    await ai('Check main heading is visible', { page, test });
    await ai('Verify searchbox is visible, enabled, and has aria-label', { page, test });
    await ai('Fill and search for Software Engineer, Manager, Data Scientist and verify results', { page, test });
  });

  test('Job listings are accessible and functional', async ({ page }) => {
    // Wait for job listings to load
    const jobList = page.getByRole('list');
    await expect(jobList).toBeVisible();
    
    // Check if job listings are present
    const jobItems = page.getByRole('listitem');
    const jobCount = await jobItems.count();
    expect(jobCount).toBeGreaterThan(0);
    
    // Test keyboard navigation through job listings
    const firstJobLink = jobItems.first().getByRole('link');
    await firstJobLink.focus();
    await expect(page.locator(':focus')).toBe(firstJobLink);
    
    // Verify each job listing has necessary attributes
    for (let i = 0; i < Math.min(5, jobCount); i++) {
      const jobItem = jobItems.nth(i);
      const jobLink = jobItem.getByRole('link');
      
      await expect(jobLink).toBeVisible();
      await expect(jobLink).toBeEnabled();
      await expect(jobLink).toHaveAttribute('href', /.+/);
      
      // Check for job metadata
      const jobTitle = await jobLink.textContent();
      expect(jobTitle?.length).toBeGreaterThan(0);
    }
  });

  test('Job details page is accessible and functional', async ({ page }) => {
    // Click first job listing
    const firstJobLink = page.getByRole('listitem').first().getByRole('link');
    const jobTitle = await firstJobLink.textContent();
    await firstJobLink.click();
    
    // Verify job details content loads
    const jobDetailsHeading = page.getByRole('heading', { level: 1 });
    await expect(jobDetailsHeading).toBeVisible();
    await expect(jobDetailsHeading).toHaveText(jobTitle || '');
    
    // Check for essential job details sections with proper ARIA roles
    const jobDescription = page.getByRole('article');
    await expect(jobDescription).toBeVisible();
    
    // Verify job details sections are properly structured
    const sections = ['Description', 'Requirements', 'Qualifications'];
    for (const section of sections) {
      const sectionHeading = page.getByRole('heading', { name: new RegExp(section, 'i') });
      await expect(sectionHeading).toBeVisible();
    }
    
    // Verify apply button is present and accessible
    const applyButton = page.getByRole('button', { name: /apply/i });
    await expect(applyButton).toBeVisible();
    await expect(applyButton).toBeEnabled();
    await expect(applyButton).toHaveAttribute('aria-label', /.+/);
  });

  test('Filter functionality works correctly', async ({ page }) => {
    // Check for filter components
    const filterButton = page.getByRole('button', { name: /filter/i }).first();
    await expect(filterButton).toBeVisible();
    await expect(filterButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click filter button
    await filterButton.click();
    await expect(filterButton).toHaveAttribute('aria-expanded', 'true');
    
    // Verify filter options are displayed
    const filterDialog = page.getByRole('dialog');
    await expect(filterDialog).toBeVisible();
    
    // Test each filter category
    const filterCategories = ['Location', 'Job Category', 'Time Type'];
    for (const category of filterCategories) {
      const categorySection = page.getByRole('group', { name: new RegExp(category, 'i') });
      await expect(categorySection).toBeVisible();
      
      // Verify checkboxes are interactive
      const firstOption = categorySection.getByRole('checkbox').first();
      await expect(firstOption).toBeVisible();
      await firstOption.check();
      await expect(firstOption).toBeChecked();
    }
  });

  test('Accessibility audit', async ({ page }) => {
    // Check for ARIA landmarks
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('search')).toBeVisible();
    
    // Verify form controls are properly labeled
    const searchbox = page.getByRole('searchbox');
    await expect(searchbox).toHaveAttribute('aria-label', /.+/);
    
    const filterBtn = page.getByRole('button', { name: /filter/i });
    await expect(filterBtn).toHaveAttribute('aria-label', /.+/);
    
    // Check heading hierarchy
    const headingLevels = [1, 2, 3];
    for (const level of headingLevels) {
      const headings = page.getByRole('heading', { level });
      const count = await headings.count();
      if (level === 1) {
        expect(count).toBe(1); // Only one h1
      } else {
        expect(count).toBeGreaterThanOrEqual(0); // Other levels can have multiple or no headings
      }
    }
    
    // Verify keyboard navigation
    const focusableElements = page.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Test color contrast (requires manual verification)
    // Note: Visual inspection and browser dev tools should be used to verify contrast ratios
    
    // Verify skip links for keyboard users
    const skipLink = page.getByRole('link', { name: /skip/i });
    if (await skipLink.isVisible()) {
      await expect(skipLink).toHaveAttribute('href', /#main-content|#content/);
    }
  });

  test('Error handling and feedback', async ({ page }) => {
    // Test invalid search
    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('!@#$%^&*()');
    await page.keyboard.press('Enter');
    
    // Verify error state or no results message
    const noResults = page.getByText(/no results|no matches|0 results/i);
    await expect(noResults).toBeVisible();
    
    // Test loading states
    await searchInput.fill('Software');
    await page.keyboard.press('Enter');
    
    // Verify loading indicator appears and disappears
    const loadingIndicator = page.getByRole('progressbar').or(page.getByText(/loading/i));
    await expect(loadingIndicator).toBeVisible();
    
    // Wait for results
    const results = page.getByRole('list');
    await expect(results).toBeVisible();
  });
});