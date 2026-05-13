test('returns [2] for 2', () => {
  expect(primeFactors(2)).toEqual([2])
})
test('returns two distinct primes for 6', () => {
  expect(primeFactors(6)).toEqual([2, 3])
})
test('returns two distinct non-sequential primes for 10', () => {
  expect(primeFactors(10)).toEqual([2, 5])
})
test('returns repeated factors for 12', () => {
  expect(primeFactors(12)).toEqual([2, 2, 3])
})
test('handles a number with many factors', () => {
  expect(primeFactors(60)).toEqual([2, 2, 3, 5])
})
