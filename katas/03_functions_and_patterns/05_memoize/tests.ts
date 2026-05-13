test('returns correct result', () => {
  const double = memoize((n: number) => n * 2);
  expect(double(4)).toBe(8);
});
test('caches results', () => {
  let calls = 0;
  const fn = memoize((n: number) => { calls++; return n * 3; });
  fn(5);
  fn(5);
  expect(calls).toBe(1);
});
test('caches independently per argument', () => {
  let calls = 0;
  const fn = memoize((n: number) => { calls++; return n; });
  fn(1); fn(2); fn(1);
  expect(calls).toBe(2);
});
