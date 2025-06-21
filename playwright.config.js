// @ts-check
import { defineConfig, devices } from '@playwright/test';

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  use: {
    baseURL: 'https://workday.wd5.myworkdayjobs.com',
    headless: false,  // Run in headed mode for debugging
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,  // Increase action timeout
    navigationTimeout: 30000,  // Increase navigation timeout
    launchOptions: {
      args: ['--disable-dev-shm-usage']
    },
    // Handle cookie consent automatically
    contextOptions: {
      acceptDownloads: true
    }
  },
  testDir: './tests',
  reporter: [['html'], ['list']],
  timeout: 90000,  // Increase overall timeout
  retries: 0,  // No retries as per requirements
  expect: {
    timeout: 15000  // Increase expect timeout
  },
  workers: 1, // Run tests sequentially for stability
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
};

export default config;
