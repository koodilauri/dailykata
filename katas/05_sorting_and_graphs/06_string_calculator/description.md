Write a function `add` that sums numbers in a string.

Rules:
1. Empty string returns 0.
2. Separators are commas or newlines.
3. A custom delimiter can be declared on the first line: `//;\n1;2` → 3
4. Negative numbers throw: `"negatives not allowed: -1, -3"`

Examples:
  add('')           // 0
  add('1')          // 1
  add('1,2')        // 3
  add('1\n2,3')     // 6
  add('//;\n1;2')   // 3
