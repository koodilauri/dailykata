import { test as setup, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const authFile = path.join(__dirname, '.auth/user.json')

setup('create authenticated session', async ({ request }) => {
  const response = await request.get('http://localhost:3000/api/auth/test-login')
  expect(response.ok()).toBeTruthy()
  await request.storageState({ path: authFile })
})
