import type { LessonDraft } from '../types';

export const JS_DEEP_LESSONS: LessonDraft[] = [
  // ══════════ Functions & Scope ══════════
  {
    id: 'jsd-01-scope',
    title: 'Scope: Where a Variable Lives',
    language: 'javascript',
    module: 'Functions & Scope',
    difficulty: 3,
    concepts: ['scope', 'block-scope', 'shadowing'],
    instructions: `Every variable has a **scope** — the region of code where its name means something. Outside that region the name simply does not exist.

\`let\` and \`const\` are *block scoped*: the block is the nearest pair of curly braces.

\`\`\`js
function demo() {
  const outer = "visible everywhere in demo";
  if (true) {
    const inner = "only visible inside this if";
    console.log(outer);  // fine — inner blocks can see outward
  }
  console.log(inner);    // ReferenceError: inner is not defined
}
\`\`\`

Scopes nest, and lookup goes **outward only**. Inner code can read outer variables; outer code can never reach in. That one-way rule is what makes it safe to name a loop counter \`i\` in two different functions.

### Shadowing

Declaring a variable with a name that already exists further out creates a *new* variable that hides the old one for the length of the block:

\`\`\`js
const rate = 100;
function quote() {
  const rate = 200;   // shadows the outer rate
  return rate;        // 200
}
quote();              // 200
rate;                 // still 100 — untouched
\`\`\`

### Why \`var\` is gone

Older code uses \`var\`, which is *function* scoped, not block scoped. A \`var\` declared inside an \`if\` leaks out into the whole function, which caused a famous class of loop bugs. You will meet \`var\` in old code; you should not write it.

> The rule of thumb professionals use: \`const\` by default, \`let\` when the value must change, \`var\` never.

## YOUR TASK

This lesson is graded by a **test suite** rather than by matching printed output — the way real code is checked. Write the function; the tests below the editor tell you whether it behaves correctly.

Write \`makeLabel(prefix)\` that returns a *string*: the prefix, a space, then the word \`"room"\`. The catch is in the starter — there is an outer \`suffix\` variable and a shadowing one inside a block. Read carefully and return the value the tests expect: the **inner** suffix wins inside the block, the outer one wins after it.`,
    starterCode: `const suffix = "suite";

function makeLabel(prefix) {
  {
    const suffix = "room";
    // return here, using the inner suffix
  }
}
`,
    testCode: `test("makeLabel joins the prefix with the inner suffix", () => {
  expect(makeLabel("Deluxe")).toBe("Deluxe room");
});

test("works for any prefix", () => {
  expect(makeLabel("Ocean")).toBe("Ocean room");
});

test("the outer suffix is untouched", () => {
  expect(suffix).toBe("suite");
});`,
    hints: [
      'The `return` goes inside the inner block, where the shadowing `suffix` is in scope.',
      'Use a template string: `` return `${prefix} ${suffix}`; ``',
      'The outer `suffix` is never reassigned — shadowing creates a second variable, it does not overwrite the first.',
    ],
    solution: `const suffix = "suite";

function makeLabel(prefix) {
  {
    const suffix = "room";
    return \`\${prefix} \${suffix}\`;
  }
}
`,
  },
  {
    id: 'jsd-02-closures',
    title: 'Closures',
    language: 'javascript',
    module: 'Functions & Scope',
    difficulty: 4,
    concepts: ['closures', 'state', 'factory-functions'],
    instructions: `A **closure** is what you get when a function remembers the variables it was born next to, even after the code that created it has finished running.

\`\`\`js
function makeCounter() {
  let count = 0;                 // local to makeCounter
  return function () {
    count += 1;
    return count;
  };
}

const next = makeCounter();
next();   // 1
next();   // 2
next();   // 3
\`\`\`

\`makeCounter\` finished on the first line. Normally its local \`count\` would be gone. But the returned function still refers to \`count\`, so JavaScript keeps that variable alive for as long as the function that needs it exists. The function *closed over* \`count\`.

### Why this matters on the job

Closures are how you get **private state** without a class:

\`\`\`js
function makeAccount(balance) {
  return {
    deposit: (n) => (balance += n),
    getBalance: () => balance,
  };
}
const acct = makeAccount(100);
acct.deposit(50);
acct.getBalance();   // 150
acct.balance;        // undefined — nothing outside can touch it
\`\`\`

Nothing outside those two functions can reach \`balance\`. That is real encapsulation, and it is everywhere in professional code: event handlers, React hooks, module patterns, rate limiters, memoisation caches.

### Each call gets its own

\`\`\`js
const a = makeCounter();
const b = makeCounter();
a();   // 1
a();   // 2
b();   // 1  — b has its own count
\`\`\`

Every call to the outer function creates a fresh set of variables. This trips people up in interviews constantly.

## YOUR TASK

Write \`makeCounter(start)\` that returns a function. Each call to the returned function increases the count by 1 and returns the new value. If \`start\` is omitted it should begin at 0, so the first call returns 1.

Two separate counters must not share state.`,
    starterCode: `function makeCounter(start) {
  // keep the count in a variable here, and return a function that updates it
}
`,
    testCode: `test("counts up from zero by default", () => {
  const next = makeCounter();
  expect(next()).toBe(1);
  expect(next()).toBe(2);
  expect(next()).toBe(3);
});

test("honours a starting value", () => {
  const next = makeCounter(10);
  expect(next()).toBe(11);
  expect(next()).toBe(12);
});

test("each counter keeps its own private state", () => {
  const a = makeCounter();
  const b = makeCounter();
  a(); a(); a();
  expect(b()).toBe(1);
  expect(a()).toBe(4);
});

test("returns a function, not a number", () => {
  expect(makeCounter()).toBeTypeOf("function");
});`,
    hints: [
      'A default parameter handles the missing argument: `function makeCounter(start = 0)`.',
      'Declare `let count = start;` inside `makeCounter`, then `return function () { ... }`.',
      'The inner function must both increase `count` and return the new value — `count += 1; return count;` or `return ++count;`.',
    ],
    solution: `function makeCounter(start = 0) {
  let count = start;
  return function () {
    count += 1;
    return count;
  };
}
`,
  },
  {
    id: 'jsd-03-higher-order',
    title: 'Functions as Values',
    language: 'javascript',
    module: 'Functions & Scope',
    difficulty: 3,
    concepts: ['higher-order-functions', 'callbacks', 'arrow-functions'],
    instructions: `In JavaScript a function is an ordinary value. You can store one in a variable, put one in an array, pass one to another function, and return one. Functions that take or return functions are called **higher-order functions**.

\`\`\`js
const double = (n) => n * 2;      // stored in a variable
const ops = [double, (n) => n + 1];  // in an array

function applyTwice(fn, value) {   // takes a function
  return fn(fn(value));
}
applyTwice(double, 5);             // 20
\`\`\`

### Arrow functions, precisely

\`\`\`js
(n) => n * 2                 // one expression: returned automatically
(n) => { return n * 2; }     // a block: you must write return
(a, b) => a + b              // two parameters
() => 42                     // none
(n) => ({ value: n })        // returning an object literal needs parentheses,
                             // or the braces read as a function body
\`\`\`

That last line catches everyone once.

### The callback pattern

A **callback** is a function you hand to someone else to call later. You have already used them: \`addEventListener("click", () => ...)\` is a callback the browser calls when a click happens. The entire array-method vocabulary in the next few lessons is built on this idea.

\`\`\`js
function retry(times, action) {
  for (let i = 0; i < times; i++) {
    const result = action(i);
    if (result) return result;
  }
  return null;
}
\`\`\`

\`retry\` knows nothing about what \`action\` does. That is the point — the caller supplies the behaviour, so one function serves a hundred uses.

## YOUR TASK

Write two functions.

1. \`applyTwice(fn, value)\` — calls \`fn\` on \`value\`, then calls \`fn\` on that result, and returns it.
2. \`makeMultiplier(factor)\` — returns a *function* that multiplies its argument by \`factor\`.

Together they show both directions: taking a function in, and handing one back.`,
    starterCode: `function applyTwice(fn, value) {
  // call fn on value, then on the result
}

function makeMultiplier(factor) {
  // return a function that multiplies by factor
}
`,
    testCode: `test("applyTwice applies the function twice", () => {
  expect(applyTwice((n) => n * 2, 5)).toBe(20);
  expect(applyTwice((n) => n + 3, 0)).toBe(6);
});

test("applyTwice works on strings too", () => {
  expect(applyTwice((s) => s + "!", "hi")).toBe("hi!!");
});

test("makeMultiplier returns a working function", () => {
  const triple = makeMultiplier(3);
  expect(triple(5)).toBe(15);
  expect(triple(0)).toBe(0);
});

test("multipliers are independent", () => {
  const double = makeMultiplier(2);
  const tenX = makeMultiplier(10);
  expect(double(4)).toBe(8);
  expect(tenX(4)).toBe(40);
});`,
    hints: [
      '`applyTwice` is one line: `return fn(fn(value));` — the inner call runs first.',
      '`makeMultiplier` returns an arrow function that closes over `factor`.',
      '`return (n) => n * factor;`',
    ],
    solution: `function applyTwice(fn, value) {
  return fn(fn(value));
}

function makeMultiplier(factor) {
  return (n) => n * factor;
}
`,
  },

  // ══════════ Working With Data ══════════
  {
    id: 'jsd-04-map',
    title: 'map: Transform Every Item',
    language: 'javascript',
    module: 'Working With Data',
    difficulty: 3,
    concepts: ['map', 'array-methods', 'immutability'],
    instructions: `Here begins the single most visible difference between beginner and professional JavaScript. Beginners write loops. Professionals write \`map\`, \`filter\` and \`reduce\`.

\`map\` builds a **new array** by running a function on every item of the old one:

\`\`\`js
const prices = [100, 200, 300];
const withTax = prices.map((p) => p * 1.1);
// withTax  → [110, 220, 330]
// prices   → [100, 200, 300]   unchanged
\`\`\`

Compare that to the loop it replaces:

\`\`\`js
const withTax = [];
for (const p of prices) {
  withTax.push(p * 1.1);
}
\`\`\`

Six lines of bookkeeping become one line of intent. And crucially, \`map\` never modifies the original array — it returns a new one. Not mutating your inputs is a habit that prevents an entire family of bugs, which the References lesson later in this track will show you first-hand.

### The callback gets three arguments

\`\`\`js
items.map((item, index, wholeArray) => ...)
\`\`\`

You will use \`item\` almost always and \`index\` occasionally.

### Mapping objects

The everyday use is reshaping records — turning what an API gave you into what your screen needs:

\`\`\`js
const users = [
  { first: "Ada", last: "Lovelace" },
  { first: "Alan", last: "Turing" },
];
const names = users.map((u) => \`\${u.first} \${u.last}\`);
// ["Ada Lovelace", "Alan Turing"]
\`\`\`

> A trap worth knowing now: \`map\` always returns an array of the **same length**. If you find yourself wanting to skip items, you want \`filter\`, which is the next lesson.

## YOUR TASK

Write two functions using \`map\` — no \`for\` loops.

1. \`addTax(prices)\` — takes an array of numbers, returns a new array with each multiplied by \`1.2\`, rounded to the nearest whole number with \`Math.round\`.
2. \`fullNames(people)\` — takes an array of \`{ first, last }\` objects and returns an array of \`"First Last"\` strings.`,
    starterCode: `function addTax(prices) {
  // use .map
}

function fullNames(people) {
  // use .map
}
`,
    testCode: `test("addTax applies 20% and rounds", () => {
  expect(addTax([100, 200])).toEqual([120, 240]);
  expect(addTax([99])).toEqual([119]);
});

test("addTax does not modify the original array", () => {
  const original = [100, 200];
  addTax(original);
  expect(original).toEqual([100, 200]);
});

test("addTax handles an empty array", () => {
  expect(addTax([])).toEqual([]);
});

test("fullNames joins first and last", () => {
  expect(fullNames([{ first: "Ada", last: "Lovelace" }])).toEqual(["Ada Lovelace"]);
});

test("fullNames maps every person", () => {
  const people = [
    { first: "Ada", last: "Lovelace" },
    { first: "Alan", last: "Turing" },
  ];
  expect(fullNames(people)).toEqual(["Ada Lovelace", "Alan Turing"]);
});`,
    hints: [
      '`return prices.map((p) => ...)` — the arrow body is the new value for each item.',
      '`Math.round(p * 1.2)` rounds to the nearest whole number.',
      'For names, a template string reads best: `` (p) => `${p.first} ${p.last}` ``.',
    ],
    solution: `function addTax(prices) {
  return prices.map((p) => Math.round(p * 1.2));
}

function fullNames(people) {
  return people.map((p) => \`\${p.first} \${p.last}\`);
}
`,
  },
  {
    id: 'jsd-05-filter',
    title: 'filter and find: Choosing Items',
    language: 'javascript',
    module: 'Working With Data',
    difficulty: 3,
    concepts: ['filter', 'find', 'some', 'every', 'predicates'],
    instructions: `\`filter\` builds a new array containing only the items for which your function returns \`true\`.

\`\`\`js
const nums = [1, 8, 3, 12, 5];
const big = nums.filter((n) => n > 4);   // [8, 12, 5]
\`\`\`

A function that returns true or false like this is called a **predicate**. \`filter\` keeps every item the predicate approves of, in the original order.

### The family

Four methods take a predicate, and picking the right one says a lot about you as a programmer:

| Method | Question it answers | Returns |
| --- | --- | --- |
| \`filter\` | which items match? | a new array |
| \`find\` | which is the *first* match? | the item, or \`undefined\` |
| \`some\` | is there **any** match? | \`true\` / \`false\` |
| \`every\` | do **all** items match? | \`true\` / \`false\` |

\`\`\`js
const rooms = [
  { num: 101, clean: true },
  { num: 102, clean: false },
];

rooms.filter((r) => r.clean);          // [{num:101,...}]
rooms.find((r) => r.num === 102);      // {num:102, clean:false}
rooms.some((r) => !r.clean);           // true  — at least one dirty
rooms.every((r) => r.clean);           // false — not all clean
\`\`\`

Using \`filter(...)[0]\` where you meant \`find\` is a small thing that reviewers notice: \`find\` stops at the first hit, and it expresses "one thing" instead of "a list I am about to throw away".

> \`find\` returning \`undefined\` when nothing matches is a leading cause of "cannot read property of undefined" crashes. Always consider what your code does on a miss.

## YOUR TASK

Given arrays of room objects shaped \`{ num, rate, clean }\`, write:

1. \`availableRooms(rooms)\` — every room that is \`clean\` **and** has a rate under 250.
2. \`findRoom(rooms, num)\` — the room with that number, or \`null\` if there is none. Note: \`null\`, not \`undefined\` — converting the miss into an explicit value is a habit worth building.
3. \`anyDirty(rooms)\` — \`true\` if at least one room is not clean.`,
    starterCode: `function availableRooms(rooms) {
  // filter: clean AND rate < 250
}

function findRoom(rooms, num) {
  // find, but return null when there is no match
}

function anyDirty(rooms) {
  // some
}
`,
    testCode: `const ROOMS = [
  { num: 101, rate: 199, clean: true },
  { num: 102, rate: 299, clean: true },
  { num: 103, rate: 150, clean: false },
  { num: 104, rate: 240, clean: true },
];

test("availableRooms keeps only clean rooms under 250", () => {
  expect(availableRooms(ROOMS)).toEqual([
    { num: 101, rate: 199, clean: true },
    { num: 104, rate: 240, clean: true },
  ]);
});

test("availableRooms returns an empty array when nothing qualifies", () => {
  expect(availableRooms([{ num: 1, rate: 900, clean: false }])).toEqual([]);
});

test("findRoom returns the matching room", () => {
  expect(findRoom(ROOMS, 103)).toEqual({ num: 103, rate: 150, clean: false });
});

test("findRoom returns null when there is no match", () => {
  expect(findRoom(ROOMS, 999)).toBeNull();
});

test("anyDirty detects a dirty room", () => {
  expect(anyDirty(ROOMS)).toBe(true);
  expect(anyDirty([{ num: 1, rate: 100, clean: true }])).toBe(false);
});`,
    hints: [
      'Two conditions in one predicate are joined with `&&`: `(r) => r.clean && r.rate < 250`.',
      '`find` gives you `undefined` on a miss. The `??` operator converts it: `return rooms.find(...) ?? null;`',
      '`anyDirty` is `rooms.some((r) => !r.clean)` — the `!` flips the boolean.',
    ],
    solution: `function availableRooms(rooms) {
  return rooms.filter((r) => r.clean && r.rate < 250);
}

function findRoom(rooms, num) {
  return rooms.find((r) => r.num === num) ?? null;
}

function anyDirty(rooms) {
  return rooms.some((r) => !r.clean);
}
`,
  },
  {
    id: 'jsd-06-reduce',
    title: 'reduce: Many Values Into One',
    language: 'javascript',
    module: 'Working With Data',
    difficulty: 4,
    concepts: ['reduce', 'accumulator', 'grouping'],
    instructions: `\`reduce\` is the accumulator pattern from the Foundations track, given a name and a shape. It walks an array carrying a running value, and returns that value at the end.

\`\`\`js
const nums = [1, 2, 3, 4];
const total = nums.reduce((acc, n) => acc + n, 0);   // 10
\`\`\`

Two arguments: the **reducer function** and the **starting value**.

- \`acc\` is the running result. On the first pass it is the starting value.
- Whatever the reducer *returns* becomes \`acc\` on the next pass.
- The last returned value is the answer.

Traced out:

\`\`\`
start        acc = 0
n = 1        acc = 0 + 1 = 1
n = 2        acc = 1 + 2 = 3
n = 3        acc = 3 + 3 = 6
n = 4        acc = 6 + 4 = 10
\`\`\`

### It is not just for sums

The accumulator can be any type, and that is where \`reduce\` earns its reputation. Building an object is the case you will use most at work — turning a list into a lookup table, or counting occurrences:

\`\`\`js
const words = ["a", "b", "a", "c", "a"];
const counts = words.reduce((acc, w) => {
  acc[w] = (acc[w] || 0) + 1;
  return acc;
}, {});
// { a: 3, b: 1, c: 1 }
\`\`\`

Note the two easy mistakes in that block: **forgetting to return \`acc\`** (the next pass then gets \`undefined\`), and **forgetting the \`{}\` starting value**.

> Judgement call, and reviewers do have opinions: if a \`reduce\` is getting hard to read, a plain loop is better. \`reduce\` should clarify, not show off.

## YOUR TASK

1. \`total(nums)\` — the sum. Must return \`0\` for an empty array.
2. \`countByStatus(bookings)\` — takes objects shaped \`{ id, status }\` and returns an object mapping each status to how many times it appears.

Use \`reduce\` for both.`,
    starterCode: `function total(nums) {
  // reduce to a single number
}

function countByStatus(bookings) {
  // reduce to an object of counts
}
`,
    testCode: `test("total sums the array", () => {
  expect(total([1, 2, 3, 4])).toBe(10);
  expect(total([5])).toBe(5);
});

test("total of an empty array is 0", () => {
  expect(total([])).toBe(0);
});

test("countByStatus counts each status", () => {
  const bookings = [
    { id: 1, status: "confirmed" },
    { id: 2, status: "cancelled" },
    { id: 3, status: "confirmed" },
    { id: 4, status: "confirmed" },
  ];
  expect(countByStatus(bookings)).toEqual({ confirmed: 3, cancelled: 1 });
});

test("countByStatus of an empty list is an empty object", () => {
  expect(countByStatus([])).toEqual({});
});

test("countByStatus handles a single status", () => {
  expect(countByStatus([{ id: 1, status: "pending" }])).toEqual({ pending: 1 });
});`,
    hints: [
      'For the sum, the starting value `0` is what makes the empty case work.',
      'For the counts, start with `{}` and build it up: `acc[b.status] = (acc[b.status] || 0) + 1;`',
      'Remember to `return acc;` at the end of the reducer body — a block-bodied arrow does not return automatically.',
    ],
    solution: `function total(nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}

function countByStatus(bookings) {
  return bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});
}
`,
  },
  {
    id: 'jsd-07-pipelines',
    title: 'Chaining: Building a Data Pipeline',
    language: 'javascript',
    module: 'Working With Data',
    difficulty: 4,
    concepts: ['chaining', 'map', 'filter', 'reduce', 'data-pipelines'],
    instructions: `Because \`map\` and \`filter\` return arrays, you can chain them. Each step is one clear transformation, and the sequence reads like a description of the job:

\`\`\`js
const revenue = bookings
  .filter((b) => b.status === "confirmed")   // drop the noise
  .map((b) => b.nights * b.rate)             // reshape
  .reduce((acc, n) => acc + n, 0);           // collapse
\`\`\`

That is the shape of an enormous amount of real application code: **narrow, reshape, summarise**. Reports, dashboards, search results, invoices — all this pipeline with different words.

### Order matters, for correctness and for speed

Filter early. Every item you drop is an item the later steps do not touch:

\`\`\`js
items.map(expensive).filter(cheap)   // transforms everything, then discards
items.filter(cheap).map(expensive)   // discards first — same answer, less work
\`\`\`

On ten items nobody notices. On a hundred thousand, or when the map does something costly, this is the difference between a fast page and a complaint.

### Keeping it readable

One transformation per line, and give the chain a name that says what it produces. If a step needs more than a short expression, lift it into a named function:

\`\`\`js
const isConfirmed = (b) => b.status === "confirmed";
const toRevenue = (b) => b.nights * b.rate;

const revenue = bookings.filter(isConfirmed).map(toRevenue).reduce(sum, 0);
\`\`\`

Now the pipeline is a sentence.

## YOUR TASK

Each booking looks like \`{ id, guest, nights, rate, status }\`.

1. \`confirmedRevenue(bookings)\` — total \`nights * rate\` across confirmed bookings only.
2. \`guestList(bookings)\` — the guest names of confirmed bookings, sorted alphabetically, as an array of strings.
3. \`averageStay(bookings)\` — the mean number of nights across confirmed bookings, rounded to one decimal place. Return \`0\` if there are none — dividing by zero would give you \`NaN\`, and shipping \`NaN\` to a screen is a real bug you should head off here.`,
    starterCode: `function confirmedRevenue(bookings) {
}

function guestList(bookings) {
}

function averageStay(bookings) {
}
`,
    testCode: `const BOOKINGS = [
  { id: 1, guest: "Zoe", nights: 3, rate: 200, status: "confirmed" },
  { id: 2, guest: "Adam", nights: 1, rate: 150, status: "cancelled" },
  { id: 3, guest: "Mia", nights: 2, rate: 250, status: "confirmed" },
  { id: 4, guest: "Ben", nights: 4, rate: 100, status: "confirmed" },
];

test("confirmedRevenue ignores cancelled bookings", () => {
  expect(confirmedRevenue(BOOKINGS)).toBe(1500);
});

test("confirmedRevenue of an empty list is 0", () => {
  expect(confirmedRevenue([])).toBe(0);
});

test("guestList returns confirmed guests sorted", () => {
  expect(guestList(BOOKINGS)).toEqual(["Ben", "Mia", "Zoe"]);
});

test("averageStay rounds to one decimal", () => {
  expect(averageStay(BOOKINGS)).toBe(3);
});

test("averageStay handles fractions", () => {
  const b = [
    { id: 1, guest: "A", nights: 1, rate: 10, status: "confirmed" },
    { id: 2, guest: "B", nights: 2, rate: 10, status: "confirmed" },
  ];
  expect(averageStay(b)).toBe(1.5);
});

test("averageStay returns 0 rather than NaN when nothing is confirmed", () => {
  expect(averageStay([{ id: 1, guest: "A", nights: 2, rate: 10, status: "cancelled" }])).toBe(0);
});`,
    hints: [
      'All three start the same way: `bookings.filter((b) => b.status === "confirmed")`.',
      '`.sort()` with no arguments sorts strings alphabetically, which is what `guestList` needs.',
      'Round to one decimal with `Math.round(x * 10) / 10`, and guard the empty case with an early `if (confirmed.length === 0) return 0;`.',
    ],
    solution: `function confirmedRevenue(bookings) {
  return bookings
    .filter((b) => b.status === "confirmed")
    .map((b) => b.nights * b.rate)
    .reduce((acc, n) => acc + n, 0);
}

function guestList(bookings) {
  return bookings
    .filter((b) => b.status === "confirmed")
    .map((b) => b.guest)
    .sort();
}

function averageStay(bookings) {
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  if (confirmed.length === 0) return 0;
  const nights = confirmed.reduce((acc, b) => acc + b.nights, 0);
  return Math.round((nights / confirmed.length) * 10) / 10;
}
`,
  },
  {
    id: 'jsd-08-sorting',
    title: 'Sorting, and the Trap in It',
    language: 'javascript',
    module: 'Working With Data',
    difficulty: 3,
    concepts: ['sort', 'comparators', 'mutation'],
    instructions: `\`sort\` has two behaviours that surprise people, and both show up in production bugs.

### Trap one: it sorts as text by default

\`\`\`js
[10, 9, 100, 1].sort();     // [1, 10, 100, 9]  ← not a mistake in the docs
\`\`\`

With no comparator, \`sort\` converts every item to a string. \`"10"\` really does come before \`"9"\` alphabetically. For numbers you must supply a **comparator**:

\`\`\`js
[10, 9, 100, 1].sort((a, b) => a - b);   // [1, 9, 10, 100]   ascending
[10, 9, 100, 1].sort((a, b) => b - a);   // [100, 10, 9, 1]   descending
\`\`\`

The contract: return a negative number if \`a\` comes first, positive if \`b\` comes first, \`0\` if they tie. Subtraction satisfies that for free.

### Trap two: it mutates

\`\`\`js
const original = [3, 1, 2];
const sorted = original.sort();
original;   // [1, 2, 3]  ← the original changed too
\`\`\`

Unlike \`map\` and \`filter\`, \`sort\` rearranges the array in place *and* returns it. If someone else is holding that array, you just changed their data. Copy first:

\`\`\`js
const sorted = [...original].sort((a, b) => a - b);
\`\`\`

### Sorting objects

\`\`\`js
rooms.sort((a, b) => a.rate - b.rate);              // by number
guests.sort((a, b) => a.name.localeCompare(b.name)); // by text, properly
\`\`\`

\`localeCompare\` beats \`<\` for names because it handles accents and case sensibly.

To sort by one field then another, fall through on ties:

\`\`\`js
items.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
\`\`\`

\`||\` takes over when the first comparison returns \`0\`.

## YOUR TASK

1. \`sortNumbers(nums)\` — ascending, **without modifying the input array**.
2. \`sortByRate(rooms)\` — rooms (\`{ num, rate }\`) cheapest first, also without mutating.
3. \`leaderboard(players)\` — players (\`{ name, score }\`) by score descending, and alphabetically by name when scores tie.`,
    starterCode: `function sortNumbers(nums) {
}

function sortByRate(rooms) {
}

function leaderboard(players) {
}
`,
    testCode: `test("sortNumbers sorts numerically, not alphabetically", () => {
  expect(sortNumbers([10, 9, 100, 1])).toEqual([1, 9, 10, 100]);
});

test("sortNumbers leaves the input alone", () => {
  const input = [3, 1, 2];
  sortNumbers(input);
  expect(input).toEqual([3, 1, 2]);
});

test("sortByRate puts the cheapest first", () => {
  const rooms = [{ num: 1, rate: 300 }, { num: 2, rate: 100 }, { num: 3, rate: 200 }];
  expect(sortByRate(rooms).map((r) => r.num)).toEqual([2, 3, 1]);
});

test("sortByRate leaves the input alone", () => {
  const rooms = [{ num: 1, rate: 300 }, { num: 2, rate: 100 }];
  sortByRate(rooms);
  expect(rooms[0].num).toBe(1);
});

test("leaderboard sorts by score descending", () => {
  const players = [{ name: "A", score: 10 }, { name: "B", score: 30 }, { name: "C", score: 20 }];
  expect(leaderboard(players).map((p) => p.name)).toEqual(["B", "C", "A"]);
});

test("leaderboard breaks ties alphabetically", () => {
  const players = [{ name: "Zoe", score: 10 }, { name: "Adam", score: 10 }, { name: "Mia", score: 20 }];
  expect(leaderboard(players).map((p) => p.name)).toEqual(["Mia", "Adam", "Zoe"]);
});`,
    hints: [
      'Copy before sorting: `[...nums].sort(...)`.',
      'The numeric comparator is `(a, b) => a - b` for ascending, `(a, b) => b - a` for descending.',
      'For the tie-break, chain with `||`: `(a, b) => b.score - a.score || a.name.localeCompare(b.name)`.',
    ],
    solution: `function sortNumbers(nums) {
  return [...nums].sort((a, b) => a - b);
}

function sortByRate(rooms) {
  return [...rooms].sort((a, b) => a.rate - b.rate);
}

function leaderboard(players) {
  return [...players].sort(
    (a, b) => b.score - a.score || a.name.localeCompare(b.name)
  );
}
`,
  },

  // ══════════ Objects & References ══════════
  {
    id: 'jsd-09-references',
    title: 'Values, References, and the Bug Everyone Ships Once',
    language: 'javascript',
    module: 'Objects & References',
    difficulty: 4,
    concepts: ['references', 'mutation', 'copying', 'equality'],
    instructions: `This lesson explains a bug you will otherwise write, be confused by, and lose an afternoon to.

Numbers, strings and booleans are **primitives**. A variable holds the value itself, so copying copies the value:

\`\`\`js
let a = 5;
let b = a;
b = 10;
a;          // still 5
\`\`\`

Objects and arrays are different. A variable holds a **reference** — an address. Copying copies the address, not the thing:

\`\`\`js
const a = { count: 5 };
const b = a;        // same object, second label
b.count = 10;
a.count;            // 10  ← a changed, because there is only one object
\`\`\`

Two names, one object. This is why passing an array into a function that sorts or pushes can silently rearrange data somewhere else in your program.

### Equality compares addresses

\`\`\`js
{ a: 1 } === { a: 1 }    // false — two different objects
[1,2] === [1,2]          // false
const x = { a: 1 };
x === x                  // true
\`\`\`

Identical contents, different addresses. That is why the test harness in these lessons offers \`toEqual\` (compares contents) alongside \`toBe\` (compares identity).

### Copying properly

\`\`\`js
const copy = { ...original };        // shallow copy of an object
const copy = [...original];          // shallow copy of an array
\`\`\`

**Shallow** matters. A spread copies one level deep; nested objects are still shared:

\`\`\`js
const a = { name: "x", tags: ["red"] };
const b = { ...a };
b.tags.push("blue");
a.tags;      // ["red", "blue"]  ← still shared
\`\`\`

For a deep copy, modern browsers and Node have \`structuredClone(value)\`.

> \`const\` does not mean immutable. It means the *variable* cannot be pointed at something else. \`const arr = []; arr.push(1);\` is perfectly legal.

## YOUR TASK

1. \`addTag(item, tag)\` — returns a **new** item object with \`tag\` appended to its \`tags\` array. The original item, and the original's \`tags\` array, must be untouched.
2. \`isSameObject(a, b)\` — \`true\` only when the two arguments are literally the same object in memory.`,
    starterCode: `function addTag(item, tag) {
  // return a new object; do not mutate item or item.tags
}

function isSameObject(a, b) {
}
`,
    testCode: `test("addTag returns an item carrying the new tag", () => {
  const item = { name: "chair", tags: ["wood"] };
  expect(addTag(item, "brown").tags).toEqual(["wood", "brown"]);
});

test("addTag does not mutate the original item", () => {
  const item = { name: "chair", tags: ["wood"] };
  addTag(item, "brown");
  expect(item.tags).toEqual(["wood"]);
});

test("addTag returns a different object", () => {
  const item = { name: "chair", tags: ["wood"] };
  expect(addTag(item, "brown")).not.toBe(item);
});

test("addTag keeps the other fields", () => {
  const item = { name: "chair", tags: [], price: 40 };
  expect(addTag(item, "new")).toEqual({ name: "chair", tags: ["new"], price: 40 });
});

test("isSameObject distinguishes identity from equality", () => {
  const x = { a: 1 };
  expect(isSameObject(x, x)).toBe(true);
  expect(isSameObject({ a: 1 }, { a: 1 })).toBe(false);
});`,
    hints: [
      'Spread the item to copy its fields, then override `tags` with a fresh array.',
      '`[...item.tags, tag]` builds a new array rather than pushing into the old one.',
      '`isSameObject` is just `a === b` — for objects, `===` already compares identity.',
    ],
    solution: `function addTag(item, tag) {
  return { ...item, tags: [...item.tags, tag] };
}

function isSameObject(a, b) {
  return a === b;
}
`,
  },
  {
    id: 'jsd-10-destructuring',
    title: 'Destructuring',
    language: 'javascript',
    module: 'Objects & References',
    difficulty: 3,
    concepts: ['destructuring', 'default-values', 'rest'],
    instructions: `**Destructuring** pulls values out of objects and arrays into variables in one line. Modern JavaScript is written in it, so reading it fluently is not optional.

\`\`\`js
const guest = { name: "Ada", nights: 3, room: 204 };

const { name, nights } = guest;
// name = "Ada", nights = 3
\`\`\`

The braces on the *left* of \`=\` are not an object — they are a pattern. Each name matches a key.

### Renaming and defaults

\`\`\`js
const { name: guestName } = guest;        // rename while unpacking
const { pets = 0 } = guest;               // default when the key is missing
const { name, ...rest } = guest;          // rest = { nights: 3, room: 204 }
\`\`\`

### Arrays destructure by position

\`\`\`js
const [first, second] = [10, 20, 30];     // 10, 20
const [head, ...tail] = [10, 20, 30];     // 10, [20, 30]
const [, , third] = [10, 20, 30];         // skip with empty slots
\`\`\`

### In parameters — the big one

\`\`\`js
function describe({ name, nights = 1 }) {
  return \`\${name} for \${nights} night(s)\`;
}
describe({ name: "Ada" });        // "Ada for 1 night(s)"
\`\`\`

The function signature now documents exactly which fields it needs. This is the standard way to write functions that take an options object, and you will see it in every React codebase:

\`\`\`js
function Button({ label, onClick, disabled = false }) { ... }
\`\`\`

> Destructuring a property of \`undefined\` throws. \`const { a } = undefined\` crashes — which is why the default-parameter form \`function f({ a } = {})\` is common.

## YOUR TASK

1. \`describeGuest(guest)\` — takes \`{ name, nights }\` and returns \`"Ada stayed 3 nights"\`. Destructure **in the parameter list**, and default \`nights\` to \`1\` when it is missing.
2. \`splitFirst(items)\` — returns \`{ first, rest }\` where \`first\` is the first element and \`rest\` is an array of the others. For an empty input, \`first\` should be \`null\` and \`rest\` an empty array.`,
    starterCode: `function describeGuest({ }) {
  // destructure name and nights in the parameter list above
}

function splitFirst(items) {
}
`,
    testCode: `test("describeGuest uses both fields", () => {
  expect(describeGuest({ name: "Ada", nights: 3 })).toBe("Ada stayed 3 nights");
});

test("describeGuest defaults nights to 1", () => {
  expect(describeGuest({ name: "Alan" })).toBe("Alan stayed 1 nights");
});

test("splitFirst separates head from tail", () => {
  expect(splitFirst([1, 2, 3])).toEqual({ first: 1, rest: [2, 3] });
});

test("splitFirst on a single item leaves an empty rest", () => {
  expect(splitFirst(["only"])).toEqual({ first: "only", rest: [] });
});

test("splitFirst on an empty array returns null and an empty array", () => {
  expect(splitFirst([])).toEqual({ first: null, rest: [] });
});`,
    hints: [
      'The parameter pattern is `{ name, nights = 1 }` — the default goes right in the pattern.',
      'For `splitFirst`, array destructuring with rest does the work: `const [first, ...rest] = items;`',
      'Destructuring an empty array gives `undefined` for `first`, so convert it: `first ?? null`.',
    ],
    solution: `function describeGuest({ name, nights = 1 }) {
  return \`\${name} stayed \${nights} nights\`;
}

function splitFirst(items) {
  const [first, ...rest] = items;
  return { first: first ?? null, rest };
}
`,
  },
  {
    id: 'jsd-11-immutable-updates',
    title: 'Spread, Rest, and Immutable Updates',
    language: 'javascript',
    module: 'Objects & References',
    difficulty: 4,
    concepts: ['spread', 'rest', 'immutability', 'state-updates'],
    instructions: `The \`...\` operator does two opposite jobs depending on where it sits.

**Spread** — unpacking, on the right of \`=\` or inside a call:

\`\`\`js
const merged = { ...defaults, ...overrides };   // later keys win
const combined = [...listA, ...listB];
Math.max(...numbers);                            // array → arguments
\`\`\`

**Rest** — collecting, in a parameter list or destructuring pattern:

\`\`\`js
function sum(...nums) { ... }        // nums is a real array
const { id, ...fields } = record;    // everything except id
\`\`\`

### Immutable updates

This is the pattern the whole modern front-end runs on. Instead of changing an object, you produce a new one with the change applied:

\`\`\`js
// mutating — avoid
user.name = "New";

// immutable — prefer
const updated = { ...user, name: "New" };
\`\`\`

For arrays, the immutable equivalents of the mutating methods:

\`\`\`js
[...items, newItem]                          // instead of push
items.filter((i) => i.id !== id)             // instead of splice
items.map((i) => i.id === id ? { ...i, done: true } : i)   // instead of items[n].done = true
\`\`\`

That last line is worth memorising. "Map over the list, replace the one that matches, leave the rest alone" is how every to-do list, cart and settings screen in React updates a single item.

### Why bother

Because change detection gets cheap and reliable. If updating always produces a *new* object, then "did anything change?" is one \`!==\` comparison instead of a deep walk. React, Redux and every state library are built on that assumption — mutate in place and your screen silently stops updating.

## YOUR TASK

Given tasks shaped \`{ id, title, done }\`:

1. \`addTask(tasks, task)\` — a new array with the task appended.
2. \`completeTask(tasks, id)\` — a new array where the matching task has \`done: true\`. Every other task object must be left completely alone.
3. \`removeTask(tasks, id)\` — a new array without that task.

None of these may mutate the array they are given.`,
    starterCode: `function addTask(tasks, task) {
}

function completeTask(tasks, id) {
}

function removeTask(tasks, id) {
}
`,
    testCode: `const TASKS = [
  { id: 1, title: "Write tests", done: false },
  { id: 2, title: "Fix bug", done: false },
];

test("addTask appends without mutating", () => {
  const next = addTask(TASKS, { id: 3, title: "Ship", done: false });
  expect(next).toHaveLength(3);
  expect(TASKS).toHaveLength(2);
});

test("completeTask marks the right task", () => {
  const next = completeTask(TASKS, 2);
  expect(next[1].done).toBe(true);
  expect(next[0].done).toBe(false);
});

test("completeTask does not mutate the original task object", () => {
  const next = completeTask(TASKS, 1);
  expect(TASKS[0].done).toBe(false);
  expect(next[0]).not.toBe(TASKS[0]);
});

test("completeTask leaves untouched tasks as the same object", () => {
  const next = completeTask(TASKS, 1);
  expect(next[1]).toBe(TASKS[1]);
});

test("removeTask drops only the matching task", () => {
  const next = removeTask(TASKS, 1);
  expect(next).toEqual([{ id: 2, title: "Fix bug", done: false }]);
  expect(TASKS).toHaveLength(2);
});`,
    hints: [
      '`addTask` is `[...tasks, task]`.',
      '`completeTask` maps and uses a ternary: matching id gets `{ ...t, done: true }`, everything else returns `t` unchanged.',
      'Returning `t` itself for non-matches is what makes the "same object" test pass — do not copy what you did not change.',
    ],
    solution: `function addTask(tasks, task) {
  return [...tasks, task];
}

function completeTask(tasks, id) {
  return tasks.map((t) => (t.id === id ? { ...t, done: true } : t));
}

function removeTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}
`,
  },
  {
    id: 'jsd-12-nullish',
    title: 'Optional Chaining and Nullish Values',
    language: 'javascript',
    module: 'Objects & References',
    difficulty: 3,
    concepts: ['optional-chaining', 'nullish-coalescing', 'truthiness', 'defensive-coding'],
    instructions: `"Cannot read properties of undefined" is the most common runtime error in JavaScript. Two operators exist specifically to prevent it.

### Optional chaining \`?.\`

\`\`\`js
user.address.city          // throws if address is undefined
user.address?.city         // undefined instead of a crash
user.getName?.()           // only calls it if it exists
list?.[0]                  // safe index access
\`\`\`

\`?.\` short-circuits: if the thing on its left is \`null\` or \`undefined\`, the whole expression stops and evaluates to \`undefined\`.

### Nullish coalescing \`??\`

\`\`\`js
const port = config.port ?? 3000;
\`\`\`

"Use the left side unless it is \`null\` or \`undefined\`." Compare with \`||\`, which falls back on **any** falsy value:

\`\`\`js
const count = input || 10;    // 0 becomes 10   ← bug
const count = input ?? 10;    // 0 stays 0      ← correct
\`\`\`

The falsy values in JavaScript are: \`false\`, \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`. Whenever \`0\` or the empty string is a *legitimate* value — quantities, scores, search terms — \`||\` will quietly corrupt it. This exact bug has shipped in a great many production systems.

### Together

\`\`\`js
const city = user?.address?.city ?? "Unknown";
\`\`\`

One line that cannot throw and always produces a string.

> Do not scatter \`?.\` everywhere. Each one says "this might legitimately be missing". If a value should always exist, you want it to crash loudly during development rather than silently produce \`undefined\` at 2am.

## YOUR TASK

1. \`cityOf(user)\` — returns \`user.address.city\`, or \`"Unknown"\` if the user, the address, or the city is missing.
2. \`pageSize(config)\` — returns \`config.pageSize\`, defaulting to \`20\` only when it is genuinely absent. A configured \`0\` must survive.`,
    starterCode: `function cityOf(user) {
}

function pageSize(config) {
}
`,
    testCode: `test("cityOf reads a nested city", () => {
  expect(cityOf({ address: { city: "Lisbon" } })).toBe("Lisbon");
});

test("cityOf survives a missing address", () => {
  expect(cityOf({ name: "Ada" })).toBe("Unknown");
});

test("cityOf survives a missing user", () => {
  expect(cityOf(undefined)).toBe("Unknown");
  expect(cityOf(null)).toBe("Unknown");
});

test("pageSize uses the configured value", () => {
  expect(pageSize({ pageSize: 50 })).toBe(50);
});

test("pageSize defaults when absent", () => {
  expect(pageSize({})).toBe(20);
});

test("pageSize keeps a configured zero", () => {
  expect(pageSize({ pageSize: 0 })).toBe(0);
});`,
    hints: [
      'Chain the optional access at every level that could be missing: `user?.address?.city`.',
      'Finish with `?? "Unknown"` to convert the undefined into your fallback.',
      'For `pageSize`, `??` is required — `||` would turn a configured `0` into `20`.',
    ],
    solution: `function cityOf(user) {
  return user?.address?.city ?? "Unknown";
}

function pageSize(config) {
  return config?.pageSize ?? 20;
}
`,
  },

  // ══════════ Structure ══════════
  {
    id: 'jsd-13-classes',
    title: 'Classes',
    language: 'javascript',
    module: 'Structuring Code',
    difficulty: 3,
    concepts: ['classes', 'constructors', 'methods', 'encapsulation'],
    instructions: `A **class** is a template for objects that share both data and behaviour.

\`\`\`js
class Account {
  #balance = 0;                    // private field — the # is part of the name

  constructor(owner, balance = 0) {
    this.owner = owner;
    this.#balance = balance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Deposit must be positive");
    this.#balance += amount;
    return this;                   // returning this allows chaining
  }

  get balance() {                  // a getter: read like a property
    return this.#balance;
  }
}

const a = new Account("Ada", 100);
a.deposit(50);
a.balance;      // 150
a.#balance;     // SyntaxError — genuinely private
\`\`\`

The pieces:

- \`new\` creates a fresh object and runs \`constructor\`.
- \`this\` refers to that object.
- Methods are shared by every instance rather than copied into each one.
- \`#field\` is truly private — enforced by the language, not by convention.
- \`get\` makes a method readable as a property.

### Classes or closures?

Both give you private state. Rough guidance: classes when you will have **many instances** of a thing with identity (\`Account\`, \`Vector\`, \`Timer\`), plain objects and functions for everything else. JavaScript, unlike Java, does not require you to put everything in a class — and over-classing is a common junior tell.

### The \`this\` trap

\`this\` is decided by *how a function is called*, not where it was defined:

\`\`\`js
const fn = a.deposit;
fn(50);        // TypeError — this is undefined
\`\`\`

Fixes: call it as \`a.deposit(50)\`, or bind it (\`a.deposit.bind(a)\`), or define the method as an arrow-function field. Interviewers ask about this.

## YOUR TASK

Write a \`Playlist\` class:

- \`constructor(name)\` — stores the name, starts with an empty track list.
- \`add(title, seconds)\` — appends \`{ title, seconds }\` and returns \`this\` so calls can chain.
- \`get count\` — how many tracks.
- \`get duration\` — total seconds.
- \`longest()\` — the title of the longest track, or \`null\` when empty.`,
    starterCode: `class Playlist {
  constructor(name) {
  }

  add(title, seconds) {
  }

  get count() {
  }

  get duration() {
  }

  longest() {
  }
}
`,
    testCode: `test("a new playlist is empty", () => {
  const p = new Playlist("Focus");
  expect(p.name).toBe("Focus");
  expect(p.count).toBe(0);
  expect(p.duration).toBe(0);
});

test("add stores tracks", () => {
  const p = new Playlist("Focus");
  p.add("One", 200);
  p.add("Two", 100);
  expect(p.count).toBe(2);
  expect(p.duration).toBe(300);
});

test("add returns this so calls chain", () => {
  const p = new Playlist("Focus");
  expect(p.add("One", 200)).toBe(p);
  p.add("Two", 10).add("Three", 20);
  expect(p.count).toBe(3);
});

test("longest finds the longest track", () => {
  const p = new Playlist("Focus");
  p.add("Short", 100).add("Epic", 900).add("Middle", 400);
  expect(p.longest()).toBe("Epic");
});

test("longest returns null on an empty playlist", () => {
  expect(new Playlist("Empty").longest()).toBeNull();
});

test("playlists are independent", () => {
  const a = new Playlist("A");
  const b = new Playlist("B");
  a.add("x", 10);
  expect(b.count).toBe(0);
});`,
    hints: [
      'In the constructor: `this.name = name;` and `this.tracks = [];`',
      '`add` pushes then returns `this`. `count` is `this.tracks.length`; `duration` is a `reduce`.',
      'For `longest`, guard the empty case first, then reduce keeping whichever track has more seconds — and return its `.title`, not the object.',
    ],
    solution: `class Playlist {
  constructor(name) {
    this.name = name;
    this.tracks = [];
  }

  add(title, seconds) {
    this.tracks.push({ title, seconds });
    return this;
  }

  get count() {
    return this.tracks.length;
  }

  get duration() {
    return this.tracks.reduce((acc, t) => acc + t.seconds, 0);
  }

  longest() {
    if (this.tracks.length === 0) return null;
    return this.tracks.reduce((best, t) => (t.seconds > best.seconds ? t : best)).title;
  }
}
`,
  },
  {
    id: 'jsd-14-errors',
    title: 'Errors: Failing on Purpose',
    language: 'javascript',
    module: 'Structuring Code',
    difficulty: 4,
    concepts: ['errors', 'try-catch', 'custom-errors', 'validation'],
    instructions: `Beginner code assumes everything works. Professional code decides, deliberately, what happens when it does not.

### Throwing

\`\`\`js
function withdraw(balance, amount) {
  if (amount <= 0) throw new Error("Amount must be positive");
  if (amount > balance) throw new Error("Insufficient funds");
  return balance - amount;
}
\`\`\`

\`throw\` stops the function immediately and unwinds outward until something catches it. Throwing early on bad input — a **guard clause** — keeps the rest of the function free of nested \`if\`s.

### Catching

\`\`\`js
try {
  const result = risky();
} catch (err) {
  console.error(err.message);
} finally {
  cleanup();          // runs either way
}
\`\`\`

Catch only what you can actually handle. A \`catch\` that swallows the error and continues is worse than no \`catch\` at all — the program limps on in a broken state and the real cause is now invisible.

\`\`\`js
try { save(); } catch (e) {}          // never do this
\`\`\`

### Custom error types

\`\`\`js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

try {
  validate(form);
} catch (err) {
  if (err instanceof ValidationError) {
    showFieldError(err.field);       // expected: handle it
  } else {
    throw err;                       // unexpected: let it go up
  }
}
\`\`\`

Distinguishing *expected* failures (bad user input) from *unexpected* ones (a bug) is the core skill here. Expected failures get handled; unexpected ones should reach your error reporting, not be quietly absorbed.

### Errors are not the only tool

For a lookup that legitimately finds nothing, returning \`null\` beats throwing. Reserve exceptions for "this should not happen" and for input you refuse to accept.

## YOUR TASK

1. A \`ValidationError\` class extending \`Error\`, with a \`field\` property and \`name\` set to \`"ValidationError"\`.
2. \`validateBooking(booking)\` — throws a \`ValidationError\` when \`nights\` is missing or not a positive number (field \`"nights"\`), or when \`guest\` is missing or an empty string (field \`"guest"\`). Check \`guest\` first. Returns \`true\` when the booking is fine.
3. \`safeValidate(booking)\` — calls \`validateBooking\` and returns \`{ ok: true }\` or \`{ ok: false, field }\`, never throwing.`,
    starterCode: `class ValidationError extends Error {
  constructor(field, message) {
    // call super, then set name and field
  }
}

function validateBooking(booking) {
}

function safeValidate(booking) {
}
`,
    testCode: `test("a valid booking passes", () => {
  expect(validateBooking({ guest: "Ada", nights: 2 })).toBe(true);
});

test("a missing guest throws", () => {
  expect(() => validateBooking({ nights: 2 })).toThrow();
  expect(() => validateBooking({ guest: "", nights: 2 })).toThrow();
});

test("bad nights throw", () => {
  expect(() => validateBooking({ guest: "Ada", nights: 0 })).toThrow();
  expect(() => validateBooking({ guest: "Ada" })).toThrow();
  expect(() => validateBooking({ guest: "Ada", nights: -1 })).toThrow();
});

test("the thrown error is a ValidationError carrying the field", () => {
  try {
    validateBooking({ guest: "Ada", nights: 0 });
  } catch (err) {
    expect(err).toBeInstanceOf(ValidationError);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("ValidationError");
    expect(err.field).toBe("nights");
  }
});

test("guest is checked before nights", () => {
  try {
    validateBooking({ nights: 0 });
  } catch (err) {
    expect(err.field).toBe("guest");
  }
});

test("safeValidate reports success without throwing", () => {
  expect(safeValidate({ guest: "Ada", nights: 2 })).toEqual({ ok: true });
});

test("safeValidate reports the failing field", () => {
  expect(safeValidate({ guest: "Ada", nights: 0 })).toEqual({ ok: false, field: "nights" });
});`,
    hints: [
      '`super(message)` must be the first statement in the constructor, before you touch `this`.',
      'Guard clauses read best: check guest, throw; check nights, throw; then `return true`.',
      '`safeValidate` wraps the call in try/catch and returns an object from each branch.',
    ],
    solution: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function validateBooking(booking) {
  if (!booking.guest) {
    throw new ValidationError("guest", "Guest name is required");
  }
  if (typeof booking.nights !== "number" || booking.nights <= 0) {
    throw new ValidationError("nights", "Nights must be a positive number");
  }
  return true;
}

function safeValidate(booking) {
  try {
    validateBooking(booking);
    return { ok: true };
  } catch (err) {
    if (err instanceof ValidationError) return { ok: false, field: err.field };
    throw err;
  }
}
`,
  },
  {
    id: 'jsd-15-json',
    title: 'JSON: How Data Travels',
    language: 'javascript',
    module: 'Structuring Code',
    difficulty: 3,
    concepts: ['json', 'serialisation', 'parsing', 'apis'],
    instructions: `Two programs cannot pass each other a JavaScript object. They can only pass **text**. JSON is the agreed way to write data as text, and it is what nearly every API on the internet speaks.

\`\`\`js
JSON.stringify({ name: "Ada", nights: 3 })
// '{"name":"Ada","nights":3}'

JSON.parse('{"name":"Ada","nights":3}')
// { name: "Ada", nights: 3 }
\`\`\`

### JSON is stricter than JavaScript

- Keys must be in double quotes. Strings too — never single.
- No trailing commas, no comments.
- Only these types: string, number, boolean, null, array, object.

Notably absent: \`undefined\`, functions, \`Date\`, \`Map\`, \`Set\`, \`Infinity\`, \`NaN\`.

\`\`\`js
JSON.stringify({ a: undefined, b: () => 1, c: new Date(0) });
// '{"c":"1970-01-01T00:00:00.000Z"}'
\`\`\`

\`undefined\` and the function vanished silently. The \`Date\` became a string — and \`JSON.parse\` will *not* turn it back into a \`Date\`. Round-tripping is lossy, and forgetting that is a classic source of "why is my date a string?".

### Parsing can throw

\`JSON.parse\` throws a \`SyntaxError\` on malformed input. Any time the text came from a network, a file, or a user, that is a real possibility:

\`\`\`js
function safeParse(text, fallback = null) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}
\`\`\`

This is one of the few places where catching and moving on is right: you know exactly what went wrong and what to do about it.

### Pretty printing

\`JSON.stringify(value, null, 2)\` indents by two spaces — invaluable when debugging.

## YOUR TASK

1. \`safeParse(text, fallback)\` — parses, or returns \`fallback\` (default \`null\`) if the text is not valid JSON.
2. \`toQuery(obj)\` — turns \`{ a: 1, b: "x" }\` into \`"a=1&b=x"\`, in key order, with values URL-encoded via \`encodeURIComponent\`. Skip keys whose value is \`null\` or \`undefined\`. An empty object gives \`""\`.`,
    starterCode: `function safeParse(text, fallback = null) {
}

function toQuery(obj) {
}
`,
    testCode: `test("safeParse parses valid JSON", () => {
  expect(safeParse('{"a":1}')).toEqual({ a: 1 });
  expect(safeParse('[1,2]')).toEqual([1, 2]);
});

test("safeParse returns null on malformed JSON", () => {
  expect(safeParse("{oops")).toBeNull();
});

test("safeParse honours a custom fallback", () => {
  expect(safeParse("nope", {})).toEqual({});
});

test("toQuery builds a query string", () => {
  expect(toQuery({ a: 1, b: "x" })).toBe("a=1&b=x");
});

test("toQuery encodes special characters", () => {
  expect(toQuery({ q: "a b&c" })).toBe("q=a%20b%26c");
});

test("toQuery skips null and undefined", () => {
  expect(toQuery({ a: 1, b: null, c: undefined, d: 2 })).toBe("a=1&d=2");
});

test("toQuery on an empty object is an empty string", () => {
  expect(toQuery({})).toBe("");
});

test("toQuery keeps a zero", () => {
  expect(toQuery({ page: 0 })).toBe("page=0");
});`,
    hints: [
      '`Object.entries(obj)` gives you `[key, value]` pairs you can filter and map.',
      'Filter with `([, v]) => v !== null && v !== undefined` — that keeps `0` and `""`.',
      'Finish with `.join("&")`; an empty array joins to `""` for free.',
    ],
    solution: `function safeParse(text, fallback = null) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function toQuery(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => \`\${k}=\${encodeURIComponent(v)}\`)
    .join("&");
}
`,
  },
  {
    id: 'jsd-16-quiz',
    title: 'Checkpoint: JavaScript Semantics',
    language: 'javascript',
    kind: 'quiz',
    module: 'Structuring Code',
    difficulty: 3,
    concepts: ['equality', 'coercion', 'hoisting', 'this', 'review'],
    instructions: `A checkpoint on the parts of JavaScript that get asked about in interviews and that cause the subtlest bugs. Answer each question, read the explanation whether you were right or wrong, then move on.

There is no code to write here — this is about being able to *predict* what JavaScript does.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'What does `[1, 2, 3] === [1, 2, 3]` evaluate to?',
        choices: ['true', 'false', 'It throws a TypeError', 'undefined'],
        answerIndex: 1,
        explanation:
          'false. Each literal creates a new array, and `===` on objects compares identity — the address in memory — not contents. To compare contents you need a deep-equality check, which is exactly why test frameworks provide toEqual alongside toBe.',
      },
      {
        id: 'q2',
        prompt: 'What is the value of `count` after `const count = 0 || 10;`?',
        choices: ['0', '10', 'null', 'NaN'],
        answerIndex: 1,
        explanation:
          '10. `||` falls back whenever the left side is falsy, and `0` is falsy. When zero is a legitimate value you want `??`, which only falls back on null and undefined. This distinction has caused real production bugs in quantity and price fields.',
      },
      {
        id: 'q3',
        prompt: 'Which of these does NOT create a new array?',
        choices: ['items.map(fn)', 'items.filter(fn)', 'items.sort(fn)', 'items.concat(other)'],
        answerIndex: 2,
        explanation:
          '`sort` mutates the array in place and returns the same array. `map`, `filter` and `concat` all return new arrays. If the array came from somewhere else, copy it first: `[...items].sort(...)`.',
      },
      {
        id: 'q4',
        prompt: 'What does `typeof null` return?',
        choices: ['"null"', '"undefined"', '"object"', '"boolean"'],
        answerIndex: 2,
        explanation:
          '"object" — a bug from 1995 that can never be fixed without breaking the web. To test for null you must use `value === null`. This is a classic interview trivia question, and the honest answer is "it is a historical wart".',
      },
      {
        id: 'q5',
        prompt: 'Inside a function, what determines the value of `this`?',
        choices: [
          'Where the function was defined',
          'How the function is called',
          'The file it lives in',
          'It is always the global object',
        ],
        answerIndex: 1,
        explanation:
          'How it is called. `obj.method()` sets `this` to obj; pulling the same function out into a variable and calling it loses that binding. Arrow functions are the exception — they capture `this` from where they were written, which is why they are preferred for callbacks.',
      },
      {
        id: 'q6',
        prompt: 'What does `JSON.parse(JSON.stringify({ when: new Date() }))` give you for `when`?',
        choices: ['A Date object', 'A string', 'undefined', 'A number of milliseconds'],
        answerIndex: 1,
        explanation:
          'A string. `stringify` converts a Date to an ISO string, and `parse` has no idea it was ever a Date. Round-tripping through JSON is lossy: Dates become strings, and undefined values and functions disappear entirely.',
      },
      {
        id: 'q7',
        prompt: 'Given `const a = { n: 1 }; const b = { ...a };` — what does `b.n = 2` do to `a.n`?',
        choices: ['a.n becomes 2', 'a.n stays 1', 'It throws, because a is const', 'a.n becomes undefined'],
        answerIndex: 1,
        explanation:
          'a.n stays 1. Spread made a genuine copy of the top level. But be careful: the copy is shallow, so a nested object or array inside `a` would still be shared between the two, and mutating it through `b` would be visible through `a`.',
      },
      {
        id: 'q8',
        prompt: 'What is the complexity difference between `array.includes(x)` and `set.has(x)`?',
        choices: [
          'They are the same',
          'includes is O(n), has is O(1) on average',
          'includes is O(1), has is O(n)',
          'Both are O(log n)',
        ],
        answerIndex: 1,
        explanation:
          '`includes` scans the array, so it is O(n). A Set hashes the value and is O(1) on average. Swapping an array for a Set when you are repeatedly asking "is this in here?" turns an O(n²) loop into O(n) — the single most common real-world optimisation there is.',
      },
    ],
  },
];
