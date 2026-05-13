test('returns 0 for an empty string', () => {
  expect(add('')).toBe(0)
})
test('returns the number for a single value', () => {
  expect(add('1')).toBe(1)
})
test('sums two comma-separated numbers', () => {
  expect(add('1,2')).toBe(3)
})
test('handles newlines as separators', () => {
  expect(add('1\n2,3')).toBe(6)
})
test('supports a custom delimiter on the first line', () => {
  expect(add('//;\n1;2')).toBe(3)
})
test('throws listing all negatives', () => {
  expect(() => add('1,-2,3,-4')).toThrow('negatives not allowed: -2, -4')
})
