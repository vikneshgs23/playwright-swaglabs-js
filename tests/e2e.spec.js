import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage.js';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage.js';
import { ROUTES, HEADERS } from '../utils/index.js';
import testData from '../test-data/users.json' with { type: 'json' };

test.describe('Swag Labs - End-to-End User Journeys', () => {
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

    await loginPage.navigate();
  });

  test('TC_E2E_001 - Verify end-to-end multi-item purchase flow', async ({ page }) => {
    const item1 = 'Sauce Labs Backpack';
    const item2 = 'Sauce Labs Bike Light';

    // 1. Log in with valid credentials
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);

    // 2. Add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to cart
    await inventoryPage.addItemToCart(item1);
    await inventoryPage.addItemToCart(item2);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('2');

    // 3. Click the shopping cart icon
    await inventoryPage.openCart();
    await expect(page).toHaveURL(new RegExp(ROUTES.CART));

    // 4. Verify selected items are listed, then click 'Checkout'
    expect(await cartPage.getCartItemCount()).toBe(2);
    await expect(cartPage.getCartItemByName(item1)).toBeVisible();
    await expect(cartPage.getCartItemByName(item2)).toBeVisible();
    await cartPage.proceedToCheckout();

    // 5. Enter First Name, Last Name, and Postal Code
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));
    await stepOnePage.fillCustomerInformation(
      testData.customer.firstName,
      testData.customer.lastName,
      testData.customer.postalCode
    );

    // 6. Click 'Continue' (verified by arriving at step two overview)
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_TWO));
    await expect(stepTwoPage.title).toHaveText(HEADERS.CHECKOUT_OVERVIEW);

    // 7. Verify item total, tax, and total amount on 'Checkout: Overview'
    await expect(stepTwoPage.itemSubtotal).toContainText('Item total: $39.98');
    await expect(stepTwoPage.taxLabel).toContainText('Tax: $3.20');
    await expect(stepTwoPage.totalLabel).toContainText('Total: $43.18');

    // 8. Click 'Finish'
    await stepTwoPage.finishOrder();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_COMPLETE));
    await expect(stepTwoPage.completeHeader).toHaveText(HEADERS.COMPLETE);
  });

  
});