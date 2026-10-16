import { ROUTES } from '../utils/index.js';

export class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header & Navigation locators
    this.title = page.locator('.title');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    // Inventory items grid locators
    this.inventoryContainer = page.locator('#inventory_container');
    this.inventoryItems = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
  }

  /**
   * Direct navigation to inventory page
   */
  async navigate() {
    await this.page.goto(ROUTES.INVENTORY);
  }

  /**
   * Returns locator for a specific inventory card matching item name
   * @param {string} itemName
   */
  getItemCardByName(itemName) {
    return this.inventoryItems.filter({ hasText: itemName });
  }

  /**
   * Adds an item to the cart by exact product name
   * @param {string} itemName
   */
  async addItemToCart(itemName) {
    const card = this.getItemCardByName(itemName);
    await card.getByRole('button', { name: 'Add to cart' }).click();
  }

  /**
   * Removes an item from the cart via the inventory grid
   * @param {string} itemName
   */
  async removeItemFromCart(itemName) {
    const card = this.getItemCardByName(itemName);
    await card.getByRole('button', { name: 'Remove' }).click();
  }

  /**
   * Sorts the product catalog by option value:
   * 'az' (A to Z), 'za' (Z to A), 'lohi' (low to high), 'hilo' (high to low)
   * @param {'az' | 'za' | 'lohi' | 'hilo'} option
   */
  async selectSortOption(option) {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Retrieves the current count from the cart badge (or null if badge absent)
   * @returns {Promise<string|null>}
   */
  async getCartBadgeCount() {
    if (await this.shoppingCartBadge.isVisible()) {
      return await this.shoppingCartBadge.textContent();
    }
    return null;
  }

  /**
   * Navigates directly into the cart view
   */
  async openCart() {
    await this.shoppingCartLink.click();
  }

  /**
   * Returns an array of all displayed product titles
   * @returns {Promise<string[]>}
   */
  async getAllProductNames() {
    return await this.itemNames.allTextContents();
  }
}