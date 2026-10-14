const { test, expect } = require('@playwright/test');

test('Verify Swag Labs title', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await expect(page).toHaveTitle(/Swag Labs/);
});