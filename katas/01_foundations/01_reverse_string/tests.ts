test('reverses a simple string', () => {
  expect(reverseString('hello')).toBe('olleh');
});
test('reverses a single character', () => {
  expect(reverseString('a')).toBe('a');
});
test('handles empty string', () => {
  expect(reverseString('')).toBe('');
});
test('reverses a word with repeated chars', () => {
  expect(reverseString('racecar')).toBe('racecar');
});
