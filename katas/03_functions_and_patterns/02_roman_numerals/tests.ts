test('converts 1 to I', () => {
  expect(toRoman(1)).toBe('I')
})
test('converts 4 to IV', () => {
  expect(toRoman(4)).toBe('IV')
})
test('converts 9 to IX', () => {
  expect(toRoman(9)).toBe('IX')
})
test('converts 14 to XIV', () => {
  expect(toRoman(14)).toBe('XIV')
})
test('converts 40 to XL', () => {
  expect(toRoman(40)).toBe('XL')
})
test('converts 1994 to MCMXCIV', () => {
  expect(toRoman(1994)).toBe('MCMXCIV')
})
