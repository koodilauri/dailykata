Conway's Game of Life: given a 2D grid (1=alive, 0=dead), return the next generation.

Rules:
1. A live cell with fewer than 2 live neighbours dies (underpopulation).
2. A live cell with 2 or 3 live neighbours survives.
3. A live cell with more than 3 live neighbours dies (overpopulation).
4. A dead cell with exactly 3 live neighbours becomes alive (reproduction).

Examples:
  nextGeneration([    // blinker oscillates:
    [0, 1, 0],
    [0, 1, 0],        // =>  [0, 0, 0]
    [0, 1, 0],        //     [1, 1, 1]
  ])                  //     [0, 0, 0]
