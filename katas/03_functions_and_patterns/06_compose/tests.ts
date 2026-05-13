test('applies two functions right to left', () => {
  const add1 = (x: number) => x + 1;
  const double = (x: number) => x * 2;
  expect(compose(add1, double)(3)).toBe(7);
});
test('applies three functions', () => {
  const add1 = (x: number) => x + 1;
  const double = (x: number) => x * 2;
  const square = (x: number) => x * x;
  expect(compose(add1, double, square)(3)).toBe(19);
});
test('single function passthrough', () => {
  const fn = (x: number) => x * 5;
  expect(compose(fn)(4)).toBe(20);
});
