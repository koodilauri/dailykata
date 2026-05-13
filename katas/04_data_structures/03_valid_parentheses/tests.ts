test('empty string is valid', () => {
  expect(isValid('')).toBe(true)
})
test('single matching pair is valid', () => {
  expect(isValid('()')).toBe(true)
})
test('multiple different pairs are valid', () => {
  expect(isValid('()[]{}')).toBe(true)
})
test('nested brackets are valid', () => {
  expect(isValid('{[]}')).toBe(true)
})
test('mismatched brackets are invalid', () => {
  expect(isValid('(]')).toBe(false)
})
test('interleaved brackets are invalid', () => {
  expect(isValid('([)]')).toBe(false)
})
test('unclosed bracket is invalid', () => {
  expect(isValid('(')).toBe(false)
})
