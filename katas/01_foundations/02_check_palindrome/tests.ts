test('detects a simple palindrome', () => {
  expect(isPalindrome('racecar')).toBeTruthy();
});
test('returns false for non-palindrome', () => {
  expect(isPalindrome('hello')).toBeFalsy();
});
test('is case-insensitive', () => {
  expect(isPalindrome('Madam')).toBeTruthy();
});
test('single character is always a palindrome', () => {
  expect(isPalindrome('a')).toBeTruthy();
});
test('empty string is a palindrome', () => {
  expect(isPalindrome('')).toBeTruthy();
});
