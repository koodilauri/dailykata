Write a function `aStar` that finds the shortest path on a 2D grid from start to end, avoiding walls.

- Grid cells: 0 = open, 1 = wall
- Movement: 4-directional (up, down, left, right)
- Returns the path as an array of [row, col] positions (inclusive of start and end), or null if no path exists
- Use Manhattan distance as the heuristic

Examples:
  aStar([[0,0,0],[0,1,0],[0,0,0]], [0,0], [2,2])
  // [[0,0],[1,0],[2,0],[2,1],[2,2]]  (goes around the wall)
