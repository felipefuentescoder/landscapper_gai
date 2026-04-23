import { test, expect } from '@playwright/test';

test.describe('Happy Path', () => {
  test('home page loads without error', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('wizard page loads with form elements', async ({ page }) => {
    await page.goto('/wizard');
    await expect(page.getByRole('heading', { name: 'Site Builder' })).toBeVisible();
    await expect(page.locator('input[name="businessName"]')).toBeVisible();
    await expect(page.locator('input[name="heroText"]')).toBeVisible();
  });

  test('create site via wizard and view published site', async ({ page }) => {
    const businessName = 'Test Landscaping Co';
    const heroText = 'Professional Lawn Care';

    await page.goto('/wizard');
    await page.locator('input[name="businessName"]').fill(businessName);
    await page.locator('input[name="heroText"]').fill(heroText);
    await page.getByRole('button', { name: 'Publish & Go Live' }).click();

    await expect(page).toHaveURL(/\/site\/.+/);
    await expect(page.getByRole('heading', { name: businessName })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: heroText, level: 1 })).toBeVisible();
  });
});