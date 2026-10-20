import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage.js';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage.js';
import { ROUTES, HEADERS, ERROR_MESSAGES } from '../utils/index.js';
import testData from '../test-data/users.json' with { type: 'json' };

test.describe('Checkout Flow Suite', () => {
  const ITEM_NAME = 'Sauce Labs Backpack';

  let loginPage;
  let inventoryPage;
  let cartPage;
  let stepOnePage;
  let stepTwoPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    stepOnePage = new CheckoutStepOnePage(page);
    stepTwoPage = new CheckoutStepTwoPage(page);

    // 1. Log in with standard credentials
    await loginPage.navigate();
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );

    // 2. Add product and navigate to cart
    await inventoryPage.addItemToCart(ITEM_NAME);
    await inventoryPage.openCart();
    await expect(page).toHaveURL(new RegExp(ROUTES.CART));
  });

  test('Completing the entire checkout workflow displays the confirmation message', async ({ page }) => {
    // 1. Move from Cart to Step One
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

    // 2. Fill personal information and continue
    await stepOnePage.fillCustomerInformation(
      testData.customer.firstName,
      testData.customer.lastName,
      testData.customer.postalCode
    );

    // 3. Verify Step Two overview screen
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_TWO));
    await expect(stepTwoPage.title).toHaveText(HEADERS.CHECKOUT_OVERVIEW);
    await expect(stepTwoPage.itemSubtotal).toContainText('29.99');

    // 4. Complete purchase and verify final message
    await stepTwoPage.finishOrder();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_COMPLETE));
    await expect(stepTwoPage.completeHeader).toHaveText(HEADERS.COMPLETE);
  });

  test('Submitting step one without postal code shows an error message', async ({ page }) => {
    // 1. Move from Cart to Step One
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

    // 2. Fill first and last name only (omit postal code)
    await stepOnePage.fillCustomerInformation(
      testData.customer.firstName,
      testData.customer.lastName,
      ''
    );

    // 3. Assert error banner visibility and text
    await expect(stepOnePage.errorMessage).toBeVisible();
    await expect(stepOnePage.errorMessage).toContainText(ERROR_MESSAGES.REQUIRED_POSTAL_CODE);
  });
});