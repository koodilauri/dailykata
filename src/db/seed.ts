import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { kata } from './schema/kata'

const client = postgres(process.env.DATABASE_URL!, { prepare: false })
const db = drizzle(client)

const katas = [
  {
    title: 'Reverse a String',
    description: `Write a function \`reverseString\` that takes a string and returns it reversed.

Examples:
  reverseString("hello")  // "olleh"
  reverseString("world")  // "dlrow"
  reverseString("")        // ""`,
    starterCode: `function reverseString(str: string): string {
  // your code here
}`,
    tests: `test('reverses a simple string', () => {
  expect(reverseString('hello')).toBe('olleh');
});
test('reverses a single character', () => {
  expect(reverseString('a')).toBe('a');
});
test('handles empty string', () => {
  expect(reverseString('')).toBe('');
});
test('reverses a word with repeated chars', () => {
  expect(reverseString('racecar')).toBe('racecar');
});`,
    hints: [
      'Think about how you can split the string into individual characters.',
      'Arrays have a reverse() method.',
      "You can chain: split('').reverse().join('')"
    ],
    difficulty: 'easy' as const,
    order: 1,
    published: true
  },
  {
    title: 'FizzBuzz',
    description: `Write a function \`fizzBuzz\` that takes a number \`n\` and returns a string:
- "Fizz" if divisible by 3
- "Buzz" if divisible by 5
- "FizzBuzz" if divisible by both
- The number as a string otherwise

Examples:
  fizzBuzz(3)   // "Fizz"
  fizzBuzz(5)   // "Buzz"
  fizzBuzz(15)  // "FizzBuzz"
  fizzBuzz(7)   // "7"`,
    starterCode: `function fizzBuzz(n: number): string {
  // your code here
}`,
    tests: `test('returns "Fizz" for multiples of 3', () => {
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
});`,
    hints: [
      'Use the modulo operator (%) to check divisibility.',
      'Check divisibility by 15 first (or by both 3 and 5) before checking individually.',
      'Use String(n) or n.toString() to convert the number.'
    ],
    difficulty: 'easy' as const,
    order: 2,
    published: true
  },
  {
    title: 'Find the Largest Number',
    description: `Write a function \`findMax\` that takes an array of numbers and returns the largest one.

Examples:
  findMax([1, 3, 2])     // 3
  findMax([-1, -5, -2])  // -1
  findMax([42])           // 42`,
    starterCode: `function findMax(nums: number[]): number {
  // your code here
}`,
    tests: `test('finds the max in a positive array', () => {
  expect(findMax([1, 3, 2])).toBe(3);
});
test('finds the max in a negative array', () => {
  expect(findMax([-1, -5, -2])).toBe(-1);
});
test('handles a single element', () => {
  expect(findMax([42])).toBe(42);
});
test('handles duplicates', () => {
  expect(findMax([5, 5, 3])).toBe(5);
});
test('handles mixed positive and negative', () => {
  expect(findMax([-10, 0, 10])).toBe(10);
});`,
    hints: [
      'You could iterate through the array keeping track of the largest seen so far.',
      'Math.max() accepts individual arguments — how could you spread an array into it?',
      'Math.max(...nums) spreads the array as individual arguments.'
    ],
    difficulty: 'easy' as const,
    order: 3,
    published: true
  },
  {
    title: 'Check Palindrome',
    description: `Write a function \`isPalindrome\` that returns \`true\` if the string reads the same forwards and backwards, and \`false\` otherwise. Ignore case.

Examples:
  isPalindrome("racecar")  // true
  isPalindrome("hello")    // false
  isPalindrome("Madam")    // true`,
    starterCode: `function isPalindrome(str: string): boolean {
  // your code here
}`,
    tests: `test('detects a simple palindrome', () => {
  expect(isPalindrome('racecar')).toBeTruthy();
});
test('returns false for non-palindrome', () => {
  expect(isPalindrome('hello')).toBeFalsy();
});
test('is case-insensitive', () => {
  expect(isPalindrome('Madam')).toBeTruthy();
});
test('single character is always a palindrome', () => {
  expect(isPalindrome('a')).toBeTruthy();
});
test('empty string is a palindrome', () => {
  expect(isPalindrome('')).toBeTruthy();
});`,
    hints: [
      'Convert to lowercase first to handle case-insensitivity.',
      'You already know how to reverse a string from kata 1.',
      'Compare the original (lowercased) string to its reverse.'
    ],
    difficulty: 'easy' as const,
    order: 4,
    published: true
  },
  {
    title: 'Flatten One Level',
    description: `Write a function \`flattenOne\` that flattens an array one level deep — nested arrays are unwrapped, but only one level.

Examples:
  flattenOne([1, [2, 3], [4]])      // [1, 2, 3, 4]
  flattenOne([[1, [2]], [3]])        // [1, [2], 3]
  flattenOne([1, 2, 3])             // [1, 2, 3]`,
    starterCode: `function flattenOne(arr: unknown[]): unknown[] {
  // your code here
}`,
    tests: `test('flattens one level', () => {
  expect(flattenOne([1, [2, 3], [4]])).toEqual([1, 2, 3, 4]);
});
test('does not flatten deeper than one level', () => {
  expect(flattenOne([[1, [2]], [3]])).toEqual([1, [2], 3]);
});
test('handles already-flat array', () => {
  expect(flattenOne([1, 2, 3])).toEqual([1, 2, 3]);
});
test('handles empty array', () => {
  expect(flattenOne([])).toEqual([]);
});`,
    hints: [
      'Arrays have a flat() method that accepts a depth argument.',
      'You can also use reduce() with concat to merge nested arrays.',
      '[].concat(...arr) spreads nested arrays one level.'
    ],
    difficulty: 'medium' as const,
    order: 5,
    published: true
  }
]

async function seed() {
  console.log('Seeding katas…')
  await db.insert(kata).values(katas).onConflictDoNothing()
  console.log(`Inserted ${katas.length} katas.`)
  await client.end()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
