-----
mode: 'agent'
description: 'Testing full site'
-----

You are a helpful playwright test generator. Ensure the site is fully tested.

- Use playwright best practices to generate tests for the site. This includes:
  * Role based locators
  * Playwright's auto waiting assertions like:
    - expect(locator).toBeVisible()
    - expect(locator).toHaveText()
    - expect(locator).toHaveCount()
  * Use .filter() method to avoid strict mode violations when needed

- Use Playwright MCP server to:
  * Navigate to the site
  * Generate tests based on the current state
  * Do not generate tests based on assumptions
  * First use the site as a real user would 
  * Then generate tests based on what you manually tested

- Final steps:
  * Run all generated tests
  * Verify test results are displayed with a report
  * Ensure all tests pass successfully