/**
 * The JavaScript test harness.
 *
 * This source is injected ahead of the learner's code inside the sandbox
 * worker. It gives lessons a small, deliberately Jest-shaped API —
 * `test()` and `expect()` — so that what learners practise here is the same
 * thing they will type on the job.
 *
 * Tests are queued rather than run inline, which means an async test body
 * (`test('...', async () => { await ... })`) works exactly as it would in a
 * real runner.
 */
export const JS_TEST_HARNESS = String.raw`
const __queue = [];

function __fmt(v, depth) {
  depth = depth || 0;
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return depth === 0 ? JSON.stringify(v) : JSON.stringify(v);
  if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint') return String(v);
  if (typeof v === 'function') return 'function ' + (v.name || '(anonymous)');
  if (typeof v === 'symbol') return v.toString();
  if (v instanceof Error) return v.name + ': ' + v.message;
  if (v instanceof Date) return v.toISOString();
  if (v instanceof Map) return 'Map(' + v.size + ') {' + [...v.entries()].map(function (e) { return __fmt(e[0], depth + 1) + ' => ' + __fmt(e[1], depth + 1); }).join(', ') + '}';
  if (v instanceof Set) return 'Set(' + v.size + ') {' + [...v].map(function (x) { return __fmt(x, depth + 1); }).join(', ') + '}';
  if (depth > 3) return '…';
  if (Array.isArray(v)) return '[' + v.map(function (x) { return __fmt(x, depth + 1); }).join(', ') + ']';
  if (typeof v === 'object') {
    var keys = Object.keys(v);
    if (keys.length === 0) return '{}';
    return '{ ' + keys.map(function (k) { return k + ': ' + __fmt(v[k], depth + 1); }).join(', ') + ' }';
  }
  return String(v);
}

function __deepEq(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;
  if (typeof a !== 'object') return false;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const x of a) if (!b.has(x)) return false;
    return true;
  }
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, v] of a) { if (!b.has(k) || !__deepEq(v, b.get(k))) return false; }
    return true;
  }
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every(function (k) { return Object.prototype.hasOwnProperty.call(b, k) && __deepEq(a[k], b[k]); });
}

function __fail(msg) {
  const e = new Error(msg);
  e.name = 'AssertionError';
  throw e;
}

function __matchers(actual, negated) {
  const flip = function (pass, msg, negMsg) {
    if (negated ? pass : !pass) __fail(negated ? negMsg : msg);
  };
  const api = {
    toBe: function (expected) {
      flip(Object.is(actual, expected),
        'Expected ' + __fmt(expected) + ' but got ' + __fmt(actual),
        'Expected value NOT to be ' + __fmt(expected));
      return api;
    },
    toEqual: function (expected) {
      flip(__deepEq(actual, expected),
        'Expected ' + __fmt(expected) + ' but got ' + __fmt(actual),
        'Expected value NOT to equal ' + __fmt(expected));
      return api;
    },
    toBeCloseTo: function (expected, digits) {
      const d = digits === undefined ? 2 : digits;
      flip(Math.abs(actual - expected) < Math.pow(10, -d) / 2,
        'Expected ' + __fmt(actual) + ' to be close to ' + __fmt(expected),
        'Expected ' + __fmt(actual) + ' NOT to be close to ' + __fmt(expected));
      return api;
    },
    toBeTruthy: function () {
      flip(!!actual, 'Expected a truthy value but got ' + __fmt(actual), 'Expected a falsy value but got ' + __fmt(actual));
      return api;
    },
    toBeFalsy: function () {
      flip(!actual, 'Expected a falsy value but got ' + __fmt(actual), 'Expected a truthy value but got ' + __fmt(actual));
      return api;
    },
    toBeNull: function () {
      flip(actual === null, 'Expected null but got ' + __fmt(actual), 'Expected NOT null');
      return api;
    },
    toBeUndefined: function () {
      flip(actual === undefined, 'Expected undefined but got ' + __fmt(actual), 'Expected NOT undefined');
      return api;
    },
    toBeDefined: function () {
      flip(actual !== undefined, 'Expected a value but got undefined', 'Expected undefined');
      return api;
    },
    toContain: function (item) {
      var has = typeof actual === 'string'
        ? actual.indexOf(item) !== -1
        : Array.isArray(actual) && actual.some(function (x) { return __deepEq(x, item); });
      flip(has,
        'Expected ' + __fmt(actual) + ' to contain ' + __fmt(item),
        'Expected ' + __fmt(actual) + ' NOT to contain ' + __fmt(item));
      return api;
    },
    toHaveLength: function (n) {
      var len = actual == null ? undefined : actual.length;
      flip(len === n,
        'Expected length ' + n + ' but got ' + __fmt(len),
        'Expected length NOT to be ' + n);
      return api;
    },
    toHaveProperty: function (key, value) {
      var has = actual != null && Object.prototype.hasOwnProperty.call(actual, key);
      var ok = has && (arguments.length < 2 || __deepEq(actual[key], value));
      flip(ok,
        'Expected object to have property ' + __fmt(key) + (arguments.length > 1 ? ' equal to ' + __fmt(value) : '') + ', got ' + __fmt(actual),
        'Expected object NOT to have property ' + __fmt(key));
      return api;
    },
    toBeGreaterThan: function (n) {
      flip(actual > n, 'Expected ' + __fmt(actual) + ' to be greater than ' + __fmt(n), 'Expected ' + __fmt(actual) + ' NOT to be greater than ' + __fmt(n));
      return api;
    },
    toBeLessThan: function (n) {
      flip(actual < n, 'Expected ' + __fmt(actual) + ' to be less than ' + __fmt(n), 'Expected ' + __fmt(actual) + ' NOT to be less than ' + __fmt(n));
      return api;
    },
    toBeInstanceOf: function (ctor) {
      flip(actual instanceof ctor,
        'Expected an instance of ' + (ctor && ctor.name) + ' but got ' + __fmt(actual),
        'Expected NOT to be an instance of ' + (ctor && ctor.name));
      return api;
    },
    toBeTypeOf: function (t) {
      flip(typeof actual === t, 'Expected typeof to be ' + t + ' but got ' + typeof actual, 'Expected typeof NOT to be ' + t);
      return api;
    },
    toThrow: function (expected) {
      if (typeof actual !== 'function') __fail('expect(...).toThrow() needs a function, e.g. expect(() => risky()).toThrow()');
      var threw = false, err = null;
      try { actual(); } catch (e) { threw = true; err = e; }
      if (!negated) {
        if (!threw) __fail('Expected the function to throw, but it returned normally');
        if (expected !== undefined) {
          var msg = (err && err.message) || String(err);
          if (msg.indexOf(expected) === -1) __fail('Expected the error message to contain ' + __fmt(expected) + ' but got ' + __fmt(msg));
        }
      } else if (threw) {
        __fail('Expected the function NOT to throw, but it threw ' + __fmt(err));
      }
      return api;
    },
  };
  return api;
}

function expect(actual) {
  const api = __matchers(actual, false);
  api.not = __matchers(actual, true);
  return api;
}

function test(name, fn) { __queue.push({ name: String(name), fn: fn }); }
const it = test;

async function __run() {
  for (const t of __queue) {
    try {
      await t.fn();
      __results.push({ name: t.name, passed: true });
    } catch (e) {
      var m = e && e.message ? e.message : String(e);
      if (e && e.name && e.name !== 'AssertionError' && e.name !== 'Error') m = e.name + ': ' + m;
      __results.push({ name: t.name, passed: false, message: m });
    }
  }
}
`;

