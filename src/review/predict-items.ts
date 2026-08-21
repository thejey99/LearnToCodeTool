import type { Language } from '../types';

export interface PredictDraft {
  id: string;
  /** Only served once this lesson is complete. */
  lessonId: string;
  language: Language;
  concepts: string[];
  code: string;
  /** Exactly what the snippet prints, line by line. Verified by the validator,
   *  which executes every one of these through the real runner. */
  expected: string[];
  explanation: string;
}

/**
 * Recall items: read a snippet, type what it prints.
 *
 * Every one targets something that is *easy to nod along to and hard to
 * reproduce* — the cases where recognition and recall come apart. Snippets
 * deliberately print scalars or joined strings rather than arrays or objects,
 * so there is never any doubt about how to type the answer.
 */
export const PREDICT_DRAFTS: PredictDraft[] = [
  // ── Foundations ──────────────────────────────────────────
  {
    id: 'p-js-plus',
    lessonId: 'js-03-numbers-strings',
    language: 'javascript',
    concepts: ['types', 'concatenation', 'operators'],
    code: `console.log(2 + 3);
console.log("2" + 3);
console.log("10" - 3);`,
    expected: ['5', '23', '7'],
    explanation:
      '`+` adds numbers but glues strings, and a string on either side wins — so "2" + 3 is "23". `-` has no string meaning at all, so JavaScript converts and "10" - 3 is 7. That asymmetry is why "+" is the operator that bites.',
  },
  {
    id: 'p-js-compound',
    lessonId: 'js-06-reassignment',
    language: 'javascript',
    concepts: ['reassignment', 'compound-operators'],
    code: `let n = 5;
n += 3;
n *= 2;
n -= 1;
console.log(n);`,
    expected: ['15'],
    explanation:
      'Left to right: 5 + 3 = 8, then 8 × 2 = 16, then 16 − 1 = 15. Each compound operator reads the current value, applies the operation and stores the result back.',
  },
  {
    id: 'p-js-equality',
    lessonId: 'js-07-booleans',
    language: 'javascript',
    concepts: ['strict-equality', 'coercion', 'booleans'],
    code: `console.log(10 === "10");
console.log(10 == "10");
console.log(null == undefined);
console.log(null === undefined);`,
    expected: ['false', 'true', 'true', 'false'],
    explanation:
      '`===` compares type as well as value; `==` converts first, which is why 10 == "10" is true. The one `==` case people rely on deliberately is null == undefined. Use `===` everywhere and check for null explicitly.',
  },
  {
    id: 'p-js-loop-bounds',
    lessonId: 'js-09-loops',
    language: 'javascript',
    concepts: ['for-loop', 'off-by-one'],
    code: `let out = "";
for (let i = 0; i < 3; i++) {
  out += i;
}
console.log(out);`,
    expected: ['012'],
    explanation:
      'Starts at 0 and stops *before* 3, so it runs for 0, 1 and 2 — three passes. Reading `i < 3` as "three times, starting at zero" is the habit that prevents off-by-one errors.',
  },
  {
    id: 'p-js-array-hole',
    lessonId: 'js-12-arrays',
    language: 'javascript',
    concepts: ['arrays', 'length', 'undefined'],
    code: `const rates = [199, 219, 249];
console.log(rates.length);
console.log(rates[3]);`,
    expected: ['3', 'undefined'],
    explanation:
      'Three items means valid indexes 0, 1 and 2. Reading past the end does not throw — it quietly gives `undefined`, which is why the crash usually happens somewhere later when something tries to use that value.',
  },

  // ── JavaScript in Depth ──────────────────────────────────
  {
    id: 'p-jsd-shadow',
    lessonId: 'jsd-01-scope',
    language: 'javascript',
    concepts: ['scope', 'shadowing', 'block-scope'],
    code: `const rate = 100;
{
  const rate = 200;
  console.log(rate);
}
console.log(rate);`,
    expected: ['200', '100'],
    explanation:
      'The inner `const` creates a second, separate variable that hides the outer one for the length of the block. Shadowing never modifies the outer variable — once the block ends, the original is untouched.',
  },
  {
    id: 'p-jsd-closure',
    lessonId: 'jsd-02-closures',
    language: 'javascript',
    concepts: ['closures', 'state'],
    code: `function makeCounter() {
  let count = 0;
  return () => ++count;
}
const a = makeCounter();
const b = makeCounter();
a(); a();
console.log(a());
console.log(b());`,
    expected: ['3', '1'],
    explanation:
      'Every call to makeCounter creates a fresh `count`, so the two counters share nothing. This is the question interviewers use to check whether you understand closures or have just memorised the word.',
  },
  {
    id: 'p-jsd-map-pure',
    lessonId: 'jsd-04-map',
    language: 'javascript',
    concepts: ['map', 'immutability'],
    code: `const prices = [10, 20];
const doubled = prices.map((p) => p * 2);
console.log(doubled.join(","));
console.log(prices.join(","));`,
    expected: ['20,40', '10,20'],
    explanation:
      '`map` builds a new array and leaves the original alone. That is the whole reason it is preferred over a loop that pushes: the input you were handed is still the input you were handed.',
  },
  {
    id: 'p-jsd-find-miss',
    lessonId: 'jsd-05-filter',
    language: 'javascript',
    concepts: ['find', 'filter', 'undefined'],
    code: `const rooms = [{ num: 101 }, { num: 102 }];
console.log(rooms.filter((r) => r.num === 999).length);
console.log(rooms.find((r) => r.num === 999));`,
    expected: ['0', 'undefined'],
    explanation:
      '`filter` always returns an array — empty when nothing matches. `find` returns the item itself, or `undefined` on a miss. That undefined is the leading cause of "cannot read property of undefined" one line later.',
  },
  {
    id: 'p-jsd-sort-default',
    lessonId: 'jsd-08-sorting',
    language: 'javascript',
    concepts: ['sort', 'comparators'],
    code: `const nums = [10, 9, 100, 1];
console.log([...nums].sort().join(","));
console.log([...nums].sort((a, b) => a - b).join(","));`,
    expected: ['1,10,100,9', '1,9,10,100'],
    explanation:
      'With no comparator, `sort` converts every item to a string, and "10" really does come before "9" alphabetically. Numbers always need `(a, b) => a - b`. Note the spread: `sort` mutates, so both lines copy first.',
  },
  {
    id: 'p-jsd-reference',
    lessonId: 'jsd-09-references',
    language: 'javascript',
    concepts: ['references', 'mutation'],
    code: `const a = { count: 1 };
const b = a;
b.count = 99;
console.log(a.count);
console.log(a === b);
console.log({ x: 1 } === { x: 1 });`,
    expected: ['99', 'true', 'false'],
    explanation:
      'Objects are held by reference: `b = a` makes a second name for one object, not a copy. And `===` on objects compares identity, so two separately-built objects with identical contents are never equal.',
  },
  {
    id: 'p-jsd-shallow',
    lessonId: 'jsd-09-references',
    language: 'javascript',
    concepts: ['references', 'copying', 'spread'],
    code: `const original = { name: "x", tags: ["red"] };
const copy = { ...original };
copy.name = "y";
copy.tags.push("blue");
console.log(original.name);
console.log(original.tags.join(","));`,
    expected: ['x', 'red,blue'],
    explanation:
      'Spread copies one level deep. The top-level `name` is genuinely separate, but both objects still point at the same `tags` array — so pushing through the copy is visible through the original. This is the bug people mean by "shallow copy".',
  },
  {
    id: 'p-jsd-default-null',
    lessonId: 'jsd-10-destructuring',
    language: 'javascript',
    concepts: ['destructuring', 'default-values'],
    code: `function show({ nights = 1 }) {
  return nights;
}
console.log(show({}));
console.log(show({ nights: undefined }));
console.log(show({ nights: null }));`,
    expected: ['1', '1', 'null'],
    explanation:
      'A destructuring default fires only for `undefined`, never for `null`. An API that sends an explicit null therefore slips straight past your default — which is exactly the same rule as `??`, and a very common source of surprise.',
  },
  {
    id: 'p-jsd-nullish',
    lessonId: 'jsd-12-nullish',
    language: 'javascript',
    concepts: ['nullish-coalescing', 'truthiness'],
    code: `console.log(0 || 10);
console.log(0 ?? 10);
console.log(JSON.stringify("" || "fallback"));
console.log(JSON.stringify("" ?? "fallback"));`,
    expected: ['10', '0', '"fallback"', '""'],
    explanation:
      '`||` falls back on any falsy value, so a legitimate 0 or empty string gets replaced. `??` only falls back on null and undefined — the last line keeps the empty string intact. Whenever zero or "" is a real value, `||` will corrupt it. (The JSON.stringify is only there to make the empty string visible.)',
  },
  {
    id: 'p-jsd-finally',
    lessonId: 'jsd-14-errors',
    language: 'javascript',
    concepts: ['errors', 'try-catch'],
    code: `function risky() {
  try {
    throw new Error("boom");
  } catch (err) {
    console.log("caught " + err.message);
    return "from catch";
  } finally {
    console.log("finally");
  }
}
console.log(risky());`,
    expected: ['caught boom', 'finally', 'from catch'],
    explanation:
      '`finally` runs before the function actually returns, even though the `return` was already evaluated in the catch block. That is what makes it reliable for cleanup — it cannot be skipped by a return or a throw.',
  },
  {
    id: 'p-jsd-json-lossy',
    lessonId: 'jsd-15-json',
    language: 'javascript',
    concepts: ['json', 'serialisation'],
    code: `const data = { a: undefined, b: () => 1, c: 3, d: null };
console.log(JSON.stringify(data));
console.log(typeof JSON.parse(JSON.stringify({ when: new Date(0) })).when);`,
    expected: ['{"c":3,"d":null}', 'string'],
    explanation:
      '`undefined` and functions vanish silently from JSON; `null` survives. And a Date becomes an ISO string on the way out and stays a string on the way back — round-tripping through JSON is lossy, which is why "why is my date a string?" is such a common question.',
  },

  // ── Async ────────────────────────────────────────────────
  {
    id: 'p-as-event-loop',
    lessonId: 'as-01-event-loop',
    language: 'javascript',
    concepts: ['event-loop', 'microtasks', 'setTimeout'],
    code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`,
    expected: ['A', 'D', 'C', 'B'],
    explanation:
      'Synchronous code finishes first (A, D). Then the microtask queue drains completely (C), and only then does the timer callback run (B). A zero-millisecond timeout means "after everything currently queued", not "now".',
  },
  {
    id: 'p-as-async-returns',
    lessonId: 'as-03-async-await',
    language: 'javascript',
    concepts: ['async-await', 'promises'],
    code: `async function five() {
  return 5;
}
console.log(typeof five());
console.log(five() instanceof Promise);
console.log(await five());`,
    expected: ['object', 'true', '5'],
    explanation:
      'An async function always returns a promise, whatever you return inside it. There is no way to get a synchronous value out of one — which is why async is contagious and every caller must await it or handle the promise.',
  },
  {
    id: 'p-as-all-order',
    lessonId: 'as-04-parallel',
    language: 'javascript',
    concepts: ['promise-all', 'concurrency'],
    code: `const slow = (v, ms) => new Promise((r) => setTimeout(() => r(v), ms));
const results = await Promise.all([slow("a", 30), slow("b", 5), slow("c", 15)]);
console.log(results.join(","));`,
    expected: ['a,b,c'],
    explanation:
      '`Promise.all` resolves to the values in the order you passed them in, not the order they finished. The whole set takes about as long as the slowest one, because they run at the same time.',
  },

  // ── TypeScript ───────────────────────────────────────────
  {
    id: 'p-ts-erasure',
    lessonId: 'ts-14-erasure',
    language: 'typescript',
    concepts: ['type-erasure', 'runtime'],
    code: `interface User {
  id: number;
}
const value: User = { id: 1 };
console.log(typeof value);
console.log(JSON.stringify(value));`,
    expected: ['object', '{"id":1}'],
    explanation:
      'The interface is gone by the time this runs — it leaves no trace in the output. That is why there is no `instanceof User`, and why data arriving from outside your program needs a real runtime check rather than a type annotation.',
  },
  {
    id: 'p-ts-narrowing',
    lessonId: 'ts-08-narrowing',
    language: 'typescript',
    concepts: ['narrowing', 'typeof'],
    code: `function describe(value: string | number): string {
  if (typeof value === "number") return "n:" + value.toFixed(1);
  return "s:" + value.toUpperCase();
}
console.log(describe(3));
console.log(describe("hi"));
console.log(typeof null);`,
    expected: ['n:3.0', 's:HI', 'object'],
    explanation:
      'Narrowing by `typeof` lets each branch use the methods of that type. The last line is the 1995 bug that can never be fixed: `typeof null` is "object", so a typeof check never rules null out — you need `value !== null` explicitly.',
  },

  // ── Algorithms ───────────────────────────────────────────
  {
    id: 'p-dsa-set-vs-array',
    lessonId: 'dsa-01-bigo',
    language: 'javascript',
    concepts: ['big-o', 'sets', 'lookup'],
    code: `const seen = new Set();
const items = [1, 2, 2, 3, 1];
let firstDupe = null;
for (const item of items) {
  if (seen.has(item)) { firstDupe = item; break; }
  seen.add(item);
}
console.log(firstDupe);
console.log(seen.size);`,
    expected: ['2', '2'],
    explanation:
      'The loop stops the first time it meets something already seen, so only 1 and 2 ever get added. Swapping an array scan for a Set is what turns the O(n²) duplicate check into O(n) — the most common real-world optimisation there is.',
  },
  {
    id: 'p-dsa-recursion',
    lessonId: 'dsa-06-recursion',
    language: 'javascript',
    concepts: ['recursion', 'base-case'],
    code: `function countdown(n) {
  if (n === 0) return "go";
  console.log(n);
  return countdown(n - 1);
}
console.log(countdown(3));`,
    expected: ['3', '2', '1', 'go'],
    explanation:
      'Each call prints then recurses, so the numbers appear on the way down. The base case returns "go", and because every level returns that same value straight up the chain, it is what finally gets printed.',
  },
  {
    id: 'p-dsa-binary-mid',
    lessonId: 'dsa-07-binary-search',
    language: 'javascript',
    concepts: ['binary-search', 'off-by-one'],
    code: `const sorted = [1, 3, 5, 7, 9];
let lo = 0, hi = sorted.length - 1, steps = 0;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  steps++;
  if (sorted[mid] === 9) break;
  if (sorted[mid] < 9) lo = mid + 1;
  else hi = mid - 1;
}
console.log(steps);`,
    expected: ['3'],
    explanation:
      'Three comparisons. mid is index 2 (value 5), too small, so lo becomes 3; mid is index 3 (value 7), still too small, lo becomes 4; mid is index 4 (value 9), found. Five items take at most three steps because each one halves what is left — that is what log n means in practice.',
  },
  {
    id: 'p-dsa-memo',
    lessonId: 'dsa-11-dynamic-programming',
    language: 'javascript',
    concepts: ['memoisation', 'dynamic-programming'],
    code: `let calls = 0;
function fib(n, memo = new Map()) {
  calls++;
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}
console.log(fib(10));
console.log(calls < 40);`,
    expected: ['55', 'true'],
    explanation:
      'Memoised, each value is computed once, so fib(10) costs a couple of dozen calls. Without the cache the same call tree is exponential — fib(40) alone makes over 300 million calls. Three added lines change the complexity class.',
  },

  // ── Python ───────────────────────────────────────────────
  {
    id: 'p-py-division',
    lessonId: 'py-03-fstrings',
    language: 'python',
    concepts: ['division', 'types'],
    code: `print(10 / 2)
print(10 // 3)
print(10 % 3)
print(2 ** 10)`,
    expected: ['5.0', '3', '1', '1024'],
    explanation:
      'Python\'s `/` always produces a float, so 10 / 2 is 5.0 rather than 5. `//` is integer division and `%` the remainder. Coming from JavaScript, that trailing .0 is the surprise.',
  },
  {
    id: 'p-py-range',
    lessonId: 'py-05-lists',
    language: 'python',
    concepts: ['range', 'lists', 'len'],
    code: `nums = [10, 20, 30]
print(len(nums))
print(sum(range(1, 4)))
print(list(range(3))[-1])`,
    expected: ['3', '6', '2'],
    explanation:
      '`range` excludes its end, so range(1, 4) is 1, 2, 3 and sums to 6, and range(3) is 0, 1, 2 whose last item is 2. The same start-included, stop-excluded rule as slicing.',
  },
  {
    id: 'p-py-comprehension',
    lessonId: 'py-10-comprehensions',
    language: 'python',
    concepts: ['comprehensions', 'filtering'],
    code: `nums = [1, 2, 3, 4, 5, 6]
print(sum([n * n for n in nums if n % 2 == 0]))
print(len({n % 3 for n in nums}))`,
    expected: ['56', '3'],
    explanation:
      'The first keeps the even numbers, squares them (4 + 16 + 36) and sums to 56. The second builds a *set* of remainders — braces with no colon — and 1 through 6 mod 3 gives {0, 1, 2}, so three distinct values.',
  },
  {
    id: 'p-py-slicing',
    lessonId: 'py-11-slicing',
    language: 'python',
    concepts: ['slicing', 'negative-indices'],
    code: `s = "programming"
print(s[:4])
print(s[-4:])
print(s[::-1][:3])
print(repr(s[100:200]))`,
    expected: ['prog', 'ming', 'gni', "''"],
    explanation:
      'Negative indices count from the right, and `[::-1]` reverses. The last line is the important one: slicing past the end returns an empty string rather than raising, where plain indexing would be an IndexError. (The repr is only there to make that empty string visible.)',
  },
  {
    id: 'p-py-unpacking',
    lessonId: 'py-12-unpacking',
    language: 'python',
    concepts: ['unpacking', 'tuples'],
    code: `first, *rest = [1, 2, 3, 4]
print(first)
print(len(rest))
a, b = 1, 2
a, b = b, a
print(a, b)`,
    expected: ['1', '3', '2 1'],
    explanation:
      'The star collects everything left over — always as a list. And the swap works because the right-hand side is fully evaluated into a tuple before anything is assigned, so no temporary variable is needed.',
  },
  {
    id: 'p-py-dict-get',
    lessonId: 'py-13-dict-tools',
    language: 'python',
    concepts: ['dictionaries', 'get', 'counting'],
    code: `counts = {}
for word in "a b a c a".split():
    counts[word] = counts.get(word, 0) + 1
print(counts["a"])
print(counts.get("z", 0))
print(len(counts))`,
    expected: ['3', '0', '3'],
    explanation:
      '`.get(key, default)` returns the default instead of raising KeyError, which is what makes the one-line counting idiom work on a word that has not been seen before.',
  },
  {
    id: 'p-py-mutable-default',
    lessonId: 'py-21-quiz',
    language: 'python',
    concepts: ['mutable-defaults', 'gotchas'],
    code: `def add(item, items=[]):
    items.append(item)
    return items

print(len(add("a")))
print(len(add("b")))`,
    expected: ['1', '2'],
    explanation:
      'The default list is created once, when the function is *defined*, and shared by every call that omits the argument — so the second call sees the first call\'s item. The fix is `items=None` with `if items is None: items = []` inside.',
  },
  {
    id: 'p-py-generator-once',
    lessonId: 'py-17-generators',
    language: 'python',
    concepts: ['generators', 'laziness'],
    code: `def squares(n):
    for i in range(n):
        yield i * i

g = squares(4)
print(sum(g))
print(sum(g))
print(sum(squares(4)))`,
    expected: ['14', '0', '14'],
    explanation:
      'A generator is single use. The first sum consumes it (0 + 1 + 4 + 9); the second finds it already exhausted and sums to 0. Calling the function again makes a fresh one. If you need the values twice, you need a list.',
  },
  {
    id: 'p-py-exception-else',
    lessonId: 'py-14-exceptions',
    language: 'python',
    concepts: ['exceptions', 'eafp'],
    code: `def parse(text):
    try:
        value = int(text)
    except ValueError:
        print("bad")
        return -1
    else:
        print("ok")
        return value
    finally:
        print("done")

print(parse("42"))
print(parse("x"))`,
    expected: ['ok', 'done', '42', 'bad', 'done', '-1'],
    explanation:
      '`else` runs only when nothing was raised, and `finally` runs either way — before the return value is actually handed back. Putting the success path in `else` keeps it out of the `try`, where its own errors would be caught by mistake.',
  },
  {
    id: 'p-py-aliasing',
    lessonId: 'py-05-lists',
    language: 'python',
    concepts: ['references', 'mutation', 'copying'],
    code: `a = [1, 2]
b = a
c = a[:]
b.append(3)
c.append(99)
print(len(a))
print(a is b)
print(a is c)`,
    expected: ['3', 'True', 'False'],
    explanation:
      'Assignment binds a second name to the same list, so appending through `b` is visible through `a`. `a[:]` makes a real (shallow) copy. `is` asks whether two names point at the same object — never use it for value comparison.',
  },
];
