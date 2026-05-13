const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
}

test('visits all nodes starting from A', () => {
  expect(bfs(graph, 'A')).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
})
test('starts correctly from a different node', () => {
  expect(bfs(graph, 'D')).toEqual(['D', 'B', 'A', 'E', 'C', 'F'])
})
test('single node graph', () => {
  expect(bfs({ X: [] }, 'X')).toEqual(['X'])
})
test('two connected nodes', () => {
  expect(bfs({ A: ['B'], B: ['A'] }, 'A')).toEqual(['A', 'B'])
})
