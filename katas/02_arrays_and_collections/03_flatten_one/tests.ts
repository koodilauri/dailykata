test('flattens one level', () => {
  expect(flattenOne([1, [2, 3], [4]])).toEqual([1, 2, 3, 4]);
});
test('does not flatten deeper than one level', () => {
  expect(flattenOne([[1, [2]], [3]])).toEqual([1, [2], 3]);
});
test('handles already-flat array', () => {
  expect(flattenOne([1, 2, 3])).toEqual([1, 2, 3]);
});
test('handles empty array', () => {
  expect(flattenOne([])).toEqual([]);
});
