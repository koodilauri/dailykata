class Queue<T> {
  enqueue(value: T): void {}
  dequeue(): T | undefined { return undefined }
  front(): T | undefined { return undefined }
  isEmpty(): boolean { return true }
  size(): number { return 0 }
}
