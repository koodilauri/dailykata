Given the head of a singly linked list, return the head of the reversed list.

Use the `ListNode` class: `class ListNode<T> { constructor(public value: T, public next: ListNode<T> | null = null) {} }`

Examples:
  [1 → 2 → 3 → 4 → 5]  =>  [5 → 4 → 3 → 2 → 1]
  [1 → 2]               =>  [2 → 1]
  [1]                   =>  [1]
