import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import testData from '../test-data/users.json' with { type: 'json' };

test.describe('Swag Labs - Authentication Suite', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC01 - Negative: Locked-out user should see an error message', async () => {
    await loginPage.login(
      testData.lockedUser.username,
      testData.lockedUser.password
    );

    // Verify error banner is visible and has correct message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('TC02 - Positive: Standard user should log in successfully and redirect to inventory', async ({ page }) => {
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );

    // Verify successful redirection to inventory
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });
});