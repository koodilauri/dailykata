test('enqueue and dequeue return values in FIFO order', () => {
  const q = new Queue<number>()
  q.enqueue(1); q.enqueue(2); q.enqueue(3)
  expect(q.dequeue()).toBe(1)
  expect(q.dequeue()).toBe(2)
})
test('front returns the first value without removing it', () => {
  const q = new Queue<number>()
  q.enqueue(10)
  expect(q.front()).toBe(10)
  expect(q.size()).toBe(1)
})
test('isEmpty returns true for empty queue', () => {
  const q = new Queue<number>()
  expect(q.isEmpty()).toBe(true)
  q.enqueue(1)
  expect(q.isEmpty()).toBe(false)
})
test('dequeue on empty queue returns undefined', () => {
  const q = new Queue<number>()
  expect(q.dequeue()).toBeUndefined()
})
test('size tracks element count correctly', () => {
  const q = new Queue<string>()
  q.enqueue('x'); q.enqueue('y')
  expect(q.size()).toBe(2)
  q.dequeue()
  expect(q.size()).toBe(1)
})
