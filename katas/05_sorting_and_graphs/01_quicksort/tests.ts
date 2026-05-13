test('sorts an unsorted array', () => {
  expect(quicksort([3, 1, 4, 1, 5, 9])).toEqual([1, 1, 3, 4, 5, 9])
})
test('returns empty array unchanged', () => {
  expect(quicksort([])).toEqual([])
})
test('single element is already sorted', () => {
  expect(quicksort([1])).toEqual([1])
})
test('sorts a reverse-ordered array', () => {
  expect(quicksort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5])
})
test('handles duplicates', () => {
  expect(quicksort([3, 3, 1, 2])).toEqual([1, 2, 3, 3])
})
