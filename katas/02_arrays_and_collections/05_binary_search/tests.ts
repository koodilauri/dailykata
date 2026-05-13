test('finds element in the middle', () => {
  expect(binarySearch([1,3,5,7,9], 5)).toBe(2);
});
test('returns -1 when not found', () => {
  expect(binarySearch([1,3,5,7,9], 6)).toBe(-1);
});
test('finds first element', () => {
  expect(binarySearch([1,3,5,7,9], 1)).toBe(0);
});
test('finds last element', () => {
  expect(binarySearch([1,3,5,7,9], 9)).toBe(4);
});
test('single element array', () => {
  expect(binarySearch([2], 2)).toBe(0);
});
