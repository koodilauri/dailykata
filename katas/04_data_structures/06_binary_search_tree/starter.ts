class BSTNode {
  constructor(
    public value: number,
    public left: BSTNode | null = null,
    public right: BSTNode | null = null
  ) {}
}

class BST {
  root: BSTNode | null = null

  insert(value: number): void {}
  search(value: number): boolean { return false }
  inorder(): number[] { return [] }
}
