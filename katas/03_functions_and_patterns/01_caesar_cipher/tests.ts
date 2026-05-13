test('shifts letters forward', () => {
  expect(caesarCipher('abc', 1)).toBe('bcd')
})
test('wraps around the alphabet', () => {
  expect(caesarCipher('xyz', 2)).toBe('zab')
})
test('preserves case', () => {
  expect(caesarCipher('Hello', 3)).toBe('Khoor')
})
test('leaves non-letter characters unchanged', () => {
  expect(caesarCipher('Hello!', 3)).toBe('Khoor!')
})
test('handles negative shifts', () => {
  expect(caesarCipher('bcd', -1)).toBe('abc')
})
test('handles shifts larger than 26', () => {
  expect(caesarCipher('abc', 27)).toBe('bcd')
})
