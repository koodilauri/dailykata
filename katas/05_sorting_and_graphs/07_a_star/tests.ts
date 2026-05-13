test('returns a path on an open grid', () => {
  const path = aStar([[0,0],[0,0]], [0,0], [1,1])
  expect(path).not.toBeNull()
  expect(path![0]).toEqual([0,0])
  expect(path![path!.length - 1]).toEqual([1,1])
})
test('navigates around a wall', () => {
  const grid = [[0,0,0],[0,1,0],[0,0,0]]
  const path = aStar(grid, [0,0], [2,2])
  expect(path).not.toBeNull()
  expect(path![0]).toEqual([0,0])
  expect(path![path!.length - 1]).toEqual([2,2])
  expect(path!.every(([r,c]) => grid[r][c] === 0)).toBe(true)
})
test('returns null when no path exists', () => {
  const grid = [[0,1,0],[1,1,1],[0,1,0]]
  expect(aStar(grid, [0,0], [0,2])).toBeNull()
})
test('start equals end returns single-element path', () => {
  expect(aStar([[0,0],[0,0]], [0,0], [0,0])).toEqual([[0,0]])
})
