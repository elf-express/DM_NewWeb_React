import { test, expect } from '@playwright/test';

test('homepage has title and navigation', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ELF EXPRESS/);

  // Check for the main heading or logo text
  await expect(page.getByText('ELF EXPRESS 集運中心')).toBeVisible();

  // Check for navigation elements
  await expect(page.getByPlaceholder('搜尋...')).toBeVisible();
  await expect(page.getByText('快速查詢')).toBeVisible();
});
