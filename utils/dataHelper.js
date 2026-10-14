/**
 * Strips currency symbols and converts string price to a clean float.
 * Example: "$29.99" -> 29.99
 * @param {string} priceString
 * @returns {number}
 */
export function parsePrice(priceString) {
  return parseFloat(priceString.replace(/[^0-9.]/g, ''));
}

/**
 * Generates random postal/zip code strings for checkout forms.
 * @returns {string}
 */
export function generateZipCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}