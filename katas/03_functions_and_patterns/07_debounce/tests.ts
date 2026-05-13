test('calls fn after delay', async () => {
  let count = 0;
  const inc = debounce(() => { count++; }, 20);
  inc();
  await new Promise(r => setTimeout(r, 40));
  expect(count).toBe(1);
});
test('only fires once when called rapidly', async () => {
  let count = 0;
  const inc = debounce(() => { count++; }, 50);
  inc(); inc(); inc();
  await new Promise(r => setTimeout(r, 100));
  expect(count).toBe(1);
});
test('fires again after wait expires', async () => {
  let count = 0;
  const inc = debounce(() => { count++; }, 30);
  inc();
  await new Promise(r => setTimeout(r, 60));
  inc();
  await new Promise(r => setTimeout(r, 60));
  expect(count).toBe(2);
});
