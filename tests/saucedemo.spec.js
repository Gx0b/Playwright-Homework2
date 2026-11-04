const { test, expect } = require('@playwright/test');

const URL = 'https://www.saucedemo.com';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

async function login(page) {
  await page.goto(URL);
  await page.locator('[data-test="username"]').fill(USERNAME);
  await page.locator('[data-test="password"]').fill(PASSWORD);
  await page.locator('[data-test="login-button"]').click();
}

// R1 - Valid login
test('TC01 - R1: Login with valid credentials', async ({ page }) => {
  await login(page);

  await expect(page).toHaveURL(/inventory.html/);

  await page.screenshot({
    path: 'screenshots/TC01-valid-login.png',
    fullPage: true
  });
});

// R2 - Invalid login
test('TC02 - R2: Reject invalid credentials', async ({ page }) => {
  await page.goto(URL);

  await page.locator('[data-test="username"]').fill('invalid_user');
  await page.locator('[data-test="password"]').fill('wrong_password');
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();

  await page.screenshot({
    path: 'screenshots/TC02-invalid-login.png',
    fullPage: true
  });
});

// R3 - Products page
test('TC03 - R3: Display products page', async ({ page }) => {
  await login(page);

  await expect(page.locator('.title')).toHaveText('Products');
  await expect(page.locator('.inventory_list')).toBeVisible();

  await page.screenshot({
    path: 'screenshots/TC03-products-page.png',
    fullPage: true
  });
});

// R4 - Add product to cart
test('TC04 - R4: Add product to cart', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  await page.screenshot({
    path: 'screenshots/TC04-add-to-cart.png',
    fullPage: true
  });
});

// R5 - Verify product in cart (المصحح باستخدام first لتجنب تكرار العناصر)
test('TC05 - R5: Display selected product in cart', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  await expect(page.locator('[data-test="inventory-item-name"]').first())
    .toHaveText('Sauce Labs Backpack');

  await page.screenshot({
    path: 'screenshots/TC05-cart-product.png',
    fullPage: true
  });
});

// R6 - Remove product from cart
test('TC06 - R6: Remove product from cart', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  await expect(page.locator('[data-test="cart-item"]')).toHaveCount(0);
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

  await page.screenshot({
    path: 'screenshots/TC06-remove-product.png',
    fullPage: true
  });
});