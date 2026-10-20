import { ROUTES } from '../utils/index.js';

export class CheckoutStepOnePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header & Input fields
    this.title = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');

    // Action buttons & feedback
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Direct navigation to checkout step one
   */
  async navigate() {
    await this.page.goto(ROUTES.CHECKOUT_STEP_ONE);
  }

  /**
   * Fills shipping/customer details and clicks Continue
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} postalCode
   */
  async fillCustomerInformation(firstName, lastName, postalCode) {
    if (firstName) await this.firstNameInput.fill(firstName);
    if (lastName) await this.lastNameInput.fill(lastName);
    if (postalCode) await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /**
   * Clicks cancel and returns to cart
   */
  async cancelCheckout() {
    await this.cancelButton.click();
  }
}