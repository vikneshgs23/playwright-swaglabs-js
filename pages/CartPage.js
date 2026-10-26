import { ROUTES } from '../utils/index.js';

export class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header & Layout locators
    this.title = page.locator('[data-test="title"]');
    this.cartList = page.locator('.cart_list');
    this.cartItems = page.locator('.cart_item');
    this.cartQuantityLabels = page.locator('.cart_quantity_label');
    this.cartDescLabels = page.locator('.cart_desc_label');

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
    return this.cartItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: itemName }),
    });
  }

  /**
   * Gets specific product details (price, description, quantity) for a given item row
   * @param {string} itemName
   */
  async getItemDetails(itemName) {
    const itemRow = this.getCartItemByName(itemName);
    const price = await itemRow.locator('.inventory_item_price').textContent();
    const desc = await itemRow.locator('.inventory_item_desc').textContent();
    const quantity = await itemRow.locator('.cart_quantity').textContent();

    return {
      name: itemName,
      price: price?.trim(),
      desc: desc?.trim(),
      quantity: quantity?.trim(),
    };
  }

  /**
   * Removes a specific product from the cart by clicking its Remove button
   * @param {string} itemName
   */
  async removeItemByName(itemName) {
    const itemRow = this.getCartItemByName(itemName);
    await itemRow.locator('button:has-text("Remove")').click();
  }

  /**
   * Returns an array of all item names currently in the cart
   * @returns {Promise<string[]>}
   */
  async getAllCartItemNames() {
    return await this.cartItems.locator('.inventory_item_name').allInnerTexts();
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