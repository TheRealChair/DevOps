import { test, expect } from '@playwright/test';

// Basic smoke test for the Home page
// Assumes vite preview serves on http://localhost:4173 (see playwright.config.ts)

test('home page renders and navigates to Underviser login', async ({ page }) => {
  await page.goto('/');

  // Check the main heading exists (Danish text used in the app)
  await expect(page.getByRole('heading', { level: 1, name: /Velkommen til Escape Room/i })).toBeVisible();

  // Navigate to Underviser login
  await page.getByRole('button', { name: /Underviser/i }).click();
  await expect(page).toHaveURL(/\/underviser\/login/);
});
