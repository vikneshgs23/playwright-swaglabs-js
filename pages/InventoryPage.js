import { ROUTES } from '../utils/index.js';

export class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header & navigation locators
    this.title = page.locator('[data-test="title"]');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    // Burger menu locators
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.openMenuWrap = page.locator('.bm-menu-wrap[aria-hidden="false"]');
    this.logoutLink = page.locator('#logout_sidebar_link');

    // Inventory items grid locators
    this.inventoryContainer = page.locator('#inventory_container');
    this.inventoryItems = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.productImages = page.locator('.inventory_item_img img');
  }

  /**
   * Direct navigation to inventory page
   */
  async navigate() {
    await this.page.goto(ROUTES.INVENTORY);
  }

  /**
   * First product image (used for the problem_user broken-image check)
   */
  get firstProductImage() {
    return this.productImages.first();
  }

  /**
   * Returns the inventory card whose product name exactly matches itemName
   * @param {string} itemName
   */
  getItemCardByName(itemName) {
    return this.inventoryItems.filter({
      has: this.page.getByText(itemName, { exact: true }),
    });
  }

  /**
   * Returns the listed price text (for example "$29.99") for a product
   * @param {string} itemName
   * @returns {Promise<string>}
   */
  async getItemPrice(itemName) {
    const price = await this.getItemCardByName(itemName)
      .locator('.inventory_item_price')
      .textContent();
    return price?.trim() ?? '';
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
   * Retrieves the current count from the cart badge (or null if badge absent).
   * Prefer `await expect(inventoryPage.shoppingCartBadge).toHaveText('n')` in specs,
   * because this method does not wait for the badge to appear.
   * @returns {Promise<string|null>}
   */
  async getCartBadgeCount() {
    if (await this.shoppingCartBadge.isVisible()) {
      return await this.shoppingCartBadge.textContent();
    }
    return null;
  }

  /**
   * Navigates into the cart view
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

  /**
   * Opens the burger menu and logs out.
   * dispatchEvent is used because the sliding menu can be off-screen while animating,
   * which makes a normal click flaky on some browsers and on CI runners.
   */
  async logout() {
    await this.menuButton.click();
    await this.openMenuWrap.waitFor();
    await this.logoutLink.dispatchEvent('click');
  }
}
