import { test, expect } from '@playwright/test'

test('authenticated user can access dashboard', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page).toHaveURL('/dashboard')
})

test('header shows level badge and sign out button when authenticated', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
  await expect(page.getByText(/Lv \d+/)).toBeVisible()
})

test('authenticated user sees completed count on kata list', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText(/\d+ \/ \d+ completed/)).toBeVisible()
})
