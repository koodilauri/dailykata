Write a function `bfs` that performs a breadth-first traversal of an undirected graph represented as an adjacency list, starting from a given node.

Return the nodes in the order they are visited.

Examples:
  const graph = { A: ['B','C'], B: ['A','D','E'], C: ['A','F'], D: ['B'], E: ['B','F'], F: ['C','E'] }
  bfs(graph, 'A')  // ['A', 'B', 'C', 'D', 'E', 'F']
