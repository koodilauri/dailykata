import ts from 'typescript'

export interface TestResult {
  name: string
  passed: boolean
  error?: string
}

type IframeMessage =
  | { type: 'test-results'; results: TestResult[] }
  | { type: 'error'; message: string }

export function transpile(tsCode: string): string {
  const result = ts.transpileModule(tsCode, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      strict: false
    }
  })
  return result.outputText
}

export function buildIframeDoc(userJs: string, testJs: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<script>
(function() {
  var results = [];

  function test(name, fn) {
    try {
      fn();
      results.push({ name: name, passed: true });
    } catch (e) {
      results.push({ name: name, passed: false, error: e.message || String(e) });
    }
  }

  function expect(actual) {
    return {
      toBe: function(expected) {
        if (actual !== expected) {
          throw new Error('Expected ' + JSON.stringify(expected) + ' but got ' + JSON.stringify(actual));
        }
      },
      toEqual: function(expected) {
        function deepEqual(a, b) {
          if (a === b) return true;
          if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
          if (Array.isArray(a) !== Array.isArray(b)) return false;
          var keysA = Object.keys(a), keysB = Object.keys(b);
          if (keysA.length !== keysB.length) return false;
          return keysA.every(function(k) { return Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]); });
        }
        if (!deepEqual(actual, expected)) {
          throw new Error('Expected ' + JSON.stringify(expected) + ' but got ' + JSON.stringify(actual));
        }
      },
      toBeTruthy: function() {
        if (!actual) throw new Error('Expected truthy value but got ' + JSON.stringify(actual));
      },
      toBeFalsy: function() {
        if (actual) throw new Error('Expected falsy value but got ' + JSON.stringify(actual));
      },
      toContain: function(item) {
        if (Array.isArray(actual)) {
          if (!actual.includes(item)) throw new Error('Expected array to contain ' + JSON.stringify(item));
        } else if (typeof actual === 'string') {
          if (!actual.includes(item)) throw new Error('Expected string to contain ' + JSON.stringify(item));
        } else {
          throw new Error('toContain requires array or string');
        }
      },
      toBeNull: function() {
        if (actual !== null) throw new Error('Expected null but got ' + JSON.stringify(actual));
      },
      toBeUndefined: function() {
        if (actual !== undefined) throw new Error('Expected undefined but got ' + JSON.stringify(actual));
      },
      toThrow: function() {
        if (typeof actual !== 'function') throw new Error('toThrow requires a function');
        try { actual(); throw new Error('Expected function to throw'); } catch(e) { if (e.message === 'Expected function to throw') throw e; }
      },
      not: {
        toBe: function(expected) {
          if (actual === expected) throw new Error('Expected value not to be ' + JSON.stringify(expected));
        },
        toEqual: function(expected) {
          function deepEqual(a, b) {
            if (a === b) return true;
            if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
            if (Array.isArray(a) !== Array.isArray(b)) return false;
            var keysA = Object.keys(a), keysB = Object.keys(b);
            if (keysA.length !== keysB.length) return false;
            return keysA.every(function(k) { return Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]); });
          }
          if (deepEqual(actual, expected)) throw new Error('Expected values not to be equal');
        },
        toBeTruthy: function() {
          if (actual) throw new Error('Expected falsy value but got ' + JSON.stringify(actual));
        },
        toBeFalsy: function() {
          if (!actual) throw new Error('Expected truthy value but got ' + JSON.stringify(actual));
        },
        toContain: function(item) {
          if (Array.isArray(actual)) {
            if (actual.includes(item)) throw new Error('Expected array not to contain ' + JSON.stringify(item));
          } else if (typeof actual === 'string') {
            if (actual.includes(item)) throw new Error('Expected string not to contain ' + JSON.stringify(item));
          }
        },
        toBeNull: function() {
          if (actual === null) throw new Error('Expected value not to be null');
        },
        toBeUndefined: function() {
          if (actual === undefined) throw new Error('Expected value not to be undefined');
        },
      },
    };
  }

  window.addEventListener('error', function(e) {
    window.parent.postMessage({ type: 'error', message: e.message || 'Runtime error' }, '*');
  });

  try {
    ${userJs}
  } catch (e) {
    window.parent.postMessage({ type: 'error', message: e.message || String(e) }, '*');
    return;
  }

  try {
    ${testJs}
  } catch (e) {
    window.parent.postMessage({ type: 'error', message: 'Test harness error: ' + (e.message || String(e)) }, '*');
    return;
  }

  window.parent.postMessage({ type: 'test-results', results: results }, '*');
})();
</script>
</body>
</html>`
}

export function runTests(tsCode: string, testCode: string): Promise<TestResult[]> {
  return new Promise((resolve, reject) => {
    let userJs: string
    try {
      userJs = transpile(tsCode)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      reject(new Error('Syntax error: ' + msg))
      return
    }

    const iframe = document.createElement('iframe')
    iframe.setAttribute('sandbox', 'allow-scripts')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('Timeout: tests took longer than 5 seconds (infinite loop?)'))
    }, 5000)

    function cleanup() {
      clearTimeout(timeout)
      window.removeEventListener('message', onMessage)
      iframe.remove()
    }

    function onMessage(event: MessageEvent) {
      if (event.source !== iframe.contentWindow) return
      const data = event.data as IframeMessage
      cleanup()
      if (data.type === 'test-results') {
        resolve(data.results)
      } else {
        reject(new Error(data.message))
      }
    }

    window.addEventListener('message', onMessage)
    iframe.srcdoc = buildIframeDoc(userJs, testCode)
  })
}
