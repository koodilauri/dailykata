Implement an `LRUCache` class:
- `constructor(capacity)` — fixed maximum number of entries
- `get(key)` — return the value, or -1 if not found; marks key as recently used
- `put(key, value)` — insert or update; if over capacity, evict the least recently used key

Examples:
  const cache = new LRUCache(2)
  cache.put(1, 1)
  cache.put(2, 2)
  cache.get(1)    // 1  (key 1 is now most recent)
  cache.put(3, 3) // evicts key 2
  cache.get(2)    // -1 (evicted)
  cache.get(3)    // 3
