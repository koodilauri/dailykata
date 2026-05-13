test('returns 0 to n when only one argument is given', () => {
  expect(range(3)).toEqual([0, 1, 2, 3])
})
test('returns start to end inclusive', () => {
  expect(range(1, 4)).toEqual([1, 2, 3, 4])
})
test('returns a single element when start equals end', () => {
  expect(range(3, 3)).toEqual([3])
})
test('counts downward when start is greater than end', () => {
  expect(range(5, 2)).toEqual([5, 4, 3, 2])
})
test('handles negative direction from zero', () => {
  expect(range(-3)).toEqual([0, -1, -2, -3])
})
