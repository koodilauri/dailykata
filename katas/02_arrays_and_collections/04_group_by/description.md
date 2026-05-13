Write a function `groupBy` that groups the elements of an array by the result of a key function.

Examples:
  groupBy([1,2,3,4,5,6], n => n % 3 === 0 ? 'divisible' : 'other')
  // { divisible: [3, 6], other: [1, 2, 4, 5] }

  groupBy(['one','two','three'], s => s.length)
  // { 3: ['one', 'two'], 5: ['three'] }
