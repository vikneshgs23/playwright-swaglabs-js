import { test, expect } from '../fixtures/index.js';
import {
  ROUTES,
  HEADERS,
  ERROR_MESSAGES,
  PRODUCTS,
  TWO_ITEM_ORDER,
  parsePrice,
  attachScreenshot,
} from '../utils/index.js';
import testData from '../test-data/users.json' with { type: 'json' };

test.describe('Swag Labs - End-to-End User Journeys', () => {
  test(
    'TC_E2E_001 - Multi-item purchase flow',
    { tag: '@smoke' },
    async ({ page, loggedIn, inventoryPage, cartPage, stepOnePage, stepTwoPage }) => {
      // Add two items and check the cart badge
      await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
      await inventoryPage.addItemToCart(PRODUCTS.BIKE_LIGHT);
      await expect(inventoryPage.shoppingCartBadge).toHaveText('2');

      // Open the cart and verify both items
      await inventoryPage.openCart();
      await expect(page).toHaveURL(new RegExp(ROUTES.CART));
      await expect(cartPage.cartItems).toHaveCount(2);
      await expect(cartPage.getCartItemByName(PRODUCTS.BACKPACK)).toBeVisible();
      await expect(cartPage.getCartItemByName(PRODUCTS.BIKE_LIGHT)).toBeVisible();
      await cartPage.proceedToCheckout();

      // Customer information
      await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));
      await stepOnePage.fillCustomerInformation(
        testData.customer.firstName,
        testData.customer.lastName,
        testData.customer.postalCode
      );

      // Overview: item total, tax and total
      await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_TWO));
      await expect(stepTwoPage.title).toHaveText(HEADERS.CHECKOUT_OVERVIEW);
      await expect(stepTwoPage.itemSubtotal).toContainText(TWO_ITEM_ORDER.SUBTOTAL);
      await expect(stepTwoPage.taxLabel).toContainText(TWO_ITEM_ORDER.TAX);
      await expect(stepTwoPage.totalLabel).toContainText(TWO_ITEM_ORDER.TOTAL);

      // Finish
      await stepTwoPage.finishOrder();
      await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_COMPLETE));
      await expect(stepTwoPage.completeHeader).toHaveText(HEADERS.COMPLETE);
      await attachScreenshot(page, 'Order confirmation');
    }
  );

  test('TC_E2E_002 - Add three items, remove one, and verify state across Cart and Inventory', async ({
    page,
    loggedIn,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
    await inventoryPage.addItemToCart(PRODUCTS.BIKE_LIGHT);
    await inventoryPage.addItemToCart(PRODUCTS.BOLT_TSHIRT);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('3');

    await inventoryPage.openCart();
    await expect(page).toHaveURL(new RegExp(ROUTES.CART));

    await cartPage.removeItemByName(PRODUCTS.BACKPACK);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('2');
    await expect(cartPage.getCartItemByName(PRODUCTS.BACKPACK)).toHaveCount(0);

    await cartPage.continueShopping();
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));

    const removedItemCard = inventoryPage.getItemCardByName(PRODUCTS.BACKPACK);
    await expect(removedItemCard.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });

  // TC_E2E_003 - catalog sorting
  const priceSortCases = [
    { id: 'TC_E2E_003a', option: 'lohi', label: 'Price (low to high)', firstPrice: '$7.99' },
    { id: 'TC_E2E_003b', option: 'hilo', label: 'Price (high to low)', firstPrice: '$49.99' },
  ];

  for (const { id, option, label, firstPrice } of priceSortCases) {
    test(`${id} - Sort by ${label}`, async ({ loggedIn, inventoryPage }) => {
      await inventoryPage.selectSortOption(option);

      // Auto-waits until the list has re-sorted
      await expect(inventoryPage.itemPrices.first()).toHaveText(firstPrice);

      const prices = (await inventoryPage.itemPrices.allTextContents()).map(parsePrice);
      const expected = [...prices].sort((a, b) => (option === 'lohi' ? a - b : b - a));
      expect(prices).toEqual(expected);
    });
  }

  test('TC_E2E_003c - Sort by Name (Z to A)', async ({ loggedIn, inventoryPage }) => {
    await inventoryPage.selectSortOption('za');

    await expect(inventoryPage.itemNames.first()).toHaveText('Test.allTheThings() T-Shirt (Red)');

    const names = await inventoryPage.getAllProductNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  // TC_E2E_004 - checkout step one mandatory field validations
  const { firstName, lastName, postalCode } = testData.customer;
  const requiredFieldCases = [
    {
      id: 'TC_E2E_004a',
      field: 'First Name',
      values: ['', lastName, postalCode],
      error: ERROR_MESSAGES.REQUIRED_FIRST_NAME,
    },
    {
      id: 'TC_E2E_004b',
      field: 'Last Name',
      values: [firstName, '', postalCode],
      error: ERROR_MESSAGES.REQUIRED_LAST_NAME,
    },
    {
      id: 'TC_E2E_004c',
      field: 'Postal Code',
      values: [firstName, lastName, ''],
      error: ERROR_MESSAGES.REQUIRED_POSTAL_CODE,
    },
  ];

  for (const { id, field, values, error } of requiredFieldCases) {
    test(`${id} - ${field} is required on checkout step one`, async ({
      page,
      loggedIn,
      inventoryPage,
      cartPage,
      stepOnePage,
    }) => {
      await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
      await inventoryPage.openCart();
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

      await stepOnePage.fillCustomerInformation(...values);

      await expect(stepOnePage.errorMessage).toBeVisible();
      await expect(stepOnePage.errorMessage).toHaveText(error);
    });
  }

  test('TC_E2E_005 - Cancellation flows at checkout step one and step two', async ({
    page,
    loggedIn,
    inventoryPage,
    cartPage,
    stepOnePage,
    stepTwoPage,
  }) => {
    await inventoryPage.addItemToCart(PRODUCTS.FLEECE_JACKET);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

    // Cancel on step one returns to the cart with the item kept
    await stepOnePage.cancelCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CART));
    await expect(cartPage.title).toHaveText(HEADERS.CART);
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.getCartItemByName(PRODUCTS.FLEECE_JACKET)).toBeVisible();

    // Go forward again and cancel on the overview
    await cartPage.proceedToCheckout();
    await stepOnePage.fillCustomerInformation(
      testData.customer.firstName,
      testData.customer.lastName,
      testData.customer.postalCode
    );
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_TWO));
    await expect(stepTwoPage.title).toHaveText(HEADERS.CHECKOUT_OVERVIEW);
    await stepTwoPage.cancelOrder();

    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
  });

  test('TC_E2E_006 - Known defects for problem_user (broken images and unfillable last name)', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    stepOnePage,
  }) => {
    await loginPage.navigate();
    await loginPage.login(testData.problemUser.username, testData.problemUser.password);
    await expect(page).toHaveURL(new RegExp(ROUTES.INVENTORY));
    await expect(inventoryPage.title).toHaveText(HEADERS.PRODUCTS);

    // Defect 1: product images point to the sl-404 fallback image
    await expect(inventoryPage.firstProductImage).toBeVisible();
    await expect(inventoryPage.firstProductImage).toHaveAttribute('src', /sl-404/);

    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

    // Defect 2: typing into Last Name does not populate the field
    await stepOnePage.firstNameInput.fill(testData.customer.firstName);
    await stepOnePage.lastNameInput.pressSequentially('Doe', { delay: 10 });
    await expect(stepOnePage.lastNameInput).toHaveValue('');
    await stepOnePage.postalCodeInput.fill(testData.customer.postalCode);

    // Validation blocks progress because Last Name is empty
    await stepOnePage.continueButton.click();
    await expect(stepOnePage.errorMessage).toHaveText(ERROR_MESSAGES.REQUIRED_LAST_NAME);
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));
  });

  // TC_E2E_007 - logout and session protection
  test(
    'TC_E2E_007a - Logout returns the user to the login page',
    { tag: '@smoke' },
    async ({ loggedIn, inventoryPage, loginPage }) => {
      await inventoryPage.logout();

      await expect(loginPage.loginButton).toBeVisible();
    }
  );

  test('TC_E2E_007b - Browser Back and reload after logout stay on the login page', async ({
    page,
    loggedIn,
    inventoryPage,
    loginPage,
  }) => {
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();

    await page.goBack();
    await page.reload();

    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC_E2E_007c - Direct inventory access after logout is blocked', async ({
    page,
    loggedIn,
    inventoryPage,
    loginPage,
  }) => {
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();

    await page.goto(ROUTES.INVENTORY);

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      ERROR_MESSAGES.ACCESS_DENIED(ROUTES.INVENTORY)
    );
  });

  test(
    'TC_NEG_001 - Checkout behaviour with an empty cart',
    {
      annotation: {
        type: 'known-issue',
        description: 'SauceDemo allows reaching checkout with an empty cart',
      },
    },
    async ({ page, loggedIn, inventoryPage, cartPage, stepOnePage }) => {
      await expect(inventoryPage.shoppingCartBadge).toHaveCount(0);

      await inventoryPage.openCart();
      await expect(page).toHaveURL(new RegExp(ROUTES.CART));
      await expect(cartPage.title).toHaveText(HEADERS.CART);
      await expect(cartPage.cartItems).toHaveCount(0);

      await cartPage.proceedToCheckout();

      await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));
      await expect(stepOnePage.title).toHaveText(HEADERS.CHECKOUT_INFO);
    }
  );

  // TC_NEG_002 - unauthenticated direct route access
  const protectedRoutes = [
    { id: 'TC_NEG_002a', route: ROUTES.INVENTORY },
    { id: 'TC_NEG_002b', route: ROUTES.CHECKOUT_STEP_ONE },
  ];

  for (const { id, route } of protectedRoutes) {
    test(`${id} - Unauthenticated access to ${route} redirects to login with an error`, async ({
      page,
      loginPage,
    }) => {
      await page.goto(route);

      await expect(page).toHaveURL(/\/$/);
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.ACCESS_DENIED(route));
    });
  }

  test(
    'TC_NEG_003 - Checkout form accepts boundary, special-character and alphanumeric input',
    {
      annotation: {
        type: 'known-issue',
        description: 'SauceDemo has no length limit or input validation on these fields',
      },
    },
    async ({ page, loggedIn, inventoryPage, cartPage, stepOnePage, stepTwoPage }) => {
      const longFirstName = 'A'.repeat(260);
      const specialCharsLastName = '!@#$%^&*()_+{}:"<>?~`-=[]\\;\',./';
      const alphanumericPostalCode = 'SW1A 1AA 90210-AB12';

      await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
      await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
      await inventoryPage.openCart();
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

      await stepOnePage.firstNameInput.fill(longFirstName);
      await stepOnePage.lastNameInput.fill(specialCharsLastName);
      await stepOnePage.postalCodeInput.fill(alphanumericPostalCode);

      await expect(stepOnePage.firstNameInput).toHaveValue(longFirstName);
      await expect(stepOnePage.lastNameInput).toHaveValue(specialCharsLastName);
      await expect(stepOnePage.postalCodeInput).toHaveValue(alphanumericPostalCode);

      await stepOnePage.continueButton.click();

      await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_TWO));
      await expect(stepTwoPage.title).toHaveText(HEADERS.CHECKOUT_OVERVIEW);
    }
  );

  test('TC_NEG_004 - Script-injection payloads stay as literal text and do not execute', async ({
    page,
    loggedIn,
    inventoryPage,
    cartPage,
    stepOnePage,
    stepTwoPage,
  }) => {
    const scriptPayload = '<script>alert("xss")</script>';
    const imgPayload = '<img src=x onerror=alert(1)>';

    // Fail the test if any alert/confirm/prompt dialog appears
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    await inventoryPage.addItemToCart(PRODUCTS.BACKPACK);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

    await stepOnePage.firstNameInput.fill(scriptPayload);
    await stepOnePage.lastNameInput.fill(testData.customer.lastName);
    await stepOnePage.postalCodeInput.fill(imgPayload);

    await expect(stepOnePage.firstNameInput).toHaveValue(scriptPayload);
    await expect(stepOnePage.postalCodeInput).toHaveValue(imgPayload);

    await stepOnePage.continueButton.click();

    await expect(page).toHaveURL(new RegExp(ROUTES.CHECKOUT_STEP_TWO));
    await expect(stepTwoPage.title).toHaveText(HEADERS.CHECKOUT_OVERVIEW);
    expect(dialogTriggered).toBe(false);
  });
});
