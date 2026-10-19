import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { ROUTES, HEADERS } from '../utils/index.js';
import testData from '../test-data/users.json' with { type: 'json' };

test.describe('Cart Flow Suite', () => {
  const BACKPACK = 'Sauce Labs Backpack';

  let loginPage;
  let inventoryPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    // Equivalent to @BeforeMethod login
    await loginPage.navigate();
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );

    // Verify redirected to inventory
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
  });

  test('Item added from the inventory page appears in the cart', async ({ page }) => {
    await inventoryPage.addItemToCart(BACKPACK);
    await inventoryPage.openCart();

    // Verify page title, item count, and item presence
    await expect(cartPage.title).toHaveText(HEADERS.CART);
    expect(await cartPage.getCartItemCount()).toBe(1);
    await expect(cartPage.getCartItemByName(BACKPACK)).toBeVisible();
  });

  test('Removing the only item leaves the cart empty', async () => {
    await inventoryPage.addItemToCart(BACKPACK);
    await inventoryPage.openCart();

    // Remove item and assert cart is empty
    await cartPage.removeItemByName(BACKPACK);
    expect(await cartPage.getCartItemCount()).toBe(0);
    await expect(cartPage.getCartItemByName(BACKPACK)).toHaveCount(0);
  });

  test('Continue Shopping returns to the inventory page', async ({ page }) => {
    await inventoryPage.addItemToCart(BACKPACK);
    await inventoryPage.openCart();

    await cartPage.continueShopping();

    // Verify redirection back to inventory page
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
  });
});