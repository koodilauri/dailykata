Write a function `caesarCipher` that shifts each letter in a string by a fixed number of positions in the alphabet. Non-letter characters are left unchanged. The shift wraps around (z + 1 = a).

Examples:
  caesarCipher('abc', 1)    // 'bcd'
  caesarCipher('xyz', 2)    // 'zab'
  caesarCipher('Hello!', 3) // 'Khoor!'
  caesarCipher('bcd', -1)   // 'abc'
  caesarCipher('abc', 27)   // 'bcd'
