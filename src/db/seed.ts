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
  },
  {
    title: 'Sum of Digits',
    description: `Write a function \`sumDigits\` that takes a non-negative integer and returns the sum of its digits.

Examples:
  sumDigits(123)   // 6
  sumDigits(0)     // 0
  sumDigits(9999)  // 36`,
    starterCode: `function sumDigits(n: number): number {
  // your code here
}`,
    tests: `test('sums digits of 123', () => {
  expect(sumDigits(123)).toBe(6);
});
test('handles zero', () => {
  expect(sumDigits(0)).toBe(0);
});
test('handles single digit', () => {
  expect(sumDigits(7)).toBe(7);
});
test('sums digits of 9999', () => {
  expect(sumDigits(9999)).toBe(36);
});`,
    hints: [
      'Convert the number to a string to access each digit.',
      'Use split("") to get an array of digit characters.',
      'Parse each character back to a number with Number() or the unary + operator.'
    ],
    difficulty: 'easy' as const,
    order: 6,
    published: true
  },
  {
    title: 'Count Vowels',
    description: `Write a function \`countVowels\` that counts the number of vowels (a, e, i, o, u — case-insensitive) in a string.

Examples:
  countVowels("hello")   // 2
  countVowels("rhythm")  // 0
  countVowels("AEIOU")   // 5`,
    starterCode: `function countVowels(str: string): number {
  // your code here
}`,
    tests: `test('counts vowels in "hello"', () => {
  expect(countVowels('hello')).toBe(2);
});
test('returns 0 for no vowels', () => {
  expect(countVowels('rhythm')).toBe(0);
});
test('is case-insensitive', () => {
  expect(countVowels('AEIOU')).toBe(5);
});
test('handles empty string', () => {
  expect(countVowels('')).toBe(0);
});`,
    hints: [
      'Convert to lowercase first so you only need to check five characters.',
      'A regex like /[aeiou]/g can match all vowels at once.',
      'match() returns an array of matches (or null); check the length.'
    ],
    difficulty: 'easy' as const,
    order: 7,
    published: true
  },
  {
    title: 'Chunk Array',
    description: `Write a function \`chunk\` that splits an array into groups of a given size. The last chunk may be smaller if the array doesn't divide evenly.

Examples:
  chunk([1,2,3,4,5], 2)  // [[1,2],[3,4],[5]]
  chunk([1,2,3], 3)       // [[1,2,3]]
  chunk([], 2)             // []`,
    starterCode: `function chunk<T>(arr: T[], size: number): T[][] {
  // your code here
}`,
    tests: `test('chunks evenly', () => {
  expect(chunk([1,2,3,4], 2)).toEqual([[1,2],[3,4]]);
});
test('last chunk is smaller when uneven', () => {
  expect(chunk([1,2,3,4,5], 2)).toEqual([[1,2],[3,4],[5]]);
});
test('chunk size equals array length', () => {
  expect(chunk([1,2,3], 3)).toEqual([[1,2,3]]);
});
test('handles empty array', () => {
  expect(chunk([], 2)).toEqual([]);
});`,
    hints: [
      'Use a for loop with a step of `size` to slice the array at each position.',
      'Array.from({ length: Math.ceil(arr.length / size) }) can create the result skeleton.',
      'arr.slice(i, i + size) extracts each chunk.'
    ],
    difficulty: 'medium' as const,
    order: 8,
    published: true
  },
  {
    title: 'Binary Search',
    description: `Write a function \`binarySearch\` that searches for a \`target\` in a sorted array of numbers. Return the index of the target, or \`-1\` if not found.

Examples:
  binarySearch([1,3,5,7,9], 5)   // 2
  binarySearch([1,3,5,7,9], 6)   // -1
  binarySearch([2], 2)            // 0`,
    starterCode: `function binarySearch(arr: number[], target: number): number {
  // your code here
}`,
    tests: `test('finds element in the middle', () => {
  expect(binarySearch([1,3,5,7,9], 5)).toBe(2);
});
test('returns -1 when not found', () => {
  expect(binarySearch([1,3,5,7,9], 6)).toBe(-1);
});
test('finds first element', () => {
  expect(binarySearch([1,3,5,7,9], 1)).toBe(0);
});
test('finds last element', () => {
  expect(binarySearch([1,3,5,7,9], 9)).toBe(4);
});
test('single element array', () => {
  expect(binarySearch([2], 2)).toBe(0);
});`,
    hints: [
      'Maintain a left and right pointer that narrow the search range each iteration.',
      'Calculate mid as Math.floor((left + right) / 2).',
      'If arr[mid] < target, move left up; if arr[mid] > target, move right down.'
    ],
    difficulty: 'medium' as const,
    order: 9,
    published: true
  },
  {
    title: 'Group By',
    description: `Write a function \`groupBy\` that groups the elements of an array by the result of a key function.

Examples:
  groupBy([1,2,3,4,5,6], n => n % 3 === 0 ? 'divisible' : 'other')
  // { divisible: [3, 6], other: [1, 2, 4, 5] }

  groupBy(['one','two','three'], s => s.length)
  // { 3: ['one', 'two'], 5: ['three'] }`,
    starterCode: `function groupBy<T>(arr: T[], keyFn: (item: T) => string | number): Record<string, T[]> {
  // your code here
}`,
    tests: `test('groups numbers by divisibility', () => {
  const result = groupBy([1,2,3,4,5,6], n => n % 2 === 0 ? 'even' : 'odd');
  expect(result).toEqual({ even: [2,4,6], odd: [1,3,5] });
});
test('groups strings by length', () => {
  const result = groupBy(['a','bb','cc','ddd'], s => s.length);
  expect(result).toEqual({ 1: ['a'], 2: ['bb','cc'], 3: ['ddd'] });
});
test('handles empty array', () => {
  expect(groupBy([], x => x)).toEqual({});
});`,
    hints: [
      'Start with an empty object as the accumulator.',
      'For each item, compute the key and push the item into the matching bucket.',
      'Use reduce() or a simple for-of loop — both work well here.'
    ],
    difficulty: 'medium' as const,
    order: 10,
    published: true
  },
  {
    title: 'Deep Clone',
    description: `Write a function \`deepClone\` that creates a deep copy of a plain object or array (no functions, no circular refs, just nested objects and arrays).

Examples:
  const obj = { a: 1, b: { c: 2 } }
  const clone = deepClone(obj)
  clone.b.c = 99
  obj.b.c  // still 2`,
    starterCode: `function deepClone<T>(value: T): T {
  // your code here
}`,
    tests: `test('clones a flat object', () => {
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
});`,
    hints: [
      'Handle the base cases first: primitives can be returned as-is.',
      'Arrays and objects each need recursive cloning of their contents.',
      'JSON.parse(JSON.stringify(value)) is a one-liner that works for pure data.'
    ],
    difficulty: 'medium' as const,
    order: 11,
    published: true
  },
  {
    title: 'Memoize',
    description: `Write a function \`memoize\` that wraps another function and caches its results. When called with the same arguments again, it returns the cached result instead of re-computing.

Examples:
  let calls = 0
  const slow = memoize((n: number) => { calls++; return n * 2 })
  slow(5)  // 10, calls === 1
  slow(5)  // 10, calls still === 1 (cached)
  slow(6)  // 12, calls === 2`,
    starterCode: `function memoize<T extends unknown[], R>(fn: (...args: T) => R): (...args: T) => R {
  // your code here
}`,
    tests: `test('returns correct result', () => {
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
});`,
    hints: [
      'Store results in a Map or plain object keyed by the arguments.',
      'For a single-argument function, JSON.stringify(args) works as a cache key.',
      'Check if the key exists before calling the original function.'
    ],
    difficulty: 'hard' as const,
    order: 12,
    published: true
  },
  {
    title: 'Compose Functions',
    description: `Write a function \`compose\` that takes any number of functions and returns a new function that applies them from right to left.

Examples:
  const add1 = (x: number) => x + 1
  const double = (x: number) => x * 2
  const doubleThenAdd1 = compose(add1, double)
  doubleThenAdd1(3)  // 7  (double(3) = 6, add1(6) = 7)`,
    starterCode: `function compose<T>(...fns: Array<(x: T) => T>): (x: T) => T {
  // your code here
}`,
    tests: `test('applies two functions right to left', () => {
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
});`,
    hints: [
      'reduceRight is the natural fit — it iterates right to left.',
      'Start with the input value and thread it through each function.',
      'fns.reduceRight((acc, fn) => fn(acc), x) applies them right to left.'
    ],
    difficulty: 'hard' as const,
    order: 13,
    published: true
  },
  {
    title: 'Flatten Deep',
    description: `Write a function \`flattenDeep\` that fully flattens a nested array to any depth.

Examples:
  flattenDeep([1, [2, [3, [4]]]])  // [1, 2, 3, 4]
  flattenDeep([[1], [[2, [3]]]])   // [1, 2, 3]
  flattenDeep([1, 2, 3])           // [1, 2, 3]`,
    starterCode: `function flattenDeep(arr: unknown[]): unknown[] {
  // your code here
}`,
    tests: `test('flattens deeply nested array', () => {
  expect(flattenDeep([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4]);
});
test('flattens multiple levels', () => {
  expect(flattenDeep([[1], [[2, [3]]]])).toEqual([1, 2, 3]);
});
test('handles already-flat array', () => {
  expect(flattenDeep([1, 2, 3])).toEqual([1, 2, 3]);
});
test('handles empty array', () => {
  expect(flattenDeep([])).toEqual([]);
});`,
    hints: [
      'arr.flat(Infinity) flattens to any depth in one line.',
      "You can also use recursion: for each element, if it's an array recurse; otherwise push it.",
      'reduce() + concat + recursive calls is the manual approach.'
    ],
    difficulty: 'medium' as const,
    order: 14,
    published: true
  },
  {
    title: 'Debounce',
    description: `Write a function \`debounce\` that delays invoking \`fn\` until after \`wait\` milliseconds have elapsed since the last call. Repeated calls within the window reset the timer.

Examples:
  const log = debounce((msg: string) => console.log(msg), 100)
  log('a')  // timer starts
  log('b')  // timer resets
  // after 100ms: logs 'b' (only the last call fires)`,
    starterCode: `function debounce<T extends unknown[]>(fn: (...args: T) => void, wait: number): (...args: T) => void {
  // your code here
}`,
    tests: `test('calls fn after delay', async () => {
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
});`,
    hints: [
      'Store a timer reference (from setTimeout) in a closure variable.',
      'Each call clears the previous timer with clearTimeout before setting a new one.',
      'The returned function should capture the arguments and pass them to fn when the timer fires.'
    ],
    difficulty: 'hard' as const,
    order: 15,
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
