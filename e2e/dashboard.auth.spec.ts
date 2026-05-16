import { test, expect } from '@playwright/test'

test('authenticated user can access dashboard', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page).toHaveURL('/dashboard')
})

test('header shows level badge when authenticated', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText(/Lv \d+/)).toBeVisible()
})

test('authenticated user has avatar button in header', async ({ page }) => {
  await page.goto('/')

  // The avatar trigger button (showing user initial) only appears when logged in
  const avatarButton = page
    .locator('header')
    .getByRole('button')
    .filter({ hasText: /^[A-Z]$/ })
    .first()
  await expect(avatarButton).toBeVisible()
})

test('authenticated user sees kata list with sections', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('section').first()).toBeVisible()
})
