import { test, expect } from '@playwright/test'

test('unauthenticated /dashboard redirects to /', async ({ browser }) => {
  // Use a fresh context with no cookies to test unauthenticated state
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('/dashboard')
  await expect(page).toHaveURL('/')

  await context.close()
})

test('unauthenticated /profile redirects to /', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('/profile')
  await expect(page).toHaveURL('/')

  await context.close()
})

test('sign in button is visible when logged out', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Sign in with GitHub' })).toBeVisible()

  await context.close()
})
