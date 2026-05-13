Write a function `debounce` that delays invoking `fn` until after `wait` milliseconds have elapsed since the last call. Repeated calls within the window reset the timer.

Examples:
  const log = debounce((msg: string) => console.log(msg), 100)
  log('a')  // timer starts
  log('b')  // timer resets
  // after 100ms: logs 'b' (only the last call fires)
