class ListNode<T> {
  constructor(public value: T, public next: ListNode<T> | null = null) {}
}

class LinkedList<T> {
  head: ListNode<T> | null = null

  append(value: T): void {}
  prepend(value: T): void {}
  delete(value: T): void {}
  find(value: T): boolean { return false }
  toArray(): T[] { return [] }
}
