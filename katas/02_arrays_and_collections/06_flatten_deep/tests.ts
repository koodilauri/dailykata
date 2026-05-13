test('flattens deeply nested array', () => {
  expect(flattenDeep([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4]);
});
test('flattens multiple levels', () => {
  expect(flattenDeep([[1], [[2, [3]]]])).toEqual([1, 2, 3]);
});
test('handles already-flat array', () => {
  expect(flattenDeep([1, 2, 3])).toEqual([1, 2, 3]);
});
test('handles empty array', () => {
  expect(flattenDeep([])).toEqual([]);
});
