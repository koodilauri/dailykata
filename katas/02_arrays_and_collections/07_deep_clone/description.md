Write a function `deepClone` that creates a deep copy of a plain object or array (no functions, no circular refs, just nested objects and arrays).

Examples:
  const obj = { a: 1, b: { c: 2 } }
  const clone = deepClone(obj)
  clone.b.c = 99
  obj.b.c  // still 2
