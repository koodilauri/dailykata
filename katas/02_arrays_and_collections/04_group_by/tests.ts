test('groups numbers by divisibility', () => {
  const result = groupBy([1,2,3,4,5,6], n => n % 2 === 0 ? 'even' : 'odd');
  expect(result).toEqual({ even: [2,4,6], odd: [1,3,5] });
});
test('groups strings by length', () => {
  const result = groupBy(['a','bb','cc','ddd'], s => s.length);
  expect(result).toEqual({ 1: ['a'], 2: ['bb','cc'], 3: ['ddd'] });
});
test('handles empty array', () => {
  expect(groupBy([], x => x)).toEqual({});
});
