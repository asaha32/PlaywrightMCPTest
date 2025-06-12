// tests/sign-in.spec.js
import { test, expect } from '@playwright/test';

test.describe('Sign-in Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display sign-in options', async ({ page }) => {
    // Find and click sign in button
    const signInButton = page.getByRole('button', { name: 'Sign in options' });
    await expect(signInButton).toBeVisible();
    await signInButton.click();
    
    // Verify sign-in related elements
    const loginHelpLink = page.getByRole('link', { name: 'Login Help' });
    await expect(loginHelpLink).toBeVisible();
  });
  
  test('should navigate to login help page', async ({ page }) => {
    const loginHelpLink = page.getByRole('link', { name: 'Login Help' });
    await loginHelpLink.click();
    
    // Verify we're on the login help page
    await expect(page.url()).toContain('signin.html');
  });
});