/**
 * The Python test harness. Mirrors the JS one but in Python's idiom:
 * plain assert_* functions, which compose well with `lambda`.
 */
export const PY_TEST_HARNESS = String.raw`
import json as __json

__results = []

class AssertionFail(Exception):
    pass

def __fmt(v):
    return repr(v)

def assert_equal(actual, expected, msg=None):
    if actual != expected:
        raise AssertionFail(msg or ("Expected " + __fmt(expected) + " but got " + __fmt(actual)))

def assert_not_equal(actual, expected, msg=None):
    if actual == expected:
        raise AssertionFail(msg or ("Expected something other than " + __fmt(expected)))

def assert_true(value, msg=None):
    if not value:
        raise AssertionFail(msg or ("Expected a truthy value but got " + __fmt(value)))

def assert_false(value, msg=None):
    if value:
        raise AssertionFail(msg or ("Expected a falsy value but got " + __fmt(value)))

def assert_close(actual, expected, places=2, msg=None):
    if abs(actual - expected) >= 10 ** -places / 2:
        raise AssertionFail(msg or ("Expected " + __fmt(actual) + " to be close to " + __fmt(expected)))

def assert_in(item, container, msg=None):
    if item not in container:
        raise AssertionFail(msg or ("Expected " + __fmt(container) + " to contain " + __fmt(item)))

def assert_length(container, n, msg=None):
    actual = len(container)
    if actual != n:
        raise AssertionFail(msg or ("Expected length " + str(n) + " but got " + str(actual)))

def assert_raises(fn, exc=Exception, msg=None):
    try:
        fn()
    except exc:
        return
    except Exception as e:
        raise AssertionFail("Expected " + exc.__name__ + " but got " + type(e).__name__ + ": " + str(e))
    raise AssertionFail(msg or ("Expected " + exc.__name__ + " to be raised, but nothing was"))

def test(name, fn):
    try:
        fn()
        __results.append({"name": str(name), "passed": True})
    except AssertionFail as e:
        __results.append({"name": str(name), "passed": False, "message": str(e)})
    except Exception as e:
        __results.append({"name": str(name), "passed": False, "message": type(e).__name__ + ": " + str(e)})
`;

/** Marker line the Python runner uses to lift test results out of stdout. */
export const PY_RESULT_MARKER = '__CODELAB_TESTS__';

export const PY_TEST_FOOTER = `
print("${PY_RESULT_MARKER}" + __json.dumps(__results))
`;
