# Swag Labs E2E Test Automation Framework

[![Playwright Tests](https://github.com/vikneshgs23/playwright-swaglabs-js/actions/workflows/playwright.yml/badge.svg)](https://github.com/vikneshgs23/playwright-swaglabs-js/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/badge/Playwright-v1.64+-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An enterprise-grade, scalable End-to-End (E2E) UI test automation framework designed for [SauceDemo (Swag Labs)](https://www.saucedemo.com/) using **JavaScript (ES Modules)** and the **Playwright Test Runner**.

Engineered adhering to Page Object Model (POM) design principles, fully automated CI pipeline integration via GitHub Actions, multi-browser parallel execution, and resilient auto-waiting mechanisms to eliminate test flakiness.

---

## 🛠️ Tech Stack & Architecture

- **Language:** JavaScript (Node.js ES Modules)
- **Test Runner & Engine:** [@playwright/test](https://playwright.dev/)
- **Design Pattern:** Page Object Model (POM) with decoupled locators, actions, and assertions
- **Continuous Integration:** GitHub Actions (`ubuntu-latest`, automated runner provisioning, multi-browser execution matrix)
- **Reporting & Observability:** Playwright List Reporter, HTML Report, Tracing (`on-first-retry`), and failure screenshots

---

## 📁 Project Structure

```text
playwright-swaglabs-js/
├── .github/
│   └── workflows/
│       └── playwright.yml            # Automated CI execution & artifact upload
├── pages/                            # Page Object Model component abstractions
│   ├── BasePage.js                   # Common navigations, waits, and shared locators
│   ├── LoginPage.js                  # Authentication inputs, triggers, and error messages
│   ├── InventoryPage.js              # Product catalog, sorting filters, badge, and menu
│   ├── CartPage.js                   # Cart listing, item removal, and navigation hooks
│   ├── CheckoutStepOnePage.js        # Shipping info form, validations, and cancel actions
│   └── CheckoutStepTwoPage.js        # Order summary, pricing calculations, and completion
├── tests/                            # Test specifications categorized by domain
│   ├── e2e.spec.js                   # Complete multi-step end-to-end user journeys
│   ├── login.spec.js                 # Authentication positive and boundary checks
│   ├── inventory.spec.js             # Sorting algorithms and catalog inventory checks
│   ├── cart.spec.js                  # Cart manipulation, additions, and deletions
│   └── checkout.spec.js              # Multi-tier checkout form flows and tax calculations
├── test-data/                        # Data-driven test assets & JSON payloads
│   └── users.json                    # User credentials and test fixtures
├── utils/                            # Reusable constants, routes, and assertions
│   ├── constants.js                  # Routes, expected headers, and strict error texts
│   └── index.js                      # Barrel export module
├── playwright.config.js              # Global runner settings, browsers, retries, and workers
├── package.json                      # Module metadata and execution script hooks
└── README.md
```

---

## ✨ Key Framework Features

- **Decoupled Page Object Architecture:** Encapsulates DOM locators and page interactions within modular page classes, keeping test specs declarative and maintainable.
- **Flakiness-Resistant Assertions:** Replaces instantaneous checks with Playwright's web-first assertions (`toHaveCount`, `toHaveText`, `toBeVisible`) ensuring resilient polling during asynchronous DOM hydration.
- **Cross-Browser Engine Coverage:** Configured to run concurrently across:
  - **Chromium** (Google Chrome / Edge core)
  - **Mozilla Firefox** (Gecko)
  - **WebKit** (Apple Safari)
- **Defect Handling & Edge Cases:** Automated verification for real-world application flaws (e.g., `problem_user` broken asset links, disabled/failing inputs, unauthorized route redirection).
- **Automated CI Reporting:** Generates self-contained HTML reports and uploads them as build artifacts on every push or pull request to GitHub.

---

## 🧪 Test Coverage Matrix

The suite covers atomic functional specifications and multi-step E2E customer journeys:

| Scenario ID | Test Name | Key Validations |
| :--- | :--- | :--- |
| **`TC_E2E_001`** | Multi-Item Purchase Flow | Complete checkout lifecycle from cart to confirmation with tax/subtotal calculation checks. |
| **`TC_E2E_002`** | Cart State Synchronization | Multi-item addition, item removal in cart, badge count updates, and catalog state persistence. |
| **`TC_E2E_003`** | Catalog Sorting Engine | Price (Low to High, High to Low) and Name (Z to A) sorting algorithms verified against sorted arrays. |
| **`TC_E2E_004`** | Form Field Validations | Checkout Step One mandatory field assertions (First Name, Last Name, Postal Code). |
| **`TC_E2E_005`** | Cancellation Workflows | Cart state integrity verified when aborting checkout at Step One and Step Two. |
| **`TC_E2E_006`** | Known Defect Verification | Handles `problem_user` broken asset images (`sl-404`) and unfillable input attributes. |
| **`TC_E2E_007`** | Session Security & Navigation Guard | Verifies clean logout, back-forward cache invalidation, and direct `/inventory.html` URL access blocks. |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **Git:** Version control installed

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

3. **Install Playwright browser binaries with system dependencies:**
   ```bash
   npx playwright install --with-deps
   ```

---

## ⚙️ Running Tests

| Command | Action |
| :--- | :--- |
| `npm test` | Runs the full test suite headlessly across all three configured browser engines. |
| `npm run test:e2e` | Executes only the End-to-End user journeys (`tests/e2e.spec.js`). |
| `npm run test:chromium` | Executes tests exclusively against Chromium. |
| `npm run test:firefox` | Executes tests exclusively against Mozilla Firefox. |
| `npm run test:webkit` | Executes tests exclusively against WebKit (Safari). |
| `npm run test:headed` | Runs tests in headed mode with visible browser windows. |
| `npm run test:ui` | Opens Playwright's interactive UI mode (debugger, DOM trees, time travel). |
| `npm run report` | Serves the generated Playwright HTML test report locally. |

---

## 📊 Continuous Integration (CI)

The GitHub Actions workflow (`.github/workflows/playwright.yml`) triggers automatically on:
- Every `push` to `main`
- Every `pull_request` targeting `main`

### CI Runner Configuration:
- **Environment:** `ubuntu-latest` (2-core vCPU)
- **Parallelism:** 2 concurrent worker threads
- **Retries:** Configured to retry failing tests once in CI with automatic tracing capture (`video: 'on-first-retry'`, `trace: 'on-first-retry'`).
- **Artifacts:** Full HTML test reports and trace files are automatically attached to the action run and retained for 14 days.

---

## 👤 Author

- **G S Viknesh** - [GitHub Profile](https://github.com/vikneshgs23)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).