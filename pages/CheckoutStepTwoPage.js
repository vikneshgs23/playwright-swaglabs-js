import { ROUTES } from '../utils/index.js';

export class CheckoutStepTwoPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header & Summary info
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.paymentInfoLabel = page.locator('[data-test="payment-info-value"]');
    this.shippingInfoLabel = page.locator('[data-test="shipping-info-value"]');

    // Price breakdowns
    this.itemSubtotal = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');

    // Actions & Order Completion
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.completeHeader = page.locator('.complete-header');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Returns item row in the summary table
   * @param {string} itemName
   */
  getSummaryItemByName(itemName) {
    return this.cartItems.filter({ hasText: itemName });
  }

  /**
   * Completes the checkout by clicking Finish
   */
  async finishOrder() {
    await this.finishButton.click();
  }

  /**
   * Cancels and returns to the inventory page
   */
  async cancelOrder() {
    await this.cancelButton.click();
  }
}