function toArray<T>(head: ListNode<T> | null): T[] {
  const result: T[] = []
  let curr = head
  while (curr) { result.push(curr.value); curr = curr.next }
  return result
}
function fromArray<T>(arr: T[]): ListNode<T> | null {
  if (!arr.length) return null
  const head = new ListNode(arr[0])
  let curr = head
  for (let i = 1; i < arr.length; i++) { curr.next = new ListNode(arr[i]); curr = curr.next }
  return head
}

test('reverses a list of 5 nodes', () => {
  expect(toArray(reverseLinkedList(fromArray([1,2,3,4,5])))).toEqual([5,4,3,2,1])
})
test('reverses a list of 2 nodes', () => {
  expect(toArray(reverseLinkedList(fromArray([1,2])))).toEqual([2,1])
})
test('single node returns itself', () => {
  expect(toArray(reverseLinkedList(fromArray([1])))).toEqual([1])
})
test('null input returns null', () => {
  expect(reverseLinkedList(null)).toBeNull()
})
