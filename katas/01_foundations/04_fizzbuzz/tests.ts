test('returns "Fizz" for multiples of 3', () => {
  expect(fizzBuzz(3)).toBe('Fizz');
  expect(fizzBuzz(9)).toBe('Fizz');
});
test('returns "Buzz" for multiples of 5', () => {
  expect(fizzBuzz(5)).toBe('Buzz');
  expect(fizzBuzz(20)).toBe('Buzz');
});
test('returns "FizzBuzz" for multiples of 15', () => {
  expect(fizzBuzz(15)).toBe('FizzBuzz');
  expect(fizzBuzz(30)).toBe('FizzBuzz');
});
test('returns the number as string otherwise', () => {
  expect(fizzBuzz(1)).toBe('1');
  expect(fizzBuzz(7)).toBe('7');
});
