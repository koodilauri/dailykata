Implement a `MinHeap` (priority queue) class:
- `push(value)` — insert a number
- `pop()` — remove and return the smallest number (undefined if empty)
- `peek()` — return the smallest number without removing it (undefined if empty)
- `size()` — return the number of elements

Examples:
  const heap = new MinHeap()
  heap.push(5); heap.push(1); heap.push(3)
  heap.peek()  // 1
  heap.pop()   // 1
  heap.peek()  // 3
