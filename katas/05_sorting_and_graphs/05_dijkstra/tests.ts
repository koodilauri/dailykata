const graph = {
  A: [['B', 1], ['D', 4]],
  B: [['C', 2]],
  C: [['F', 1]],
  D: [['E', 3]],
  E: [['F', 1]],
  F: []
} as Record<string, Array<[string, number]>>

test('returns 0 distance for the start node', () => {
  expect(dijkstra(graph, 'A').A).toBe(0)
})
test('finds shortest path through multiple hops', () => {
  const result = dijkstra(graph, 'A')
  expect(result.B).toBe(1)
  expect(result.C).toBe(3)
  expect(result.F).toBe(4)
})
test('picks shorter path over fewer hops', () => {
  expect(dijkstra(graph, 'A').E).toBe(7)
})
test('single node graph', () => {
  expect(dijkstra({ X: [] }, 'X')).toEqual({ X: 0 })
})
