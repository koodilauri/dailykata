export interface DemoKata {
  id: string
  slug: string
  title: string
  description: string
  starterCode: string
  tests: string
  hints: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  order: number
  estimatedMinutes: number
  sectionId: null
}

export const DEMO_KATAS: DemoKata[] = [
  {
    id: 'demo-reverse',
    slug: 'reverse-a-string',
    title: 'Reverse a String',
    description:
      'Write a function that takes a string and returns it reversed.\n\nExample:\n  reverseString("hello") → "olleh"\n  reverseString("TypeScript") → "tpircSepyT"',
    starterCode: 'function reverseString(str: string): string {\n  // your code here\n}',
    tests: `\
test('reverses a simple string', () => {
  expect(reverseString('hello')).toBe('olleh')
})
test('reverses another string', () => {
  expect(reverseString('TypeScript')).toBe('tpircSepyT')
})
test('handles empty string', () => {
  expect(reverseString('')).toBe('')
})`,
    hints: [
      'Try converting the string to an array first.',
      'Arrays have a .reverse() method.',
      "Use .split('') to split, .reverse(), then .join('') to combine."
    ],
    difficulty: 'easy',
    order: 1,
    estimatedMinutes: 5,
    sectionId: null
  },
  {
    id: 'demo-palindrome',
    slug: 'check-palindrome',
    title: 'Check Palindrome',
    description:
      'Write a function that returns true if the given string is a palindrome (reads the same forwards and backwards), false otherwise.\n\nIgnore case.\n\nExample:\n  isPalindrome("racecar") → true\n  isPalindrome("hello") → false\n  isPalindrome("Madam") → true',
    starterCode: 'function isPalindrome(str: string): boolean {\n  // your code here\n}',
    tests: `\
test('detects a palindrome', () => {
  expect(isPalindrome('racecar')).toBe(true)
})
test('detects non-palindrome', () => {
  expect(isPalindrome('hello')).toBe(false)
})
test('is case-insensitive', () => {
  expect(isPalindrome('Madam')).toBe(true)
})
test('single char is a palindrome', () => {
  expect(isPalindrome('a')).toBe(true)
})`,
    hints: [
      'Lowercase the string first with .toLowerCase().',
      'Compare the string to its reverse.',
      'You already wrote a reverse function!'
    ],
    difficulty: 'easy',
    order: 2,
    estimatedMinutes: 5,
    sectionId: null
  },
  {
    id: 'demo-fizzbuzz',
    slug: 'fizzbuzz',
    title: 'FizzBuzz',
    description:
      'Write a function that takes a number n and returns an array of strings from 1 to n where:\n- Multiples of 3 are "Fizz"\n- Multiples of 5 are "Buzz"\n- Multiples of both are "FizzBuzz"\n- Everything else is the number as a string\n\nExample:\n  fizzBuzz(5) → ["1", "2", "Fizz", "4", "Buzz"]',
    starterCode: 'function fizzBuzz(n: number): string[] {\n  // your code here\n}',
    tests: `\
test('returns correct array for n=5', () => {
  expect(fizzBuzz(5)).toEqual(['1', '2', 'Fizz', '4', 'Buzz'])
})
test('handles FizzBuzz at 15', () => {
  expect(fizzBuzz(15)[14]).toBe('FizzBuzz')
})
test('handles single element', () => {
  expect(fizzBuzz(1)).toEqual(['1'])
})`,
    hints: [
      'Use a loop from 1 to n.',
      'Check divisibility with the % (modulo) operator.',
      'Check for FizzBuzz (divisible by both) before checking Fizz or Buzz separately.'
    ],
    difficulty: 'easy',
    order: 3,
    estimatedMinutes: 10,
    sectionId: null
  }
]
