import { test } from '@playwright/test';

/**
 * Attaches a manual full-page screenshot to the Playwright report.
 * @param {import('@playwright/test').Page} page
 * @param {string} stepName
 */
export async function attachScreenshot(page, stepName) {
  const screenshot = await page.screenshot({ fullPage: true });
  await test.info().attach(stepName, {
    body: screenshot,
    contentType: 'image/png',
  });
}