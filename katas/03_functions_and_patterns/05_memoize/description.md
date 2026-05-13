Write a function `memoize` that wraps another function and caches its results. When called with the same arguments again, it returns the cached result instead of re-computing.

Examples:
  let calls = 0
  const slow = memoize((n: number) => { calls++; return n * 2 })
  slow(5)  // 10, calls === 1
  slow(5)  // 10, calls still === 1 (cached)
  slow(6)  // 12, calls === 2
