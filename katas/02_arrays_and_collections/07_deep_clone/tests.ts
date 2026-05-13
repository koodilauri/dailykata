test('clones a flat object', () => {
  const obj = { a: 1, b: 2 };
  const clone = deepClone(obj);
  expect(clone).toEqual(obj);
  expect(clone).not.toBe(obj);
});
test('clones nested objects independently', () => {
  const obj = { a: { b: { c: 3 } } };
  const clone = deepClone(obj);
  clone.a.b.c = 99;
  expect(obj.a.b.c).toBe(3);
});
test('clones arrays', () => {
  const arr = [1, [2, 3], { x: 4 }];
  const clone = deepClone(arr);
  clone[1][0] = 99;
  expect(arr[1][0]).toBe(2);
});
