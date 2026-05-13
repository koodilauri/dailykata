test('chunks evenly', () => {
  expect(chunk([1,2,3,4], 2)).toEqual([[1,2],[3,4]]);
});
test('last chunk is smaller when uneven', () => {
  expect(chunk([1,2,3,4,5], 2)).toEqual([[1,2],[3,4],[5]]);
});
test('chunk size equals array length', () => {
  expect(chunk([1,2,3], 3)).toEqual([[1,2,3]]);
});
test('handles empty array', () => {
  expect(chunk([], 2)).toEqual([]);
});
