import { test, expect } from '../fixtures/index.js';
import { ROUTES, HEADERS, PRODUCTS, parsePrice } from '../utils/index.js';

test.describe('Cart Flow Suite', () => {
  test('Item added from the inventory page appears in the cart', async ({
    loggedIn,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
    await inventoryPage.openCart();

    await expect(cartPage.title).toHaveText(HEADERS.CART);
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.getCartItemByName(PRODUCTS.BACKPACK)).toBeVisible();
  });

  test('Removing the only item leaves the cart empty', async ({
    loggedIn,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
    await inventoryPage.openCart();

    await cartPage.removeItemByName(PRODUCTS.BACKPACK);

    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(cartPage.getCartItemByName(PRODUCTS.BACKPACK)).toHaveCount(0);
  });

  test('Continue Shopping returns to the inventory page', async ({
    page,
    loggedIn,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
    await inventoryPage.openCart();

    await cartPage.continueShopping();

    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
  });

  test('Cart item price and quantity match the inventory listing', async ({
    loggedIn,
    inventoryPage,
    cartPage,
  }) => {
    const listedPrice = await inventoryPage.getItemPrice(PRODUCTS.BACKPACK);
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
    await inventoryPage.openCart();

    const details = await cartPage.getItemDetails(PRODUCTS.BACKPACK);

    expect(parsePrice(details.price)).toBe(parsePrice(listedPrice));
    expect(details.quantity).toBe('1');
  });
});
