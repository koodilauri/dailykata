import { test, expect } from '@playwright/test'

test('kata list renders on home page', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Katas' })).toBeVisible()
  await expect(page.locator('ul li').first()).toBeVisible()
})

test('shows completed count', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText(/\d+ \/ \d+ completed/)).toBeVisible()
})
