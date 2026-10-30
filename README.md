# Swag Labs E2E Test Automation Framework

[![Playwright Tests](https://github.com/vikneshgs23/playwright-swaglabs-js/actions/workflows/playwright.yml/badge.svg)](https://github.com/vikneshgs23/playwright-swaglabs-js/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

An end-to-end UI test automation framework for [SauceDemo (Swag Labs)](https://www.saucedemo.com/), built with **JavaScript (ES Modules)** and the **Playwright Test Runner**.

It follows the Page Object Model (POM) pattern, runs tests in parallel across Chromium, Firefox and WebKit, and executes automatically on every push and pull request through GitHub Actions.

---

## Tech Stack

- **Language:** JavaScript (Node.js, ES Modules)
- **Test runner:** [@playwright/test](https://playwright.dev/)
- **Design pattern:** Page Object Model, with locators and actions kept in page classes and assertions in the specs
- **CI:** GitHub Actions on `ubuntu-latest`, with npm and Playwright browser caching
- **Reporting:** Playwright HTML report, traces on first retry, and screenshots on failure

---

## Project Structure

```text
playwright-swaglabs-js/
├── .github/
│   └── workflows/
│       └── playwright.yml            # CI: run tests and upload the report
├── pages/                            # Page Objects
│   ├── BasePage.js                   # Shared navigation, waits and locators
│   ├── LoginPage.js                  # Login inputs, actions and error messages
│   ├── InventoryPage.js              # Product list, sorting, cart badge and menu
│   ├── CartPage.js                   # Cart items, removal and navigation
│   ├── CheckoutStepOnePage.js        # Shipping form, validations and cancel
│   └── CheckoutStepTwoPage.js        # Order summary, totals and completion
├── tests/                            # Test specs by feature
│   ├── e2e.spec.js                   # Multi-step end-to-end user journeys
│   ├── login.spec.js                 # Login: positive, negative and boundary cases
│   ├── inventory.spec.js             # Sorting and product catalog checks
│   ├── cart.spec.js                  # Adding and removing cart items
│   └── checkout.spec.js              # Checkout forms and price calculations
├── test-data/
│   └── users.json                    # Test users and credentials
├── utils/
│   ├── constants.js                  # Routes, expected headings and error texts
│   └── index.js                      # Barrel export
├── playwright.config.js              # Browsers, retries, workers and reporters
├── package.json
└── README.md
```

---

## Key Features

- **Page Object Model:** DOM locators and page actions live in page classes, so specs stay short and readable.
- **Web-first assertions:** Uses Playwright's auto-retrying assertions (`toHaveCount`, `toHaveText`, `toBeVisible`) instead of fixed waits, which reduces flaky tests.
- **Cross-browser runs:** Tests run on Chromium, Firefox and WebKit, set up as Playwright projects.
- **Parallel execution:** Tests run in parallel across workers.
- **Negative and security checks:** Covers invalid input, direct URL access without logging in, and session ending after logout.
- **Known-defect handling:** Includes checks for the `problem_user` account's broken product images and unfillable fields.
- **CI reporting:** The HTML report is uploaded as a build artifact on every run.

---

## Test Coverage

| Scenario ID | Test | What it validates |
| :--- | :--- | :--- |
| `TC_E2E_001` | Multi-item purchase flow | Full checkout from cart to confirmation, including subtotal and tax. |
| `TC_E2E_002` | Cart state sync | Adding and removing items, badge count updates and catalog state. |
| `TC_E2E_003` | Product sorting | Price (low to high, high to low) and name (Z to A) checked against sorted data. |
| `TC_E2E_004` | Checkout form validation | Required First Name, Last Name and Postal Code errors in Step One. |
| `TC_E2E_005` | Checkout cancellation | Cart stays intact when cancelling at Step One and Step Two. |
| `TC_E2E_006` | Known defect verification | `problem_user` broken images (`sl-404`) and unfillable inputs. |
| `TC_E2E_007` | Session and route protection | Clean logout, back-button behavior and blocked direct `/inventory.html` access. |
| `TC_NEG_001` | Checkout with an empty cart | How checkout behaves when no items are in the cart. |
| `TC_NEG_002` | Unauthenticated route access | Direct access to protected routes is blocked and redirects to the login page. |
| `TC_NEG_003` | Checkout form boundary inputs | Checkout form behavior with boundary values, special characters and alphanumeric input. |

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher (CI runs on Node 22)
- **Git**

### Installation

```bash
git clone https://github.com/vikneshgs23/playwright-swaglabs-js.git
cd playwright-swaglabs-js
npm install
npx playwright install --with-deps
```

---

## Running Tests

| Command | Action |
| :--- | :--- |
| `npm test` | Run the full suite headlessly on all configured browsers. |
| `npm run test:e2e` | Run only the end-to-end journeys (`tests/e2e.spec.js`). |
| `npm run test:chromium` | Run on Chromium only. |
| `npm run test:firefox` | Run on Firefox only. |
| `npm run test:webkit` | Run on WebKit only. |
| `npm run test:headed` | Run with visible browser windows. |
| `npm run test:ui` | Open Playwright's interactive UI mode. |
| `npm run report` | Open the last HTML report locally. |

---

## Continuous Integration

The workflow in `.github/workflows/playwright.yml` runs on every push and pull request to `main` or `master`. Changes that only touch Markdown files skip the run.

- **Runner:** `ubuntu-latest`, Node 22
- **Caching:** npm packages and Playwright browsers are cached between runs
- **Parallelism:** 2 workers on CI
- **Retries:** failing tests retry once on CI, with a trace captured on the first retry
- **Artifacts:** the HTML report is uploaded on every run (even on failure) and kept for 30 days

---

## Author

**G S Viknesh** - [GitHub](https://github.com/vikneshgs23)
