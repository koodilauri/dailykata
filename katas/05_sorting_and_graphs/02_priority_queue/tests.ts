test('peek returns the minimum without removing', () => {
  const h = new MinHeap()
  h.push(5); h.push(1); h.push(3)
  expect(h.peek()).toBe(1)
  expect(h.size()).toBe(3)
})
test('pop returns elements in ascending order', () => {
  const h = new MinHeap()
  h.push(5); h.push(1); h.push(3)
  expect(h.pop()).toBe(1)
  expect(h.pop()).toBe(3)
  expect(h.pop()).toBe(5)
})
test('pop on empty heap returns undefined', () => {
  expect(new MinHeap().pop()).toBeUndefined()
})
test('size tracks element count', () => {
  const h = new MinHeap()
  h.push(2); h.push(4)
  expect(h.size()).toBe(2)
  h.pop()
  expect(h.size()).toBe(1)
})
test('handles duplicate values', () => {
  const h = new MinHeap()
  h.push(2); h.push(2); h.push(1)
  expect(h.pop()).toBe(1)
  expect(h.pop()).toBe(2)
})
