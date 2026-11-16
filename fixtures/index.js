import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage.js';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage.js';
import { ROUTES, HEADERS } from '../utils/index.js';
import testData from '../test-data/users.json' with { type: 'json' };

/**
 * Extended test object: page objects are created per test, and the `loggedIn`
 * fixture signs in as the standard user. Request `loggedIn` in a test's arguments
 * only when it needs an authenticated session.
 */
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  stepOnePage: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },
  stepTwoPage: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page));
  },

  loggedIn: async ({ page, loginPage, inventoryPage }, use) => {
    await loginPage.navigate();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);
    await use();
  },
});

export { expect };
