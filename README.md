# Swag Labs E2E Test Automation Framework

An end-to-end test automation framework built for [SauceDemo (Swag Labs)](https://www.saucedemo.com/) using **JavaScript** and **Playwright Test Runner**. Designed with scalable architecture, Page Object Model (POM), cross-browser execution, and automated CI pipeline integration via GitHub Actions.

---

## 🛠️ Tech Stack & Tools

- **Core:** JavaScript (ES6+)
- **Test Automation:** [Playwright](https://playwright.dev/)
- **Design Pattern:** Page Object Model (POM)
- **CI/CD:** GitHub Actions
- **Reporting:** Playwright HTML Reporter, Trace Viewer, and Artifacts

---

## 📁 Project Architecture

```text
playwright-swaglabs-js/
├── .github/
│   └── workflows/
│       └── playwright.yml         # CI workflow definition
├── pages/                         # Page Object classes (POM)
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/                         # E2E test specs
│   └── swaglabs.spec.js
├── test-data/                     # Static test data & payloads
│   └── users.json
├── utils/                         # Helper utilities & constants
│   ├── constants.js
│   ├── dataHelper.js
│   ├── visualHelper.js
│   └── index.js
├── playwright.config.js           # Playwright global configurations
├── package.json                   # Dependencies & custom run scripts
└── README.md

✨ Framework Features
    Page Object Model (POM): Decoupled UI locators and user actions from test logic for high reusability and ease of maintenance.

    Headless by Default: Preconfigured to run headless for speed and CI efficiency.

    Cross-Browser Testing: Configured for parallel execution across Chromium, Firefox, and WebKit (Safari).

    Failure Artifacts: Automatically captures full-page screenshots and execution traces on test retries/failures.

    Continuous Integration: Fully automated headless test execution via GitHub Actions on every push and pull request, with downloadable HTML report artifacts.

🚀 Getting Started
    Prerequisites
    Node.js (v18 or higher recommended)
    Git

Installation
Clone the repository:
    git clone [https://github.com/vikneshgs23/playwright-swaglabs-js.git](https://github.com/vikneshgs23/playwright-swaglabs-js.git)
cd playwright-swaglabs-js
Install project dependencies:
    npm install
Install Playwright browser binaries:
    npx playwright install --with-deps

🧪 Running Tests 
       Command                 Description
       npm test               Runs the full E2E test suite headless across all configured browsers
       npm run test:chromium  Runs the test suite only on the Chromium engine
       npm run report         Serves and opens the generated HTML test report in your browser
📊 Test Reporting & Debugging
Playwright automatically generates a detailed report after each run. To inspect test steps, assertions, network logs, and failure screenshots:
    npm run report

To run tests with the interactive time-travel debugger:
    npx playwright test --ui