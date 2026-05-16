import { test, expect } from '@playwright/test'

test('kata list renders on home page', async ({ page }) => {
  await page.goto('/')

  // Sections are rendered as <section> elements with a heading
  await expect(page.locator('section').first()).toBeVisible()
  // At least one kata link is visible
  await expect(page.locator('ul li a').first()).toBeVisible()
})

test('shows section progress counter', async ({ page }) => {
  await page.goto('/')

  // Each section shows a "done/total" counter like "0/5"
  await expect(page.locator('text=/\\d+\\/\\d+/').first()).toBeVisible()
})
