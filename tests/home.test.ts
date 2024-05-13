import { test, expect } from '@playwright/test';

test.use({ storageState: './playwright/.auth/user.json' });

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/Nutrivia/);
});

test('has products', async ({ page }) => {
  const testItems = ["Chocapic", "Basilico Sauce"];

  for (const itemName of testItems) {
    const item = page.getByText(itemName)
      .locator("..").locator("..").locator("..").locator(".."); // get parent div
    await expect(item).toBeVisible();
    await expect(item).toHaveText(/Read more/);
    await expect(item).toHaveText(/score/);
  }
});


test('finds product', async ({ page }) => {
  const searchBox = page.getByRole('textbox');
  await expect(searchBox).toBeVisible();

  await searchBox.fill("salt");

  const item = page.getByText("Salt Chips");
  await expect(item).toBeVisible();
});
