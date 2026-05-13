test('push and pop return values in LIFO order', () => {
  const s = new Stack<number>()
  s.push(1); s.push(2); s.push(3)
  expect(s.pop()).toBe(3)
  expect(s.pop()).toBe(2)
})
test('peek returns top without removing it', () => {
  const s = new Stack<number>()
  s.push(5)
  expect(s.peek()).toBe(5)
  expect(s.size()).toBe(1)
})
test('isEmpty returns true for empty stack', () => {
  const s = new Stack<number>()
  expect(s.isEmpty()).toBe(true)
  s.push(1)
  expect(s.isEmpty()).toBe(false)
})
test('pop on empty stack returns undefined', () => {
  const s = new Stack<number>()
  expect(s.pop()).toBeUndefined()
})
test('size tracks element count', () => {
  const s = new Stack<string>()
  s.push('a'); s.push('b')
  expect(s.size()).toBe(2)
  s.pop()
  expect(s.size()).toBe(1)
})
