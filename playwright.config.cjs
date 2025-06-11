// playwright.config.js
// Playwright config for running tests
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  use: {
    baseURL: 'https://www.workday.com',
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
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
  timeout: 60000,
  retries: 2,
  expect: {
    timeout: 10000
  },
  workers: 1 // Run tests sequentially for stability
};

module.exports = config;
