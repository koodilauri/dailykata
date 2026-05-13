test('all dead cells stay dead', () => {
  expect(nextGeneration([[0, 0], [0, 0]])).toEqual([[0, 0], [0, 0]])
})
test('a lone live cell dies from underpopulation', () => {
  expect(nextGeneration([[0, 0, 0], [0, 1, 0], [0, 0, 0]])).toEqual([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
})
test('blinker oscillates from vertical to horizontal', () => {
  expect(nextGeneration([[0, 1, 0], [0, 1, 0], [0, 1, 0]])).toEqual([[0, 0, 0], [1, 1, 1], [0, 0, 0]])
})
test('block pattern is stable', () => {
  expect(nextGeneration([[1, 1, 0], [1, 1, 0], [0, 0, 0]])).toEqual([[1, 1, 0], [1, 1, 0], [0, 0, 0]])
})
test('a live cell dies from overpopulation with 4+ neighbours', () => {
  expect(nextGeneration([[1, 1, 1], [1, 1, 0], [0, 0, 0]])).toEqual([[1, 0, 1], [1, 0, 1], [0, 0, 0]])
})
