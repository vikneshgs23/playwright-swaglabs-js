import { ROUTES } from '../utils/index.js';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Locators using data-test attributes (best practice for Swag Labs)
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Navigates to the login page (base URL is set in playwright.config.js)
   */
  async navigate() {
    await this.page.goto(ROUTES.HOME);
  }

  /**
   * Fills credentials and clicks the login button
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
