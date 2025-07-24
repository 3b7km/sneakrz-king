// Utility functions for URL generation and product routing

/**
 * Generate a URL-friendly slug from product name
 * @param {string} name - Product name
 * @returns {string} - URL slug
 */
export const generateProductSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Find product by slug
 * @param {Array} products - Array of products
 * @param {string} slug - Product slug
 * @returns {Object|null} - Found product or null
 */
export const findProductBySlug = (products, slug) => {
  return products.find(product => generateProductSlug(product.name) === slug) || null;
};

/**
 * Generate full product URL
 * @param {Object} product - Product object
 * @returns {string} - Product URL
 */
export const getProductUrl = (product) => {
  return `/product/${generateProductSlug(product.name)}`;
};
