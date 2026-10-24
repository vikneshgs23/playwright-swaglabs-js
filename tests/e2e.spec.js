import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage.js';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage.js';
import { ROUTES, HEADERS, ERROR_MESSAGES } from '../utils/index.js';
import testData from '../test-data/users.json' with { type: 'json' };

test.describe.configure({ mode: 'parallel' });

test.describe('Swag Labs - End-to-End User Journeys', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;
  let stepOnePage;
  let stepTwoPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    stepOnePage = new CheckoutStepOnePage(page);
    stepTwoPage = new CheckoutStepTwoPage(page);

    await loginPage.navigate();
  });

  test('TC_E2E_001 - Verify end-to-end multi-item purchase flow', async ({ page }) => {
    const item1 = 'Sauce Labs Backpack';
    const item2 = 'Sauce Labs Bike Light';

    // 1. Log in with valid credentials
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);

    // 2. Add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to cart
    await inventoryPage.addItemToCart(item1);
    await inventoryPage.addItemToCart(item2);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('2');

    // 3. Click the shopping cart icon
    await inventoryPage.openCart();
    await expect(page).toHaveURL(new RegExp(ROUTES.CART));

    // 4. Verify selected items are listed, then click 'Checkout'
    await expect(cartPage.cartItems).toHaveCount(2);
    await expect(cartPage.getCartItemByName(item1)).toBeVisible();
    await expect(cartPage.getCartItemByName(item2)).toBeVisible();
    await cartPage.proceedToCheckout();

    // 5. Enter First Name, Last Name, and Postal Code
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));
    await stepOnePage.fillCustomerInformation(
      testData.customer.firstName,
      testData.customer.lastName,
      testData.customer.postalCode
    );

    // 6. Click 'Continue' (verified by arriving at step two overview)
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_TWO));
    await expect(stepTwoPage.title).toHaveText(HEADERS.CHECKOUT_OVERVIEW);

    // 7. Verify item total, tax, and total amount on 'Checkout: Overview'
    await expect(stepTwoPage.itemSubtotal).toContainText('Item total: $39.98');
    await expect(stepTwoPage.taxLabel).toContainText('Tax: $3.20');
    await expect(stepTwoPage.totalLabel).toContainText('Total: $43.18');

    // 8. Click 'Finish'
    await stepTwoPage.finishOrder();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_COMPLETE));
    await expect(stepTwoPage.completeHeader).toHaveText(HEADERS.COMPLETE);
  });
  test('TC_E2E_002 - Add three items, remove one, and verify state across Cart and Inventory', async ({ page }) => {
    const item1 = 'Sauce Labs Backpack';
    const item2 = 'Sauce Labs Bike Light';
    const item3 = 'Sauce Labs Bolt T-Shirt';

    // 1. Log in with valid credentials
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);

    // 2. Add three items to the cart from the inventory page
    await inventoryPage.addItemToCart(item1);
    await inventoryPage.addItemToCart(item2);
    await inventoryPage.addItemToCart(item3);

    // 3. Verify cart badge displays '3'
    await expect(inventoryPage.shoppingCartBadge).toHaveText('3');

    // 4. Click the cart icon to view cart
    await inventoryPage.openCart();
    await expect(page).toHaveURL(new RegExp(ROUTES.CART));

    // 5. Click 'Remove' on one item
    await cartPage.removeItemByName(item1);

    // 6. Verify cart badge updates to '2'
    await expect(inventoryPage.shoppingCartBadge).toHaveText('2');
    await expect(cartPage.getCartItemByName(item1)).toHaveCount(0);

    // 7. Click 'Continue Shopping'
    await cartPage.continueShopping();
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));

    // 8. Verify the removed item shows 'Add to cart' on the inventory page
    const removedItemCard = inventoryPage.getItemCardByName(item1);
    await expect(removedItemCard.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });
  test('TC_E2E_003 - Verify product catalog sorting by price and name', async ({ page }) => {
    // 1. Log in with valid credentials
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);

    // 2. Select sort filter 'Price (low to high)' ('lohi')
    await inventoryPage.selectSortOption('lohi');

    // 3. Verify inventory list sorts prices in ascending order
    // Auto-waits for the first price to reflect the lowest catalog price ($7.99)
    await expect(inventoryPage.itemPrices.first()).toHaveText('$7.99');
    const rawPricesLowToHigh = await inventoryPage.itemPrices.allTextContents();
    const numericPricesLowToHigh = rawPricesLowToHigh.map(price => parseFloat(price.replace('$', '')));
    const expectedSortedLowToHigh = [...numericPricesLowToHigh].sort((a, b) => a - b);
    expect(numericPricesLowToHigh).toEqual(expectedSortedLowToHigh);

    // 4. Select sort filter 'Price (high to low)' ('hilo')
    await inventoryPage.selectSortOption('hilo');

    // 5. Verify inventory list sorts prices in descending order
    // Auto-waits for the first price to reflect the highest catalog price ($49.99)
    await expect(inventoryPage.itemPrices.first()).toHaveText('$49.99');
    const rawPricesHighToLow = await inventoryPage.itemPrices.allTextContents();
    const numericPricesHighToLow = rawPricesHighToLow.map(price => parseFloat(price.replace('$', '')));
    const expectedSortedHighToLow = [...numericPricesHighToLow].sort((a, b) => b - a);
    expect(numericPricesHighToLow).toEqual(expectedSortedHighToLow);

    // 6. Select sort filter 'Name (Z to A)' ('za')
    await inventoryPage.selectSortOption('za');

    // 7. Verify product names sort alphabetically descending
    // Auto-waits for the first product title to match the Z-A leader
    await expect(inventoryPage.itemNames.first()).toHaveText('Test.allTheThings() T-Shirt (Red)');
    const rawNamesZtoA = await inventoryPage.getAllProductNames();
    const expectedSortedZtoA = [...rawNamesZtoA].sort((a, b) => b.localeCompare(a));
    expect(rawNamesZtoA).toEqual(expectedSortedZtoA);
  });
  test('TC_E2E_004 - Verify checkout step one mandatory field validations', async ({ page }) => {
    const item = 'Sauce Labs Backpack';

    // 1. Log in and add an item to the cart
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await inventoryPage.addItemToCart(item);

    // 2. Navigate to cart and click 'Checkout'
    await inventoryPage.openCart();
    await expect(page).toHaveURL(new RegExp(ROUTES.CART));
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

    // 3. Leave First Name empty, fill other fields, click 'Continue'
    await stepOnePage.fillCustomerInformation(
      '',
      testData.customer.lastName,
      testData.customer.postalCode
    );
    await expect(stepOnePage.errorMessage).toBeVisible();
    await expect(stepOnePage.errorMessage).toHaveText('Error: First Name is required');

    // 4. Fill First Name, leave Last Name empty, click 'Continue'
    await stepOnePage.fillCustomerInformation(
      testData.customer.firstName,
      '',
      testData.customer.postalCode
    );
    await expect(stepOnePage.errorMessage).toBeVisible();
    await expect(stepOnePage.errorMessage).toHaveText('Error: Last Name is required');

    // 5. Fill Last Name, leave Postal Code empty, click 'Continue'
    await stepOnePage.fillCustomerInformation(
      testData.customer.firstName,
      testData.customer.lastName,
      ''
    );
    await expect(stepOnePage.errorMessage).toBeVisible();
    await expect(stepOnePage.errorMessage).toHaveText(ERROR_MESSAGES.REQUIRED_POSTAL_CODE);
  });
  test('TC_E2E_005 - Verify cancellation flows at checkout step one and step two', async ({ page }) => {
    const item = 'Sauce Labs Fleece Jacket';

    // 1. Log in and add 'Sauce Labs Fleece Jacket' to the cart
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await inventoryPage.addItemToCart(item);

    // 2. Navigate to Cart and click 'Checkout'
    await inventoryPage.openCart();
    await expect(page).toHaveURL(new RegExp(ROUTES.CART));
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

    // 3. Click 'Cancel' on the 'Checkout: Your Information' page
    await stepOnePage.cancelCheckout();

    // 4. Verify navigation returns to 'Your Cart' with the item preserved
    await expect(page).toHaveURL(new RegExp(ROUTES.CART));
    await expect(cartPage.title).toHaveText(HEADERS.CART);
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.getCartItemByName(item)).toBeVisible();

    // 5. Click 'Checkout', fill required details, and click 'Continue'
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));
    await stepOnePage.fillCustomerInformation(
      testData.customer.firstName,
      testData.customer.lastName,
      testData.customer.postalCode
    );

    // 6. On 'Checkout: Overview', click 'Cancel'
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_TWO));
    await expect(stepTwoPage.title).toHaveText(HEADERS.CHECKOUT_OVERVIEW);
    await stepTwoPage.cancelOrder();

    // Verify cancellation returns to the Products inventory page with cart item still preserved
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
  });
