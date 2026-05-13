test('inorder traversal returns values in sorted order', () => {
  const bst = new BST()
  bst.insert(5); bst.insert(3); bst.insert(7); bst.insert(1); bst.insert(4)
  expect(bst.inorder()).toEqual([1, 3, 4, 5, 7])
})
test('search finds an existing value', () => {
  const bst = new BST()
  bst.insert(5); bst.insert(3); bst.insert(7)
  expect(bst.search(3)).toBe(true)
})
test('search returns false for missing value', () => {
  const bst = new BST()
  bst.insert(5)
  expect(bst.search(99)).toBe(false)
})
test('duplicate inserts are ignored', () => {
  const bst = new BST()
  bst.insert(5); bst.insert(5)
  expect(bst.inorder()).toEqual([5])
})
test('handles a single node', () => {
  const bst = new BST()
  bst.insert(10)
  expect(bst.inorder()).toEqual([10])
  expect(bst.search(10)).toBe(true)
})
