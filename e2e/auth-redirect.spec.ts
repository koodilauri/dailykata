import { test, expect } from '@playwright/test'

test('unauthenticated /dashboard redirects to /', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('/dashboard')
  await expect(page).toHaveURL('/')

  await context.close()
})

test('unauthenticated /account redirects to /', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('/account')
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

test('demo button is visible when logged out', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Try demo' })).toBeVisible()

  await context.close()
})
