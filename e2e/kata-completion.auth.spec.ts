import { test, expect } from '@playwright/test'

const KATA_SLUG = 'reverse-a-string'
const SOLUTION = `function reverseString(str: string): string {
  return str.split('').reverse().join('')
}`

async function setEditorContent(page: import('@playwright/test').Page, code: string) {
  // Wait for KataEditor to mount — KataBar with Run Tests button is the signal
  // Use a long timeout since the kata page does client-side rendering in dev
  await page.getByRole('button', { name: /run tests/i }).waitFor({ timeout: 30_000 })
  await page.locator('.cm-editor').first().click({ force: true })
  await page.keyboard.press('Control+a')
  await page.keyboard.type(code)
}

test('kata page loads and editor mounts', async ({ page }) => {
  await page.goto(`/kata/${KATA_SLUG}`)

  // In dev the kata page falls back to client rendering — wait generously
  await expect(page.getByRole('button', { name: /run tests/i })).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('.cm-editor').first()).toBeAttached({ timeout: 5_000 })
})

test('user can navigate to a kata and complete it', async ({ page }) => {
  await page.goto(`/kata/${KATA_SLUG}`)

  await setEditorContent(page, SOLUTION)
  await page.getByRole('button', { name: /run tests/i }).click()

  // Results panel shows all tests passing
  await expect(page.getByText('All tests passed!')).toBeVisible({ timeout: 15_000 })

  // Next → button appears once kata is marked complete
  await expect(page.getByRole('link', { name: 'Next →' })).toBeVisible({ timeout: 10_000 })
})

test('completed kata shows checkmark on the kata list', async ({ page }) => {
  // Complete the kata
  await page.goto(`/kata/${KATA_SLUG}`)
  await setEditorContent(page, SOLUTION)
  await page.getByRole('button', { name: /run tests/i }).click()
  await expect(page.getByText('All tests passed!')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByRole('link', { name: 'Next →' })).toBeVisible({ timeout: 10_000 })

  // Navigate to kata list
  await page.goto('/')

  // The completed kata card shows a checkmark
  const kataCard = page.locator('li').filter({ hasText: 'Reverse a String' })
  await expect(kataCard.locator('text=✓')).toBeVisible()
})
