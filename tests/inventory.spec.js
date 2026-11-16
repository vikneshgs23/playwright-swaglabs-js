import { test, expect } from '../fixtures/index.js';
import { HEADERS, PRODUCTS } from '../utils/index.js';

test.describe('Inventory Page Suite', () => {
  test('Inventory page loads with title and 6 products', async ({ loggedIn, inventoryPage }) => {
    await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('Adding and removing the backpack updates the cart badge', async ({
    loggedIn,
    inventoryPage,
  }) => {
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
    await expect(inventoryPage.shoppingCartBadge).toBeVisible();
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    await inventoryPage.removeItemFromCart(PRODUCTS.BACKPACK);
    await expect(inventoryPage.shoppingCartBadge).toBeHidden();
  });
});
