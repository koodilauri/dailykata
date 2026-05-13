test('returns 0 for n=0', () => {
  expect(fibonacci(0)).toBe(0)
})
test('returns 1 for n=1', () => {
  expect(fibonacci(1)).toBe(1)
})
test('returns 1 for n=2', () => {
  expect(fibonacci(2)).toBe(1)
})
test('returns 8 for n=6', () => {
  expect(fibonacci(6)).toBe(8)
})
test('returns 55 for n=10', () => {
  expect(fibonacci(10)).toBe(55)
})
