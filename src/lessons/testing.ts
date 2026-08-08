import type { LessonDraft } from '../types';

export const TESTING_LESSONS: LessonDraft[] = [
  {
    id: 'test-01-first-test',
    title: 'What a Test Actually Is',
    language: 'javascript',
    module: 'Fundamentals',
    difficulty: 2,
    concepts: ['unit-tests', 'assertions', 'arrange-act-assert'],
    instructions: `You have been graded by tests for several lessons now. Time to write them.

A unit test is not a special kind of program. It is an ordinary function that runs your code and complains if the answer is wrong:

\`\`\`js
function expectEqual(actual, expected) {
  if (actual !== expected) throw new Error(\`Expected \${expected}, got \${actual}\`);
}
\`\`\`

That is the whole idea. Jest, Vitest and the rest add reporting, isolation and tooling on top, but the core is a comparison and a thrown error.

### The shape of a good test

\`\`\`js
test("applies a 10% discount", () => {
  const cart = { total: 100 };          // Arrange
  const result = applyDiscount(cart, 10);  // Act
  expect(result.total).toBe(90);           // Assert
});
\`\`\`

**Arrange, Act, Assert.** Set up the world, do the one thing, check the one outcome. Tests that do five things fail without telling you which thing broke.

### What makes a test worth having

- **The name states the behaviour.** "applies a 10% discount" tells a future reader what the code is *for*. "test1" tells them nothing.
- **It can fail.** A test that passes no matter what the code does is worse than none — it is false confidence. Deliberately break your code and check the test goes red.
- **It tests behaviour, not implementation.** Assert on what the function returns, not on which private helpers it called. Otherwise every refactor breaks the suite and the team learns to ignore it.

### Coverage is not the goal

100% coverage means every line ran, not that every line is *correct*. A suite that covers everything and asserts nothing is common and useless. Aim for tests that would actually catch a plausible mistake.

## YOUR TASK

Implement \`applyDiscount(cart, percent)\`:

- returns a **new** cart object with \`total\` reduced by that percentage, rounded to 2 decimal places
- throws if \`percent\` is below 0 or above 100
- leaves the original cart untouched

Then write your own \`test()\` calls for it in the editor — the graded suite runs afterwards and checks the same behaviours, so agreeing with it is a good sign.`,
    starterCode: `function applyDiscount(cart, percent) {
}

// Write a few tests of your own here. The graded suite runs after them.
test("removes 10 percent", () => {
  expect(applyDiscount({ total: 100 }, 10).total).toBe(90);
});
`,
    testCode: `test("[graded] applies the percentage", () => {
  expect(applyDiscount({ total: 200 }, 25).total).toBe(150);
  expect(applyDiscount({ total: 100 }, 0).total).toBe(100);
});

test("[graded] rounds to two decimals", () => {
  expect(applyDiscount({ total: 9.99 }, 33).total).toBe(6.69);
});

test("[graded] does not mutate the original cart", () => {
  const cart = { total: 100, items: 3 };
  applyDiscount(cart, 50);
  expect(cart.total).toBe(100);
});

test("[graded] keeps the other fields", () => {
  expect(applyDiscount({ total: 100, items: 3 }, 50)).toEqual({ total: 50, items: 3 });
});

test("[graded] rejects an out-of-range percentage", () => {
  expect(() => applyDiscount({ total: 100 }, -1)).toThrow();
  expect(() => applyDiscount({ total: 100 }, 101)).toThrow();
});`,
    hints: [
      'Guard first: `if (percent < 0 || percent > 100) throw new Error("...")`.',
      'Return a copy with the new total: `{ ...cart, total: ... }`.',
      'Round to two decimals with `Math.round(value * 100) / 100`.',
    ],
    solution: `function applyDiscount(cart, percent) {
  if (percent < 0 || percent > 100) {
    throw new Error("percent must be between 0 and 100");
  }
  const total = Math.round(cart.total * (1 - percent / 100) * 100) / 100;
  return { ...cart, total };
}

test("removes 10 percent", () => {
  expect(applyDiscount({ total: 100 }, 10).total).toBe(90);
});

test("rejects a negative percent", () => {
  expect(() => applyDiscount({ total: 100 }, -5)).toThrow();
});
`,
  },
  {
    id: 'test-02-edge-cases',
    title: 'Finding the Edge Cases',
    language: 'javascript',
    module: 'Fundamentals',
    difficulty: 4,
    concepts: ['edge-cases', 'boundaries', 'defensive-coding'],
    instructions: `Bugs do not live in the middle of the input range. They live at the edges. Learning to enumerate edges is most of what separates a careful engineer from a fast one.

### The checklist

Run this against every function you write:

- **Empty** — empty array, empty string, empty object, zero
- **One** — a single element often takes a different code path than many
- **Boundaries** — exactly at the limit, one below, one above
- **Negatives and zero** — where the spec assumed positives
- **Duplicates** — repeated values in what you assumed was distinct
- **Wrong type or missing** — \`null\`, \`undefined\`, a string where a number was meant
- **Very large** — does it still finish?
- **Unicode** — accents and emoji, if strings are involved

### An example

"Return the second-largest number in an array." Sounds trivial. Now:

- \`[]\` — nothing to return. Throw, or return null? *Decide, and write it down.*
- \`[5]\` — no second element.
- \`[5, 5]\` — is the second largest 5, or is there none? The specification does not say, which is the real finding here.
- \`[3, 1, 2]\` — the ordinary case, which is the only one most people test.

Half the value of writing tests is discovering the questions the specification never answered. Bringing those questions back to whoever wrote the ticket is a large part of what a good engineer does — and interviewers actively look for candidates who ask them.

### Guard clauses

Handle the edges first and let the main path stay clean:

\`\`\`js
function secondLargest(nums) {
  if (!Array.isArray(nums) || nums.length < 2) return null;
  // ... the real work, now free of special cases
}
\`\`\`

## YOUR TASK

Write \`secondLargest(nums)\` to this specification, which has been made explicit precisely because the edges were ambiguous:

- fewer than 2 elements → \`null\`
- **distinct** values only: \`[5, 5, 3]\` has second-largest \`3\`, and \`[5, 5]\` gives \`null\`
- negatives are fine
- not an array → \`null\`
- must handle 100,000 items quickly

Read every test before you start. They are the specification.`,
    starterCode: `function secondLargest(nums) {
}
`,
    testCode: `test("the ordinary case", () => {
  expect(secondLargest([3, 1, 2])).toBe(2);
  expect(secondLargest([10, 20, 30, 40])).toBe(30);
});

test("empty and single-element arrays give null", () => {
  expect(secondLargest([])).toBeNull();
  expect(secondLargest([5])).toBeNull();
});

test("duplicates of the maximum are ignored", () => {
  expect(secondLargest([5, 5, 3])).toBe(3);
  expect(secondLargest([5, 5])).toBeNull();
  expect(secondLargest([7, 7, 7])).toBeNull();
});

test("negatives work", () => {
  expect(secondLargest([-1, -2, -3])).toBe(-2);
  expect(secondLargest([-5, 0])).toBe(-5);
});

test("non-arrays give null", () => {
  expect(secondLargest(null)).toBeNull();
  expect(secondLargest(undefined)).toBeNull();
  expect(secondLargest("12345")).toBeNull();
});

test("order does not matter", () => {
  expect(secondLargest([1, 2, 3, 4, 5])).toBe(4);
  expect(secondLargest([5, 4, 3, 2, 1])).toBe(4);
});

test("handles 100000 items in one pass", () => {
  const big = Array.from({ length: 100000 }, (_, i) => i);
  const start = Date.now();
  expect(secondLargest(big)).toBe(99998);
  expect(Date.now() - start).toBeLessThan(200);
});`,
    hints: [
      'Start with the guards: not an array, or fewer than 2 items, returns null.',
      'One pass with two variables — `largest` and `second` — beats sorting, and handles the size requirement.',
      'Skip any value equal to `largest` so duplicates of the maximum never become the second largest.',
    ],
    solution: `function secondLargest(nums) {
  if (!Array.isArray(nums) || nums.length < 2) return null;

  let largest = -Infinity;
  let second = -Infinity;

  for (const n of nums) {
    if (n > largest) {
      second = largest;
      largest = n;
    } else if (n < largest && n > second) {
      second = n;
    }
  }

  return second === -Infinity ? null : second;
}
`,
  },
  {
    id: 'test-03-tdd',
    title: 'Test-Driven Development',
    language: 'javascript',
    module: 'Practice',
    difficulty: 4,
    concepts: ['tdd', 'red-green-refactor', 'design'],
    instructions: `TDD inverts the usual order: write a failing test, make it pass, then clean up. **Red, green, refactor.**

1. **Red** — write one small test for behaviour that does not exist yet. Run it. It must fail, and for the reason you expect. A test that passes before you have written anything is testing nothing.
2. **Green** — write the simplest code that passes. Not the elegant code. The simplest.
3. **Refactor** — now improve it, with the test holding the behaviour still.

Then repeat with the next small behaviour.

### Why it produces better code

You are the first user of your own API. Writing the call before the implementation makes awkward signatures obvious immediately — if the test is painful to write, the design is wrong, and you learn that in seconds rather than after everything depends on it.

It also guarantees the test can fail, which as the last lesson noted is a property most retro-fitted tests lack.

### An honest account

Nobody does strict TDD all the time, and claiming otherwise in an interview does not read as credible. It shines for pure logic with clear rules — parsers, pricing, validation, algorithms. It fits badly for exploratory UI work where you do not yet know what you are building. The professional position is: "I use it where the rules are known, and I always make sure a test fails before I trust it."

### FizzBuzz, done properly

The classic screening exercise. The TDD path is: a test for 1 → return "1". A test for 3 → return "Fizz". A test for 5 → "Buzz". A test for 15 → "FizzBuzz". Each test forces exactly one new branch.

The one trap: check 15 **first**. Test 3 before 15 and 15 returns "Fizz", because it never reaches the combined case.

## YOUR TASK

\`fizzBuzz(n)\` returning a string:

- divisible by 3 and 5 → \`"FizzBuzz"\`
- divisible by 3 → \`"Fizz"\`
- divisible by 5 → \`"Buzz"\`
- otherwise the number as a string

Then \`fizzBuzzRange(from, to)\` returning an array of those strings, inclusive at both ends.

Work in the TDD order: write your own test first, watch it fail, then implement.`,
    starterCode: `function fizzBuzz(n) {
}

function fizzBuzzRange(from, to) {
}

// Your own test first — run it before writing the implementation and watch it fail.
test("3 is Fizz", () => {
  expect(fizzBuzz(3)).toBe("Fizz");
});
`,
    testCode: `test("[graded] plain numbers become strings", () => {
  expect(fizzBuzz(1)).toBe("1");
  expect(fizzBuzz(7)).toBe("7");
});

test("[graded] multiples of 3", () => {
  expect(fizzBuzz(3)).toBe("Fizz");
  expect(fizzBuzz(9)).toBe("Fizz");
});

test("[graded] multiples of 5", () => {
  expect(fizzBuzz(5)).toBe("Buzz");
  expect(fizzBuzz(20)).toBe("Buzz");
});

test("[graded] multiples of both are checked first", () => {
  expect(fizzBuzz(15)).toBe("FizzBuzz");
  expect(fizzBuzz(45)).toBe("FizzBuzz");
});

test("[graded] zero is divisible by everything", () => {
  expect(fizzBuzz(0)).toBe("FizzBuzz");
});

test("[graded] negatives follow the same rules", () => {
  expect(fizzBuzz(-3)).toBe("Fizz");
  expect(fizzBuzz(-1)).toBe("-1");
});

test("[graded] the range is inclusive at both ends", () => {
  expect(fizzBuzzRange(1, 5)).toEqual(["1", "2", "Fizz", "4", "Buzz"]);
  expect(fizzBuzzRange(14, 16)).toEqual(["14", "FizzBuzz", "16"]);
});

test("[graded] an inverted range is empty", () => {
  expect(fizzBuzzRange(5, 1)).toEqual([]);
});`,
    hints: [
      'Test `n % 15 === 0` first, or handle it as `n % 3 === 0 && n % 5 === 0`.',
      'Convert the fallback with `String(n)`, not by returning the number.',
      'For the range, a loop from `from` to `to` inclusive; if `from > to` the loop simply never runs.',
    ],
    solution: `function fizzBuzz(n) {
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return String(n);
}

function fizzBuzzRange(from, to) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(fizzBuzz(n));
  return out;
}

test("3 is Fizz", () => {
  expect(fizzBuzz(3)).toBe("Fizz");
});
`,
  },
  {
    id: 'test-04-pure-functions',
    title: 'Testable Code: Pure Functions and Seams',
    language: 'javascript',
    module: 'Practice',
    difficulty: 4,
    concepts: ['pure-functions', 'side-effects', 'dependency-injection', 'mocking'],
    instructions: `Some code is hard to test. That is almost always the code telling you something.

A **pure** function depends only on its arguments and does nothing but return a value:

\`\`\`js
const addTax = (amount, rate) => amount * (1 + rate);   // pure
\`\`\`

Same input, same output, every time, with no effect on the outside world. Pure functions are trivially testable: call, compare, done.

Now the impure version:

\`\`\`js
function makeOrderId() {
  return "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}
\`\`\`

How do you test that? You cannot predict the output. \`Date.now()\` and \`Math.random()\` are hidden inputs.

### Inject the dependency

Pass the unpredictable thing in, with a sensible default:

\`\`\`js
function makeOrderId(now = Date.now, random = Math.random) {
  return "ORD-" + now() + "-" + Math.floor(random() * 1000);
}

makeOrderId();                        // production: real clock
makeOrderId(() => 1000, () => 0.5);   // test: "ORD-1000-500", every time
\`\`\`

Callers see no change. Tests get complete control. That parameter is called a **seam**, and this is dependency injection in its simplest, most useful form — no framework required.

### The pattern that scales

Push side effects to the edges: fetching, writing files, reading the clock, touching the DOM. Keep decisions in the middle, pure. Then the interesting logic — where the bugs are — is tested easily, and the thin I/O shell around it needs only a handful of integration tests.

That is also the honest answer to "how do you test code that calls an API": you do not test the API. You separate the decision from the call.

## YOUR TASK

1. \`makeOrderId(now, random)\` — \`"ORD-<now>-<3 digits>"\`, where the digits are \`Math.floor(random() * 1000)\` zero-padded to three characters. Defaults to the real clock and randomness.
2. \`processOrder(order, deps)\` — takes \`{ items, customer }\` and a deps object \`{ now, random, log }\`. It should build an id, compute \`total\` as the sum of \`item.price * item.qty\`, call \`deps.log\` once with the id, and return \`{ id, customer, total }\`.`,
    starterCode: `function makeOrderId(now = Date.now, random = Math.random) {
}

function processOrder(order, deps = {}) {
}
`,
    testCode: `test("makeOrderId is deterministic when the seams are supplied", () => {
  expect(makeOrderId(() => 1000, () => 0.5)).toBe("ORD-1000-500");
  expect(makeOrderId(() => 42, () => 0.007)).toBe("ORD-42-007");
});

test("makeOrderId pads to three digits", () => {
  expect(makeOrderId(() => 1, () => 0)).toBe("ORD-1-000");
});

test("makeOrderId works with no arguments", () => {
  const id = makeOrderId();
  expect(id.startsWith("ORD-")).toBe(true);
});

test("processOrder totals the items", () => {
  const order = {
    customer: "Ada",
    items: [{ price: 10, qty: 2 }, { price: 5, qty: 3 }],
  };
  const result = processOrder(order, { now: () => 1, random: () => 0, log: () => {} });
  expect(result.total).toBe(35);
  expect(result.customer).toBe("Ada");
  expect(result.id).toBe("ORD-1-000");
});

test("processOrder logs exactly once, with the id", () => {
  const logged = [];
  const order = { customer: "Ada", items: [] };
  const result = processOrder(order, {
    now: () => 7,
    random: () => 0,
    log: (msg) => logged.push(msg),
  });
  expect(logged).toHaveLength(1);
  expect(logged[0]).toContain(result.id);
});

test("processOrder handles an empty basket", () => {
  const result = processOrder({ customer: "X", items: [] }, { now: () => 1, random: () => 0, log: () => {} });
  expect(result.total).toBe(0);
});`,
    hints: [
      'Pad with `String(n).padStart(3, "0")`.',
      'Destructure the deps with defaults: `const { now = Date.now, random = Math.random, log = () => {} } = deps;`',
      'Total the items with `reduce`, starting at 0 so the empty basket works.',
    ],
    solution: `function makeOrderId(now = Date.now, random = Math.random) {
  const digits = String(Math.floor(random() * 1000)).padStart(3, "0");
  return "ORD-" + now() + "-" + digits;
}

function processOrder(order, deps = {}) {
  const { now = Date.now, random = Math.random, log = () => {} } = deps;

  const id = makeOrderId(now, random);
  const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  log("Processed " + id);

  return { id, customer: order.customer, total };
}
`,
  },
  {
    id: 'test-05-debugging',
    title: 'Debugging: Reading the Evidence',
    language: 'javascript',
    module: 'Practice',
    difficulty: 3,
    concepts: ['debugging', 'stack-traces', 'bisection', 'hypotheses'],
    instructions: `Debugging is not guessing until it works. It is a search, and there is a method.

### 1. Reproduce it reliably

An intermittent bug is nearly impossible to fix and impossible to verify fixed. Getting from "sometimes" to "always, with these inputs" is usually most of the work — and once you have that, you have a test case.

### 2. Read the stack trace properly

\`\`\`
TypeError: Cannot read properties of undefined (reading 'name')
    at formatUser (user.js:12:20)
    at renderList (list.js:45:9)
\`\`\`

- The **type and message** say what went wrong: something was \`undefined\` where an object was expected.
- The **top frame** is where it blew up: \`user.js\` line 12.
- The frames below are who called it. Read downward to find where the bad value came from — the crash site is often not the fault site.

### 3. Form one hypothesis at a time

"I think \`users\` contains a hole." Then test *that* — do not change three things and re-run. If you change several things and it starts working, you have not fixed a bug, you have hidden one.

### 4. Bisect

Comment out half the code, or \`git bisect\` across commits. Each test halves the search space: twenty commits, five checks. The same logarithm as binary search.

### 5. Question the assumption, not the language

The bug is in your code. It is almost never in the compiler, the framework, or the machine. When you feel certain the language is broken, print the value you are certain about — that print is usually where the surprise is.

\`\`\`js
console.log({ users, index, current: users[index] });   // log objects, not strings
\`\`\`

Logging an object with braces labels every value, which beats a row of anonymous prints.

> A debugger with breakpoints beats console.log for anything non-trivial, because you can inspect the whole scope and step through. Every browser has one built in, and knowing it well is a visible sign of experience.

## YOUR TASK

\`summarise(users)\` is meant to return \`{ count, names }\` for the *active* users — but it crashes on the real data, which contains holes and users with no profile.

Rather than defending against everything blindly, work out from the tests what the data can actually contain, and make it robust:

- skip \`null\` and \`undefined\` entries
- treat a missing \`profile\` as no name available, using \`"(unknown)"\`
- count only users whose \`active\` is exactly \`true\`
- never throw`,
    starterCode: `// This crashes on the real data. Find out why from the tests, then fix it.
function summarise(users) {
  const active = users.filter((u) => u.active);
  return {
    count: active.length,
    names: active.map((u) => u.profile.name),
  };
}
`,
    testCode: `test("the happy path still works", () => {
  const users = [
    { active: true, profile: { name: "Ada" } },
    { active: false, profile: { name: "Alan" } },
  ];
  expect(summarise(users)).toEqual({ count: 1, names: ["Ada"] });
});

test("holes in the array are skipped", () => {
  const users = [null, { active: true, profile: { name: "Ada" } }, undefined];
  expect(summarise(users)).toEqual({ count: 1, names: ["Ada"] });
});

test("a missing profile becomes (unknown)", () => {
  const users = [{ active: true }];
  expect(summarise(users)).toEqual({ count: 1, names: ["(unknown)"] });
});

test("a profile without a name becomes (unknown)", () => {
  const users = [{ active: true, profile: {} }];
  expect(summarise(users)).toEqual({ count: 1, names: ["(unknown)"] });
});

test("only exactly-true counts as active", () => {
  const users = [
    { active: "yes", profile: { name: "A" } },
    { active: 1, profile: { name: "B" } },
    { active: true, profile: { name: "C" } },
  ];
  expect(summarise(users)).toEqual({ count: 1, names: ["C"] });
});

test("an empty list is fine", () => {
  expect(summarise([])).toEqual({ count: 0, names: [] });
});

test("a non-array does not throw", () => {
  expect(summarise(null)).toEqual({ count: 0, names: [] });
});`,
    hints: [
      'Three separate faults: array holes, missing `profile`, and truthy-but-not-true `active` values.',
      '`u?.active === true` handles the null entries and the strictness in one condition.',
      '`u.profile?.name ?? "(unknown)"` covers both the missing profile and the missing name.',
    ],
    solution: `function summarise(users) {
  if (!Array.isArray(users)) return { count: 0, names: [] };

  const active = users.filter((u) => u?.active === true);

  return {
    count: active.length,
    names: active.map((u) => u.profile?.name ?? "(unknown)"),
  };
}
`,
  },
  {
    id: 'test-06-quiz',
    title: 'Checkpoint: Testing Judgement',
    language: 'javascript',
    kind: 'quiz',
    module: 'Practice',
    difficulty: 3,
    concepts: ['testing', 'quality', 'review'],
    instructions: `Testing questions in interviews are less about syntax than about judgement — what you test, why, and what you would say about a suite you inherited.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'A test passes whether or not the implementation is correct. What is it worth?',
        choices: [
          'Still useful for coverage',
          'Worse than no test — it is false confidence',
          'Fine if it documents intent',
          'It depends on the framework',
        ],
        answerIndex: 1,
        explanation:
          'Worse than nothing. It contributes coverage numbers and a green tick while catching no regressions, so the team trusts a suite that is not protecting them. This is why TDD insists you see the test fail first.',
      },
      {
        id: 'q2',
        prompt: 'Which of these is the best unit test name?',
        choices: [
          'test discount',
          'test1',
          'applies a 10% discount to the cart total',
          'testApplyDiscountFunction',
        ],
        answerIndex: 2,
        explanation:
          'The one that states the behaviour. When it fails in CI six months from now, the name alone should tell you what broke — no reading the body required. Test names double as the specification.',
      },
      {
        id: 'q3',
        prompt: 'Your test asserts that an internal helper was called. What is the risk?',
        choices: [
          'None, it is thorough',
          'It tests implementation, so a harmless refactor breaks it',
          'It runs too slowly',
          'Mocks are always wrong',
        ],
        answerIndex: 1,
        explanation:
          'It couples the test to how the code works rather than what it does, so refactoring breaks the suite without any behaviour changing. Teams respond by ignoring failures. Assert on outputs and observable effects instead.',
      },
      {
        id: 'q4',
        prompt: 'Which set of inputs would you add first to a test for a function taking an array?',
        choices: [
          'Several more medium-sized arrays',
          'Empty, one element, and duplicates',
          'Only very large arrays',
          'Arrays of every possible type',
        ],
        answerIndex: 1,
        explanation:
          'The boundaries. Empty and single-element inputs usually take different code paths, and duplicates expose assumptions about distinctness. More medium cases mostly re-test the path you already covered.',
      },
      {
        id: 'q5',
        prompt: 'How do you make a function that calls `Date.now()` deterministically testable?',
        choices: [
          'Do not test it',
          'Pass the clock in as a parameter with a real default',
          'Wrap the test in a try/catch',
          'Sleep until a round second',
        ],
        answerIndex: 1,
        explanation:
          'Inject it. `function f(now = Date.now)` leaves every caller unchanged while letting a test supply a fixed clock. The general rule: push unpredictable I/O to the edges and keep the decisions pure.',
      },
      {
        id: 'q6',
        prompt: 'A bug appears only in production, roughly once a day. What is the first move?',
        choices: [
          'Add try/catch around the suspect area',
          'Make it reproduce reliably',
          'Rewrite the module',
          'Increase the server memory',
        ],
        answerIndex: 1,
        explanation:
          'Reproduce it. Without a reliable reproduction you cannot confirm a fix — you can only wait and hope. Getting from "sometimes" to "always with this input" usually is the debugging, and it hands you a regression test for free.',
      },
      {
        id: 'q7',
        prompt: 'What does 100% line coverage guarantee?',
        choices: [
          'The code is correct',
          'Every line executed during the tests',
          'There are no bugs',
          'Every edge case is handled',
        ],
        answerIndex: 1,
        explanation:
          'Only that every line ran. A suite can execute every line and assert nothing at all. Coverage is useful for finding untested areas, and meaningless as a target on its own — which is worth saying plainly if an interviewer asks about coverage goals.',
      },
    ],
  },
];
