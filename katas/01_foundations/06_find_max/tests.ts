test('finds the max in a positive array', () => {
  expect(findMax([1, 3, 2])).toBe(3);
});
test('finds the max in a negative array', () => {
  expect(findMax([-1, -5, -2])).toBe(-1);
});
test('handles a single element', () => {
  expect(findMax([42])).toBe(42);
});
test('handles duplicates', () => {
  expect(findMax([5, 5, 3])).toBe(5);
});
test('handles mixed positive and negative', () => {
  expect(findMax([-10, 0, 10])).toBe(10);
});
