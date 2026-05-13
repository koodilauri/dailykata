test('counts vowels in "hello"', () => {
  expect(countVowels('hello')).toBe(2);
});
test('returns 0 for no vowels', () => {
  expect(countVowels('rhythm')).toBe(0);
});
test('is case-insensitive', () => {
  expect(countVowels('AEIOU')).toBe(5);
});
test('handles empty string', () => {
  expect(countVowels('')).toBe(0);
});
