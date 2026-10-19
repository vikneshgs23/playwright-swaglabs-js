import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { ROUTES, HEADERS } from '../utils/index.js';
import testData from '../test-data/users.json' with { type: 'json' };

test.describe('Inventory Page Suite', () => {
  const BACKPACK = 'Sauce Labs Backpack';

  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Navigate and login
    await loginPage.navigate();
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );

    // Verify successful redirection to inventory
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
  });

  test('Verify inventory page loads with title and 6 products', async () => {
    // Verify header title
    await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);

    // Verify 6 catalog items are rendered
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('Verify adding and removing the backpack updates the cart badge', async () => {
    // 1. Add backpack to cart and verify badge shows '1'
    await inventoryPage.addItemToCart(BACKPACK);
    await expect(inventoryPage.shoppingCartBadge).toBeVisible();
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    // 2. Remove backpack and verify badge is hidden/removed
    await inventoryPage.removeItemFromCart(BACKPACK);
    await expect(inventoryPage.shoppingCartBadge).toBeHidden();
  });
});