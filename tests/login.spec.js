import { test, expect } from '../fixtures/index.js';
import { ROUTES, ERROR_MESSAGES, HEADERS } from '../utils/index.js';
import testData from '../test-data/users.json' with { type: 'json' };

test.describe('Swag Labs - Authentication Suite', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test(
    'TC_LOGIN_001 - Standard user logs in and lands on the inventory page',
    { tag: '@smoke' },
    async ({ page, loginPage, inventoryPage }) => {
      await loginPage.login(testData.validUser.username, testData.validUser.password);

      await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
      await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);
    }
  );

  test('TC_LOGIN_002 - Locked-out user sees an error message', async ({ loginPage }) => {
    await loginPage.login(testData.lockedUser.username, testData.lockedUser.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.LOCKED_OUT);
  });

  test('TC_LOGIN_003 - Empty username shows a required-field error', async ({ loginPage }) => {
    await loginPage.login('', testData.validUser.password);

    await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.REQUIRED_USERNAME);
  });

  test('TC_LOGIN_004 - Empty password shows a required-field error', async ({ loginPage }) => {
    await loginPage.login(testData.validUser.username, '');

    await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.REQUIRED_PASSWORD);
  });

  test('TC_LOGIN_005 - Wrong password shows a credentials-mismatch error', async ({
    loginPage,
  }) => {
    await loginPage.login(testData.validUser.username, 'wrong_password');

    await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.USER_NOT_MATCH);
  });
});