test('TC_E2E_006 - Verify known defects for problem_user (broken images and unfillable last name)', async ({ page }) => {
    const item = 'Sauce Labs Backpack';

    // 1. Log in with problem_user
    await loginPage.login('problem_user', testData.validUser.password);
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);

    // 2. Inspect product image (assert first image renders broken sl-404 link)
    const firstProductImg = page.locator('.inventory_item_img img').first();
    await expect(firstProductImg).toBeVisible();
    await expect(firstProductImg).toHaveAttribute('src', /sl-404/);

    // 3. Add 'Sauce Labs Backpack' to the cart
    await inventoryPage.addItemToCart(item);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    // 4. Navigate to checkout and attempt to fill 'Last Name'
    await inventoryPage.openCart();
    await expect(page).toHaveURL(new RegExp(ROUTES.CART));
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

    await stepOnePage.firstNameInput.fill(testData.customer.firstName);

    // problem_user defect: typing into the Last Name field does not populate it
    await stepOnePage.lastNameInput.pressSequentially('Doe', { delay: 10 });
    await stepOnePage.postalCodeInput.fill(testData.customer.postalCode);

    // 5. Click 'Continue' and verify validation blocks progress due to missing Last Name
    await stepOnePage.continueButton.click();
    await expect(stepOnePage.errorMessage).toBeVisible();
    await expect(stepOnePage.errorMessage).toHaveText('Error: Last Name is required');
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));
  });
 test('TC_E2E_007 - Verify session termination, browser back prevention, and direct route access block', async ({ page }) => {
    const item1 = 'Sauce Labs Backpack';
    const item2 = 'Sauce Labs Bike Light';

    // 1. Log in, add two items to the cart
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await inventoryPage.addItemToCart(item1);
    await inventoryPage.addItemToCart(item2);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('2');

    // 2. Open the burger menu sidebar
    await page.locator('#react-burger-menu-btn').click();

    // Wait until the sidebar wrapper finishes sliding into view (aria-hidden becomes false)
    const menuWrap = page.locator('.bm-menu-wrap');
    await expect(menuWrap).toHaveAttribute('aria-hidden', 'false');

    // 3. Click 'Logout' (dispatchEvent bypasses off-screen coordinate calculations)
    const logoutLink = page.locator('#logout_sidebar_link');
    await logoutLink.dispatchEvent('click');

    // 4. Verify user is on the login page
    await expect(loginPage.loginButton).toBeVisible();

    // 5. Click the browser's Back button and reload to trigger auth check
    await page.goBack();
    await page.reload();
    await expect(loginPage.loginButton).toBeVisible();

    // 6. Attempt to access inventory directly via URL bar
    await page.goto('/inventory.html');

    // Verify direct route access without session redirects to login and displays the auth error
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      "You can only access '/inventory.html' when you are logged in."
    );
  });

});