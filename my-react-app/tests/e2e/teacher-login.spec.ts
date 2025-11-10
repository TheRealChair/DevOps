import { test, expect } from '@playwright/test';

// Read credentials from environment variables for security.
// Set E2E_TEACHER_EMAIL and E2E_TEACHER_PASSWORD in your environment or CI secrets.
const EMAIL: string | undefined = (globalThis as any).process?.env?.E2E_TEACHER_EMAIL;
const PASSWORD: string | undefined = (globalThis as any).process?.env?.E2E_TEACHER_PASSWORD;

test('teacher can sign in with test account', async ({ page }) => {
  test.skip(!EMAIL || !PASSWORD, 'Set E2E_TEACHER_EMAIL and E2E_TEACHER_PASSWORD to run this test');
  // Go to home and navigate to Underviser login
  await page.goto('/');
  await page.getByRole('button', { name: /Underviser/i }).click();
  await expect(page).toHaveURL(/\/underviser\/login$/);
  await expect(page.getByRole('heading', { level: 2, name: /Underviser Login/i })).toBeVisible();

  // Fill credentials and submit
  await page.getByPlaceholder('Indtast din email').fill(EMAIL!);
  await page.getByPlaceholder('Indtast din adgangskode').fill(PASSWORD!);
  await page.getByRole('button', { name: /^Log Ind$/ }).click();

  // Expect success banner then redirect to /underviser
  await expect(page.getByText(/Succesfuldt logget ind!/i)).toBeVisible({ timeout: 20000 });
  await expect(page).toHaveURL(/\/underviser$/);
  await expect(page.getByRole('heading', { level: 2, name: /Underviser-side/i })).toBeVisible();
});
