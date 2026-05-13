test('append adds values in order', () => {
  const list = new LinkedList<number>()
  list.append(1); list.append(2); list.append(3)
  expect(list.toArray()).toEqual([1, 2, 3])
})
test('prepend adds value at the start', () => {
  const list = new LinkedList<number>()
  list.append(2); list.prepend(1)
  expect(list.toArray()).toEqual([1, 2])
})
test('find returns true if value exists', () => {
  const list = new LinkedList<number>()
  list.append(1); list.append(2)
  expect(list.find(2)).toBe(true)
  expect(list.find(99)).toBe(false)
})
test('delete removes the first matching node', () => {
  const list = new LinkedList<number>()
  list.append(1); list.append(2); list.append(3)
  list.delete(2)
  expect(list.toArray()).toEqual([1, 3])
})
test('delete the head node', () => {
  const list = new LinkedList<number>()
  list.append(1); list.append(2)
  list.delete(1)
  expect(list.toArray()).toEqual([2])
})
