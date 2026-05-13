test('sums digits of 123', () => {
  expect(sumDigits(123)).toBe(6);
});
test('handles zero', () => {
  expect(sumDigits(0)).toBe(0);
});
test('handles single digit', () => {
  expect(sumDigits(7)).toBe(7);
});
test('sums digits of 9999', () => {
  expect(sumDigits(9999)).toBe(36);
});
