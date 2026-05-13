Write a function `dijkstra` that finds the shortest distance from a start node to all other nodes in a weighted directed graph.

The graph is an adjacency list where each entry is an array of [neighbour, weight] pairs.

Return an object mapping each node to its shortest distance from start.

Examples:
  const graph = {
    A: [['B', 1], ['D', 4]],
    B: [['C', 2]],
    C: [['F', 1]],
    D: [['E', 3]],
    E: [['F', 1]],
    F: []
  }
  dijkstra(graph, 'A')
  // { A: 0, B: 1, C: 3, D: 4, E: 7, F: 4 }
