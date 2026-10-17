import { ROUTES } from '../utils/index.js';

export class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header & Content locators
    this.title = page.locator('.title');
    this.cartList = page.locator('.cart_list');
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.itemQuantities = page.locator('.cart_quantity');

    // Navigation & Action buttons
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  /**
   * Direct navigation to the cart page
   */
  async navigate() {
    await this.page.goto(ROUTES.CART);
  }

  /**
   * Returns the row locator for a specific item inside the cart
   * @param {string} itemName
   */
  getCartItemByName(itemName) {
    return this.cartItems.filter({ hasText: itemName });
  }

  /**
   * Removes a specific product from the cart
   * @param {string} itemName
   */
  async removeItemByName(itemName) {
    const itemRow = this.getCartItemByName(itemName);
    await itemRow.getByRole('button', { name: 'Remove' }).click();
  }

  /**
   * Returns a list of all item names currently in the cart
   * @returns {Promise<string[]>}
   */
  async getAllCartItemNames() {
    return await this.itemNames.allTextContents();
  }

  /**
   * Returns the count of unique item rows present in the cart
   * @returns {Promise<number>}
   */
  async getCartItemCount() {
    return await this.cartItems.count();
  }

  /**
   * Clicks the Continue Shopping button to return to the inventory grid
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  /**
   * Clicks the Checkout button to proceed to step one of checkout
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}