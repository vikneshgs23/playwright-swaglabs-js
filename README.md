# Swag Labs E2E Test Automation Framework

[![Playwright Tests](https://github.com/vikneshgs23/playwright-swaglabs-js/actions/workflows/playwright.yml/badge.svg)](https://github.com/vikneshgs23/playwright-swaglabs-js/actions/workflows/playwright.yml)
[![Live Report](https://img.shields.io/badge/Test%20Report-Live-blue)](https://vikneshgs23.github.io/playwright-swaglabs-js/)
[![Playwright](https://img.shields.io/badge/Playwright-Test-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22%20(CI)-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

An End-to-End (E2E) UI test automation framework for [SauceDemo (Swag Labs)](https://www.saucedemo.com/), built with **JavaScript (ES Modules)** and the **Playwright Test Runner**.

It follows the Page Object Model (POM) with Playwright fixtures, runs the full suite (31 tests) on Chromium, Firefox and WebKit in parallel, uses Playwright's auto-waiting and web-first assertions to reduce flakiness, and runs in a GitHub Actions pipeline that publishes the latest HTML report to GitHub Pages.

---

## Tech Stack

- **Language:** JavaScript (Node.js ES Modules)
- **Test runner and engine:** [@playwright/test](https://playwright.dev/)
- **Design pattern:** Page Object Model (POM) with locators and actions kept in page classes, assertions kept in the specs, and page objects supplied to tests through Playwright fixtures
- **Code quality:** ESLint (`eslint-plugin-playwright`) and Prettier
- **Continuous Integration:** GitHub Actions on `ubuntu-latest`, with Dependabot keeping dependencies and actions up to date
- **Reporting:** Playwright List and HTML reporters, with screenshots on failure and trace and video on first retry
- **Report hosting:** GitHub Pages (live report)

---

## Project Structure

```text
playwright-swaglabs-js/
├── .github/
│   ├── workflows/
│   │   └── playwright.yml            # CI: run tests, upload report, deploy report to Pages
│   └── dependabot.yml                # Dependency and action updates
├── fixtures/
│   └── index.js                      # Extended test with page-object and logged-in fixtures
├── pages/                            # Page Object Model classes
│   ├── LoginPage.js                  # Login inputs, actions and error messages
│   ├── InventoryPage.js              # Product catalog, sorting, cart badge and burger menu
│   ├── CartPage.js                   # Cart items, removal and checkout navigation
│   ├── CheckoutStepOnePage.js        # Customer information form and validation errors
│   └── CheckoutStepTwoPage.js        # Order overview, pricing and order completion
├── tests/                            # Test specifications by area
│   ├── e2e.spec.js                   # E2E journeys and negative scenarios (TC_E2E_*, TC_NEG_*)
│   ├── login.spec.js                 # Authentication checks (TC_LOGIN_*)
│   ├── inventory.spec.js             # Catalog and cart badge checks
│   ├── cart.spec.js                  # Cart additions, removals and price consistency
│   └── checkout.spec.js              # Checkout completion and form validation
├── test-data/
│   └── users.json                    # Demo credentials and customer data
├── utils/
│   ├── constants.js                  # Routes, products, headers, error messages, expected totals
│   ├── dataHelper.js                 # Price parsing and random ZIP code helpers
│   ├── visualHelper.js               # Attaches full-page screenshots to the Playwright report
│   └── index.js                      # Barrel export
├── eslint.config.js                  # ESLint rules for the specs
├── playwright.config.js              # Browsers, retries, workers, reporters and trace settings
├── package.json
└── README.md
```

---

## Key Features

- **Page Object Model with fixtures:** Page classes hold the locators and page actions, and Playwright fixtures provide the page objects and a reusable `loggedIn` session, so specs read as user journeys without repeated setup code.
- **Web-first assertions:** `toHaveText`, `toHaveCount`, `toBeVisible` and similar assertions retry until they pass or time out, which reduces flakiness on dynamic pages.
- **Cross-browser coverage:** Every test runs on Chromium, Firefox and WebKit (Safari's engine) through Playwright projects.
- **Parallel execution:** Tests run in parallel, with 2 workers on CI.
- **Data-driven tests:** Checkout field validations, catalog sorting and protected-route checks run from small data tables, so each case reports as its own test.
- **Defect and negative testing:** Covers the intentional `problem_user` defects, checkout form validations, session and route protection, boundary inputs and script-injection payloads. Tests that document current SauceDemo behaviour that is arguably a defect carry a `known-issue` annotation.
- **Smoke tag:** The critical journeys are tagged `@smoke` and can be run on their own with `npm run test:smoke`.
- **Data kept separate:** Credentials and customer data live in `test-data/users.json`, and routes, product names, headers, error text and expected totals live in `utils/constants.js`.
- **CI reporting:** The HTML report is uploaded as a build artifact on every run, and the latest report is published to GitHub Pages after pushes to the main branch and after every scheduled daily run.

---

## Test Coverage

`tests/e2e.spec.js` contains the end-to-end journeys (`TC_E2E_*`) and the negative and edge-case scenarios (`TC_NEG_*`).

| Test ID | Scenario | Key Validations |
| :--- | :--- | :--- |
| **TC_E2E_001** | Multi-item purchase flow | Login, add two items, cart contents, checkout info, item total ($39.98), tax ($3.20), total ($43.18), order completion header, and a screenshot of the confirmation attached to the report. |
| **TC_E2E_002** | Cart modification and state sync | Add three items, remove one, badge updates from 3 to 2, removed item shows "Add to cart" again on the inventory page. |
| **TC_E2E_003a-c** | Catalog sorting | Price (low to high), price (high to low) and name (Z to A), each checked against a sorted copy of the displayed values. |
| **TC_E2E_004a-c** | Checkout field validations (data-driven) | "First Name", "Last Name" and "Postal Code is required" errors on Checkout Step One. |
| **TC_E2E_005** | Checkout cancellation flows | Cancel on Step One returns to the cart with the item kept. Cancel on the overview returns to the inventory with the badge kept. |
| **TC_E2E_006** | `problem_user` known defects | The first product image points to the `sl-404` fallback image, and the Last Name field cannot be filled, so checkout shows a validation error. |
| **TC_E2E_007a-c** | Logout and session protection | Logout through the burger menu, Back button plus reload after logout, and direct `/inventory.html` access after logout. |
| **TC_NEG_001** | Empty cart checkout | Documents SauceDemo's current behaviour: Checkout Step One can be reached with 0 items in the cart. |
| **TC_NEG_002a-b** | Unauthenticated direct route access | `/inventory.html` and `/checkout-step-one.html` redirect to login with the matching error banner. |
| **TC_NEG_003** | Boundary and special-character inputs | A 260-character first name, special characters in the last name and an alphanumeric postal code are accepted and reach the overview page. |
| **TC_NEG_004** | Script-injection payloads | `<script>` and `<img onerror>` payloads stay as literal text in the form fields, the flow reaches the overview page, and no browser dialog is triggered. |

The other spec files cover their areas at a smaller scope:

| Spec | Scenarios |
| :--- | :--- |
| `login.spec.js` | Valid login, locked-out user, empty username, empty password and wrong password. |
| `inventory.spec.js` | Page title and 6 products, cart badge on add and remove. |
| `cart.spec.js` | Item appears in the cart, removal empties the cart, Continue Shopping, and cart price matches the inventory listing. |
| `checkout.spec.js` | Full checkout with a generated postal code, and the missing postal code error. |

---

## Getting Started

### Prerequisites

- **Node.js:** a current LTS version (CI uses Node 22). See [nodejs.org](https://nodejs.org/).
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vikneshgs23/playwright-swaglabs-js.git
   cd playwright-swaglabs-js
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install the Playwright browsers and their system dependencies:**
   ```bash
   npx playwright install --with-deps
   ```

---

## Running Tests

| Command | Action |
| :--- | :--- |
| `npm test` | Runs the full suite headlessly on Chromium, Firefox and WebKit. |
| `npm run test:smoke` | Runs only the tests tagged `@smoke`. |
| `npm run test:e2e` | Runs only `tests/e2e.spec.js`. |
| `npm run test:chromium` | Runs on Chromium only. |
| `npm run test:firefox` | Runs on Firefox only. |
| `npm run test:webkit` | Runs on WebKit only. |
| `npm run test:headed` | Runs with visible browser windows. |
| `npm run test:ui` | Opens Playwright's interactive UI mode. |
| `npm run report` | Opens the generated HTML report locally. |
| `npm run lint` | Lints the specs and fixtures with ESLint and `eslint-plugin-playwright`. |
| `npm run format` | Formats the code with Prettier. |

---

## Continuous Integration

The workflow `.github/workflows/playwright.yml` runs on:

- Pushes and pull requests to `main` or `master` (changes to Markdown files are ignored)
- A nightly scheduled run at 08:00 IST, which also refreshes the live report
- Manual runs from the Actions tab

### CI configuration

- **Environment:** `ubuntu-latest` with Node.js 22 and cached npm dependencies and Playwright browsers.
- **Parallelism:** 2 parallel workers, and tests within each file also run in parallel.
- **Retries:** A failing test is retried once on CI. Trace and video are captured on the first retry, and screenshots on failure.
- **Concurrency:** A newer push to a pull request cancels that pull request's older run. Runs on the main branch are never cancelled, so a report deployment cannot be interrupted.
- **Artifacts:** The HTML report (which includes traces, screenshots and video) is uploaded on every run, even failed ones, and kept for 30 days.
- **Report deployment:** After pushes and scheduled runs (not pull requests), the HTML report is deployed to GitHub Pages.
- **Dependencies:** Dependabot opens update pull requests for npm packages and GitHub Actions.

---

## Test Reports

**Live report:** [View the latest Playwright report](https://vikneshgs23.github.io/playwright-swaglabs-js/) (published from the most recent push to the main branch or nightly run).

After a local run, open the report with:

```bash
npm run report
```

---

## Author

**Viknesh GS** - [GitHub](https://github.com/vikneshgs23) · [LinkedIn](https://www.linkedin.com/in/gs-viknesh)
