import { test, expect } from '../fixtures/index.js';
import { ROUTES, HEADERS, ERROR_MESSAGES, PRODUCTS, generateZipCode } from '../utils/index.js';
import testData from '../test-data/users.json' with { type: 'json' };

test.describe('Checkout Flow Suite', () => {
  test.beforeEach(async ({ page, loggedIn, inventoryPage }) => {
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
    await inventoryPage.openCart();
    await expect(page).toHaveURL(new RegExp(ROUTES.CART));
  });

  test('Completing the entire checkout workflow displays the confirmation message', async ({
    page,
    cartPage,
    stepOnePage,
    stepTwoPage,
  }) => {
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

    await stepOnePage.fillCustomerInformation(
      testData.customer.firstName,
      testData.customer.lastName,
      generateZipCode()
    );

    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_TWO));
    await expect(stepTwoPage.title).toHaveText(HEADERS.CHECKOUT_OVERVIEW);
    await expect(stepTwoPage.itemSubtotal).toContainText('29.99');

    await stepTwoPage.finishOrder();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_COMPLETE));
    await expect(stepTwoPage.completeHeader).toHaveText(HEADERS.COMPLETE);
  });

  test('Submitting step one without postal code shows an error message', async ({
    page,
    cartPage,
    stepOnePage,
  }) => {
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

    await stepOnePage.fillCustomerInformation(
      testData.customer.firstName,
      testData.customer.lastName,
      ''
    );

    await expect(stepOnePage.errorMessage).toBeVisible();
    await expect(stepOnePage.errorMessage).toContainText(ERROR_MESSAGES.REQUIRED_POSTAL_CODE);
  });
});
