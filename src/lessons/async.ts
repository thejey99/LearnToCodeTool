import type { LessonDraft } from '../types';

export const ASYNC_LESSONS: LessonDraft[] = [
  {
    id: 'as-01-event-loop',
    title: 'The Event Loop',
    language: 'javascript',
    module: 'How Waiting Works',
    difficulty: 3,
    concepts: ['event-loop', 'call-stack', 'task-queue', 'setTimeout'],
    instructions: `JavaScript runs your code on **one thread**. There is exactly one thing happening at a time. So how does a page stay responsive while waiting for a network request that takes two seconds?

It does not wait. It hands the slow job to the environment — the browser or Node — and carries on. When the job finishes, the environment puts your callback in a **queue**. The moment your current code finishes completely, the **event loop** takes the next callback from the queue and runs it.

\`\`\`js
console.log("first");
setTimeout(() => console.log("third"), 0);
console.log("second");

// first
// second
// third
\`\`\`

\`setTimeout(fn, 0)\` does not mean "run now". It means "run as soon as the current work is finished". Even with a zero delay, \`fn\` waits for the main script to complete.

### The consequence that matters

Because there is one thread, **a slow synchronous loop freezes everything** — no clicks, no scrolling, no rendering:

\`\`\`js
const start = Date.now();
while (Date.now() - start < 3000) {}   // the page is frozen for 3 seconds
\`\`\`

This is why anything genuinely slow must be asynchronous, and why "the tab is not responding" happens.

### Two queues, not one

Promise callbacks go in a **microtask** queue which is drained *completely* before the next timer callback:

\`\`\`js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");

// A, D, C, B
\`\`\`

Microtasks (\`C\`) jump ahead of timers (\`B\`). Predicting this ordering is a standard interview question, and understanding it is what stops async code feeling like magic.

## YOUR TASK

Predict, then verify. Complete the program so it prints exactly these four lines in this order:

\`\`\`
start
end
microtask
timeout
\`\`\`

Use \`console.log\`, one \`setTimeout(..., 0)\`, and one \`Promise.resolve().then(...)\`. Write them in the order that produces the output above — which is *not* the same as the order they appear in.`,
    starterCode: `console.log("start");

// add a setTimeout that logs "timeout"
// add a promise callback that logs "microtask"

console.log("end");
`,
    expectedOutput: ['start', 'end', 'microtask', 'timeout'],
    hints: [
      'Both the timer and the promise callback go between the two existing logs.',
      'You do not need to reorder anything to get "microtask" before "timeout" — the queues do that for you.',
      '`setTimeout(() => console.log("timeout"), 0);` and `Promise.resolve().then(() => console.log("microtask"));`',
    ],
    solution: `console.log("start");

setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("microtask"));

console.log("end");
`,
  },
  {
    id: 'as-02-promises',
    title: 'Promises',
    language: 'javascript',
    module: 'How Waiting Works',
    difficulty: 3,
    concepts: ['promises', 'then', 'resolve', 'reject'],
    instructions: `A **Promise** is an object representing a value that is not here yet. It is in one of three states: *pending*, *fulfilled* with a value, or *rejected* with a reason. Once it settles it never changes again.

\`\`\`js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve(42), 100);
});

p.then((value) => console.log(value));   // 42, a moment later
\`\`\`

The function you pass to \`new Promise\` runs immediately and is handed two functions: call \`resolve(value)\` on success, \`reject(error)\` on failure.

### Why promises replaced callbacks

The old way nested callbacks inside callbacks:

\`\`\`js
getUser(id, (user) => {
  getOrders(user, (orders) => {
    getItems(orders[0], (items) => {
      // three levels deep, and error handling at every one
    });
  });
});
\`\`\`

Promises flatten that, because \`.then\` returns a promise:

\`\`\`js
getUser(id)
  .then((user) => getOrders(user))
  .then((orders) => getItems(orders[0]))
  .then((items) => console.log(items))
  .catch((err) => console.error(err));      // one place for every failure
\`\`\`

Returning a promise from inside \`.then\` makes the chain wait for it. Returning a plain value passes it straight along.

### The utility you will write constantly

\`\`\`js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
\`\`\`

Memorise that line. It is the standard way to pause without blocking, and it appears in almost every real codebase.

> \`.catch\` catches rejections from *anywhere earlier* in the chain. That is the main reason chains beat nested callbacks — one handler covers every step.

## YOUR TASK

1. \`delay(ms)\` — returns a promise that resolves after \`ms\` milliseconds.
2. \`delayedValue(value, ms)\` — resolves with \`value\` after the delay.
3. \`maybeFail(shouldFail)\` — returns a promise that resolves with \`"ok"\` when \`shouldFail\` is false, and rejects with \`new Error("failed")\` when it is true.

The tests are asynchronous and will await your promises.`,
    starterCode: `function delay(ms) {
}

function delayedValue(value, ms) {
}

function maybeFail(shouldFail) {
}
`,
    testCode: `test("delay returns a promise", () => {
  expect(delay(1)).toBeInstanceOf(Promise);
});

test("delay actually waits", async () => {
  const start = Date.now();
  await delay(30);
  expect(Date.now() - start).toBeGreaterThan(20);
});

test("delayedValue resolves with the value", async () => {
  expect(await delayedValue("hello", 5)).toBe("hello");
  expect(await delayedValue(7, 1)).toBe(7);
});

test("maybeFail resolves when it should not fail", async () => {
  expect(await maybeFail(false)).toBe("ok");
});

test("maybeFail rejects when it should", async () => {
  let caught = null;
  try {
    await maybeFail(true);
  } catch (err) {
    caught = err;
  }
  expect(caught).toBeInstanceOf(Error);
  expect(caught.message).toBe("failed");
});`,
    hints: [
      '`delay` is the one-liner from the lesson: `new Promise((resolve) => setTimeout(resolve, ms))`.',
      '`delayedValue` can reuse it: `return delay(ms).then(() => value);`',
      '`maybeFail` needs no timer at all — `Promise.resolve("ok")` and `Promise.reject(new Error("failed"))` are enough.',
    ],
    solution: `function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function delayedValue(value, ms) {
  return delay(ms).then(() => value);
}

function maybeFail(shouldFail) {
  return shouldFail
    ? Promise.reject(new Error("failed"))
    : Promise.resolve("ok");
}
`,
  },
  {
    id: 'as-03-async-await',
    title: 'async / await',
    language: 'javascript',
    module: 'Writing Async Code',
    difficulty: 3,
    concepts: ['async-await', 'promises', 'error-handling'],
    instructions: `\`async\`/\`await\` is syntax that lets you write promise code in a straight line.

\`\`\`js
// with .then
function loadUser(id) {
  return fetchUser(id).then((user) => user.name);
}

// with async/await
async function loadUser(id) {
  const user = await fetchUser(id);
  return user.name;
}
\`\`\`

Two rules, and they are the whole feature:

1. \`await\` pauses the function until the promise settles, then gives you the value.
2. An \`async\` function **always returns a promise**, whatever you return inside it.

That second rule surprises people:

\`\`\`js
async function five() { return 5; }
five();          // Promise { 5 }, not 5
await five();    // 5
\`\`\`

There is no way to get a synchronous value out of an async function. Async is contagious — once something in your call chain waits, every caller must either await it or handle the promise. This is by design.

### Errors become ordinary

\`\`\`js
async function load(id) {
  try {
    const user = await fetchUser(id);
    return user.name;
  } catch (err) {
    return "Unknown";
  }
}
\`\`\`

A rejected promise, when awaited, **throws** — so \`try/catch\` works exactly as it does for synchronous code. That unification is the real gift of \`await\`.

### The mistake to avoid

\`\`\`js
async function slow(ids) {
  const out = [];
  for (const id of ids) {
    out.push(await fetchUser(id));    // waits for each one in turn
  }
  return out;
}
\`\`\`

Three requests of 100ms take 300ms here. If they do not depend on each other, they should run at the same time — which is the next lesson.

## YOUR TASK

Using \`async\`/\`await\`, and the provided \`fetchUser\` fake:

1. \`getName(id)\` — awaits \`fetchUser(id)\` and returns the user's \`name\`.
2. \`getNameSafe(id)\` — the same, but returns the string \`"Unknown"\` if \`fetchUser\` rejects.
3. \`getNamesInOrder(ids)\` — returns an array of names, awaiting one at a time. (Deliberately the slow version; you will fix it next lesson.)`,
    starterCode: `// Provided: a fake data source. Ids 1-3 exist; anything else rejects.
const USERS = { 1: "Ada", 2: "Alan", 3: "Grace" };

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (USERS[id]) resolve({ id, name: USERS[id] });
      else reject(new Error("No user " + id));
    }, 10);
  });
}

async function getName(id) {
}

async function getNameSafe(id) {
}

async function getNamesInOrder(ids) {
}
`,
    testCode: `test("getName resolves the name", async () => {
  expect(await getName(1)).toBe("Ada");
  expect(await getName(3)).toBe("Grace");
});

test("getName propagates the rejection", async () => {
  let threw = false;
  try { await getName(99); } catch { threw = true; }
  expect(threw).toBe(true);
});

test("getNameSafe swallows the failure", async () => {
  expect(await getNameSafe(99)).toBe("Unknown");
});

test("getNameSafe still returns real names", async () => {
  expect(await getNameSafe(2)).toBe("Alan");
});

test("getNamesInOrder returns every name in order", async () => {
  expect(await getNamesInOrder([3, 1, 2])).toEqual(["Grace", "Ada", "Alan"]);
});

test("getNamesInOrder handles an empty list", async () => {
  expect(await getNamesInOrder([])).toEqual([]);
});

test("async functions return promises", () => {
  expect(getName(1)).toBeInstanceOf(Promise);
});`,
    hints: [
      '`const user = await fetchUser(id); return user.name;`',
      'For the safe version, wrap those two lines in `try` and `return "Unknown"` from the `catch`.',
      'For the list, a `for...of` loop with `await` inside, pushing into an array you return at the end.',
    ],
    solution: `const USERS = { 1: "Ada", 2: "Alan", 3: "Grace" };

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (USERS[id]) resolve({ id, name: USERS[id] });
      else reject(new Error("No user " + id));
    }, 10);
  });
}

async function getName(id) {
  const user = await fetchUser(id);
  return user.name;
}

async function getNameSafe(id) {
  try {
    const user = await fetchUser(id);
    return user.name;
  } catch {
    return "Unknown";
  }
}

async function getNamesInOrder(ids) {
  const names = [];
  for (const id of ids) {
    const user = await fetchUser(id);
    names.push(user.name);
  }
  return names;
}
`,
  },
  {
    id: 'as-04-parallel',
    title: 'Doing Things at the Same Time',
    language: 'javascript',
    module: 'Writing Async Code',
    difficulty: 4,
    concepts: ['promise-all', 'promise-allsettled', 'concurrency', 'performance'],
    instructions: `Awaiting in a loop is sequential. When the jobs do not depend on each other, that is wasted time.

\`\`\`js
// 300ms — each request waits for the last
for (const id of ids) results.push(await fetchUser(id));

// 100ms — all three in flight together
const results = await Promise.all(ids.map((id) => fetchUser(id)));
\`\`\`

\`Promise.all\` takes an array of promises and returns one promise that resolves to an array of all the values, **in the original order** regardless of which finished first.

The key move is \`.map\` with no \`await\` inside it. That starts every request immediately and hands back an array of pending promises; \`Promise.all\` then waits for the set.

### All-or-nothing

\`Promise.all\` rejects the instant *any* input rejects, and you lose the results that did succeed. Often that is what you want — if one part of a page fails, show an error. When it is not, use \`Promise.allSettled\`:

\`\`\`js
const results = await Promise.allSettled(ids.map(fetchUser));
// [ { status: "fulfilled", value: {...} },
//   { status: "rejected",  reason: Error } ]

const users = results
  .filter((r) => r.status === "fulfilled")
  .map((r) => r.value);
\`\`\`

\`allSettled\` never rejects. It waits for everything and reports each outcome, which is what you want for "load ten widgets, show the eight that worked".

### The rest of the family

- \`Promise.race\` — settles with the first promise to settle, success or failure. Used for timeouts.
- \`Promise.any\` — the first to *succeed*; rejects only if all fail.

> Concurrency is not free. Firing 10,000 requests at once will get you rate-limited or run you out of sockets. Real systems batch, or use a concurrency limit.

## YOUR TASK

1. \`getAllNames(ids)\` — every name, fetched **in parallel**, in the original order. Rejects if any id fails.
2. \`getExistingNames(ids)\` — fetches in parallel but ignores failures, returning only the names that worked.

The tests check both correctness and that you are genuinely running in parallel: fetching three users at 30ms each must take well under 90ms.`,
    starterCode: `const USERS = { 1: "Ada", 2: "Alan", 3: "Grace" };

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (USERS[id]) resolve({ id, name: USERS[id] });
      else reject(new Error("No user " + id));
    }, 30);
  });
}

async function getAllNames(ids) {
}

async function getExistingNames(ids) {
}
`,
    testCode: `test("getAllNames returns names in the requested order", async () => {
  expect(await getAllNames([3, 1, 2])).toEqual(["Grace", "Ada", "Alan"]);
});

test("getAllNames runs the requests in parallel", async () => {
  const start = Date.now();
  await getAllNames([1, 2, 3]);
  expect(Date.now() - start).toBeLessThan(80);
});

test("getAllNames rejects when any id is missing", async () => {
  let threw = false;
  try { await getAllNames([1, 99]); } catch { threw = true; }
  expect(threw).toBe(true);
});

test("getExistingNames skips the failures", async () => {
  expect(await getExistingNames([1, 99, 2])).toEqual(["Ada", "Alan"]);
});

test("getExistingNames never rejects", async () => {
  expect(await getExistingNames([98, 99])).toEqual([]);
});

test("getExistingNames also runs in parallel", async () => {
  const start = Date.now();
  await getExistingNames([1, 2, 3]);
  expect(Date.now() - start).toBeLessThan(80);
});`,
    hints: [
      'Map first, await second: `const users = await Promise.all(ids.map((id) => fetchUser(id)));`',
      'Do not put `await` inside the `.map` callback — that would serialise the work again.',
      'For the forgiving version use `Promise.allSettled`, then filter for `status === "fulfilled"` and map to `r.value.name`.',
    ],
    solution: `const USERS = { 1: "Ada", 2: "Alan", 3: "Grace" };

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (USERS[id]) resolve({ id, name: USERS[id] });
      else reject(new Error("No user " + id));
    }, 30);
  });
}

async function getAllNames(ids) {
  const users = await Promise.all(ids.map((id) => fetchUser(id)));
  return users.map((u) => u.name);
}

async function getExistingNames(ids) {
  const results = await Promise.allSettled(ids.map((id) => fetchUser(id)));
  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value.name);
}
`,
  },
  {
    id: 'as-05-timeout-retry',
    title: 'Timeouts and Retries',
    language: 'javascript',
    module: 'Async in Production',
    difficulty: 5,
    concepts: ['promise-race', 'retry', 'backoff', 'resilience'],
    instructions: `Networks fail. Not occasionally — constantly, at scale. Two patterns handle almost all of it, and being able to write them from memory is a genuine differentiator in an interview.

### Timeout

A request that never answers is worse than one that fails, because it holds resources and the user stares at a spinner forever. \`Promise.race\` gives you a deadline:

\`\`\`js
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}
\`\`\`

Whichever settles first wins. Note what this does *not* do: the original request keeps running in the background. Truly cancelling it needs \`AbortController\`, which is what \`fetch\` supports.

### Retry with exponential backoff

\`\`\`js
async function retry(fn, attempts = 3, baseDelay = 100) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;       // out of tries: give up loudly
      await delay(baseDelay * 2 ** i);         // 100ms, 200ms, 400ms …
    }
  }
}
\`\`\`

Why *exponential*? Because a fixed short retry is how you turn a struggling server into a dead one. Backing off gives it room to recover. Production systems add **jitter** — a small random offset — so that a thousand clients do not all retry on the same tick.

### What not to retry

Retrying is only safe for **idempotent** operations — ones where doing it twice is the same as doing it once. Retrying a failed \`GET\` is fine. Retrying "charge this card" can bill the customer twice. And a \`400 Bad Request\` will never succeed no matter how many times you ask, so retrying only wastes time. Retry on timeouts and 5xx; not on 4xx.

## YOUR TASK

1. \`withTimeout(promise, ms)\` — resolves with the promise's value if it settles in time, otherwise rejects with an \`Error\` whose message is \`"Timed out"\`.
2. \`retry(fn, attempts)\` — calls \`fn\`, returns its value; on rejection tries again up to \`attempts\` times total, waiting 10ms between tries, and re-throws the last error if all attempts fail.`,
    starterCode: `const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function withTimeout(promise, ms) {
}

async function retry(fn, attempts = 3) {
}
`,
    testCode: `const delayValue = (v, ms) => new Promise((r) => setTimeout(() => r(v), ms));

test("withTimeout passes a fast result through", async () => {
  expect(await withTimeout(delayValue("quick", 5), 100)).toBe("quick");
});

test("withTimeout rejects a slow promise", async () => {
  let msg = null;
  try {
    await withTimeout(delayValue("slow", 200), 20);
  } catch (err) {
    msg = err.message;
  }
  expect(msg).toBe("Timed out");
});

test("withTimeout keeps the original rejection", async () => {
  let msg = null;
  try {
    await withTimeout(Promise.reject(new Error("boom")), 100);
  } catch (err) {
    msg = err.message;
  }
  expect(msg).toBe("boom");
});

test("retry returns immediately on success", async () => {
  let calls = 0;
  const fn = async () => { calls++; return "ok"; };
  expect(await retry(fn, 3)).toBe("ok");
  expect(calls).toBe(1);
});

test("retry succeeds after failures", async () => {
  let calls = 0;
  const fn = async () => {
    calls++;
    if (calls < 3) throw new Error("flaky");
    return "recovered";
  };
  expect(await retry(fn, 3)).toBe("recovered");
  expect(calls).toBe(3);
});

test("retry re-throws once attempts run out", async () => {
  let calls = 0;
  const fn = async () => { calls++; throw new Error("always fails"); };
  let msg = null;
  try { await retry(fn, 3); } catch (err) { msg = err.message; }
  expect(msg).toBe("always fails");
  expect(calls).toBe(3);
});`,
    hints: [
      '`withTimeout` builds a second promise that only ever rejects, then races the two.',
      'In the timeout promise, ignore the resolve parameter: `new Promise((_, reject) => ...)`.',
      'In `retry`, the loop body is try/catch; rethrow when `i === attempts - 1`, otherwise `await delay(10)` and let the loop continue.',
    ],
    solution: `const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

async function retry(fn, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      await delay(10);
    }
  }
}
`,
  },
  {
    id: 'as-06-race-conditions',
    title: 'Race Conditions',
    language: 'javascript',
    module: 'Async in Production',
    difficulty: 5,
    concepts: ['race-conditions', 'cancellation', 'stale-responses', 'debounce'],
    instructions: `Here is a bug that only appears when the network is slow — which is to say, it works perfectly on your machine and breaks for users.

A search box fires a request per keystroke. The user types \`"ab"\`. Two requests go out. The response for \`"a"\` happens to come back *after* the response for \`"ab"\`, because networks do not guarantee order. Your screen now shows results for \`"a"\` while the box says \`"ab"\`.

\`\`\`js
input.addEventListener("input", async (e) => {
  const results = await search(e.target.value);
  render(results);        // whichever finishes last wins — not whichever is current
});
\`\`\`

Nothing here is wrong line by line. The bug is in the *timing*, and no amount of staring at a single line finds it.

### Fix: ignore stale responses

Tag each request and drop anything that is no longer the latest:

\`\`\`js
let latest = 0;

async function handleInput(query) {
  const id = ++latest;
  const results = await search(query);
  if (id !== latest) return;      // a newer request started; discard this one
  render(results);
}
\`\`\`

The check has to happen **after** the await, because that is where time passes.

### Related tools

- **Debounce** — wait until typing pauses before firing at all, which reduces the number of requests but does not by itself remove the race.
- **AbortController** — genuinely cancel the outgoing request so it never lands.

Both are worth knowing; the sequence check above is the one that makes correctness independent of timing.

## YOUR TASK

Write \`makeSearcher(searchFn, render)\` which returns an async \`search(query)\` function. It must call \`searchFn(query)\`, and only pass the result to \`render\` if no newer search has started since. Stale results are dropped silently.

The test fires a slow search followed by a fast one and checks that only the newer result is rendered.`,
    starterCode: `function makeSearcher(searchFn, render) {
  // track which request is the latest, and discard results from older ones

  return async function search(query) {
  };
}
`,
    testCode: `const delayValue = (v, ms) => new Promise((r) => setTimeout(() => r(v), ms));

test("renders the result of a single search", async () => {
  const rendered = [];
  const search = makeSearcher((q) => delayValue(q + "-result", 5), (r) => rendered.push(r));
  await search("a");
  expect(rendered).toEqual(["a-result"]);
});

test("drops a slow earlier result when a newer search finishes first", async () => {
  const rendered = [];
  const timings = { a: 60, ab: 5 };
  const search = makeSearcher(
    (q) => delayValue(q + "-result", timings[q]),
    (r) => rendered.push(r)
  );

  const slow = search("a");
  const fast = search("ab");
  await Promise.all([slow, fast]);

  expect(rendered).toEqual(["ab-result"]);
});

test("later searches still render normally", async () => {
  const rendered = [];
  const search = makeSearcher((q) => delayValue(q, 1), (r) => rendered.push(r));
  await search("one");
  await search("two");
  expect(rendered).toEqual(["one", "two"]);
});

test("each searcher tracks its own requests", async () => {
  const a = [], b = [];
  const s1 = makeSearcher((q) => delayValue(q, 1), (r) => a.push(r));
  const s2 = makeSearcher((q) => delayValue(q, 1), (r) => b.push(r));
  await Promise.all([s1("x"), s2("y")]);
  expect(a).toEqual(["x"]);
  expect(b).toEqual(["y"]);
});`,
    hints: [
      'Declare a counter in `makeSearcher`, outside the returned function — that closure is the whole mechanism.',
      'First line inside `search`: `const id = ++latest;`',
      'After awaiting, compare before rendering: `if (id !== latest) return;`',
    ],
    solution: `function makeSearcher(searchFn, render) {
  let latest = 0;

  return async function search(query) {
    const id = ++latest;
    const results = await searchFn(query);
    if (id !== latest) return;
    render(results);
  };
}
`,
  },
  {
    id: 'as-07-quiz',
    title: 'Checkpoint: Async Reasoning',
    language: 'javascript',
    kind: 'quiz',
    module: 'Async in Production',
    difficulty: 4,
    concepts: ['event-loop', 'promises', 'concurrency', 'review'],
    instructions: `Async questions come up in every JavaScript interview, usually as "what does this print". Work through each one before revealing the answer.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'What does `console.log(await Promise.resolve(1), 2)` print inside an async function?',
        choices: ['1 2', 'Promise 2', '2 1', 'It throws'],
        answerIndex: 0,
        explanation:
          '1 2. `await` unwraps the promise to its value before console.log runs. Without the await you would print the Promise object itself, which is the single most common async mistake.',
      },
      {
        id: 'q2',
        prompt: 'Three independent 100ms requests. Sequential awaits in a loop take roughly how long?',
        choices: ['100ms', '200ms', '300ms', 'It depends on the CPU'],
        answerIndex: 2,
        explanation:
          '300ms — each await blocks the loop until it resolves. `Promise.all` with a map would take about 100ms because all three are in flight at once. Spotting this pattern in a code review is a concrete way to show senior judgement.',
      },
      {
        id: 'q3',
        prompt: 'What happens to the other promises when one input to `Promise.all` rejects?',
        choices: [
          'They are cancelled',
          'They keep running, but their results are discarded',
          'Promise.all waits for all of them anyway',
          'They are retried automatically',
        ],
        answerIndex: 1,
        explanation:
          'They keep running — JavaScript has no built-in cancellation — but Promise.all rejects immediately and their results are thrown away. If you need every outcome, use Promise.allSettled. If you need to genuinely stop the work, you need AbortController.',
      },
      {
        id: 'q4',
        prompt: 'Which is safe to retry automatically after a network failure?',
        choices: [
          'POST /payments (charge a card)',
          'GET /orders/42',
          'POST /emails (send a message)',
          'All of them',
        ],
        answerIndex: 1,
        explanation:
          'The GET. It is idempotent: doing it twice has the same effect as doing it once. Retrying a charge or an email can duplicate a real-world side effect. Production APIs solve this with idempotency keys, which the Back-End track covers.',
      },
      {
        id: 'q5',
        prompt: 'A search box updates on every keystroke and sometimes shows results for an older query. The likeliest cause?',
        choices: [
          'The server is returning wrong data',
          'Responses arriving out of order, with no check for staleness',
          'setTimeout is inaccurate',
          'The event listener is registered twice',
        ],
        answerIndex: 1,
        explanation:
          'Out-of-order responses. Nothing guarantees that request 1 returns before request 2. The fix is to tag each request and ignore any response that is no longer the latest — or to cancel outright with AbortController.',
      },
      {
        id: 'q6',
        prompt: 'What does an `async` function return if its body returns the number 5?',
        choices: ['5', 'A promise that resolves to 5', 'undefined', 'It depends on the caller'],
        answerIndex: 1,
        explanation:
          'A promise resolving to 5. Async functions always return promises. This is why async is "contagious": every caller must await it or handle the promise, all the way up to some top-level entry point.',
      },
    ],
  },
];
