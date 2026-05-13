test('returns the string unchanged if it fits in the column', () => {
  expect(wordWrap('hello', 10)).toBe('hello')
})
test('wraps at the column boundary', () => {
  expect(wordWrap('abcdef', 3)).toBe('abc\ndef')
})
test('wraps multiple times', () => {
  expect(wordWrap('abcdefghi', 3)).toBe('abc\ndef\nghi')
})
test('breaks at a space when it falls on the boundary', () => {
  expect(wordWrap('ab cd ef', 5)).toBe('ab cd\nef')
})
test('handles empty string', () => {
  expect(wordWrap('', 5)).toBe('')
})
