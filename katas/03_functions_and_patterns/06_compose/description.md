Write a function `compose` that takes any number of functions and returns a new function that applies them from right to left.

Examples:
  const add1 = (x: number) => x + 1
  const double = (x: number) => x * 2
  const doubleThenAdd1 = compose(add1, double)
  doubleThenAdd1(3)  // 7  (double(3) = 6, add1(6) = 7)
