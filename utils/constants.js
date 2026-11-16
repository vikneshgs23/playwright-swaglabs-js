export const ROUTES = {
  HOME: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html',
};

export const PRODUCTS = {
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
};

export const ERROR_MESSAGES = {
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  REQUIRED_USERNAME: 'Epic sadface: Username is required',
  REQUIRED_PASSWORD: 'Epic sadface: Password is required',
  REQUIRED_FIRST_NAME: 'Error: First Name is required',
  REQUIRED_LAST_NAME: 'Error: Last Name is required',
  REQUIRED_POSTAL_CODE: 'Error: Postal Code is required',
  USER_NOT_MATCH: 'Epic sadface: Username and password do not match any user in this service',
  ACCESS_DENIED: (route) => `You can only access '${route}' when you are logged in.`,
};

export const HEADERS = {
  PRODUCTS: 'Products',
  CART: 'Your Cart',
  CHECKOUT_INFO: 'Checkout: Your Information',
  CHECKOUT_OVERVIEW: 'Checkout: Overview',
  COMPLETE: 'Thank you for your order!',
};

// Backpack ($29.99) + Bike Light ($9.99)
export const TWO_ITEM_ORDER = {
  SUBTOTAL: 'Item total: $39.98',
  TAX: 'Tax: $3.20',
  TOTAL: 'Total: $43.18',
};
