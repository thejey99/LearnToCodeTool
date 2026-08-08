import type { LessonDraft } from '../types';

export const INTERVIEW_LESSONS: LessonDraft[] = [
  {
    id: 'iv-01-anagrams',
    title: 'Group Anagrams',
    language: 'javascript',
    module: 'Classic Problems',
    difficulty: 4,
    concepts: ['hash-map', 'string-keys', 'grouping'],
    instructions: `> **How to use this track.** Solve the problem first without hints. Then, before moving on, say out loud: what the complexity is, why you chose that structure, and what you would do differently if the input were a million items. That narration is half of what an interview measures.

### The problem

Group words that are anagrams of one another.

\`\`\`
["eat", "tea", "tan", "ate", "nat", "bat"]
→ [["eat","tea","ate"], ["tan","nat"], ["bat"]]
\`\`\`

### Thinking it through

The naive approach compares every word with every other — O(n²·k). The insight that unlocks it: anagrams need a **canonical form**, a value that is identical for every member of a group and different for every other group.

Sort the letters. \`"eat"\`, \`"tea"\` and \`"ate"\` all become \`"aet"\`. Now the problem is just grouping by a key, which is a single pass over a Map.

That move — *find a canonical key, then group in one pass* — solves a whole family of problems, and naming it is what makes the solution sound designed rather than lucky.

Complexity: O(n · k log k) where k is the word length, dominated by sorting each word. If you are asked to remove the log: a 26-slot letter-count array joined into a string is a canonical key built in O(k). Mentioning that unprompted is a strong signal.

## YOUR TASK

\`groupAnagrams(words)\` — groups in the order each group was first encountered, with words inside a group in their original relative order.`,
    starterCode: `function groupAnagrams(words) {
}
`,
    testCode: `test("groups anagrams together", () => {
  expect(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])).toEqual([
    ["eat", "tea", "ate"],
    ["tan", "nat"],
    ["bat"],
  ]);
});

test("handles an empty input", () => {
  expect(groupAnagrams([])).toEqual([]);
});

test("handles a single word", () => {
  expect(groupAnagrams(["hello"])).toEqual([["hello"]]);
});

test("words with no anagram get their own group", () => {
  expect(groupAnagrams(["abc", "def"])).toEqual([["abc"], ["def"]]);
});

test("handles duplicates and empty strings", () => {
  expect(groupAnagrams(["", "", "a"])).toEqual([["", ""], ["a"]]);
});

test("stays fast on 20000 words", () => {
  const words = Array.from({ length: 20000 }, (_, i) => String(i % 500).padStart(4, "0"));
  const start = Date.now();
  groupAnagrams(words);
  expect(Date.now() - start).toBeLessThan(500);
});`,
    hints: [
      'The canonical key for a word is its letters sorted: `word.split("").sort().join("")`.',
      'A `Map` preserves insertion order, which gives you the group ordering for free.',
      'Return `[...groups.values()]` at the end.',
    ],
    solution: `function groupAnagrams(words) {
  const groups = new Map();

  for (const word of words) {
    const key = word.split("").sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }

  return [...groups.values()];
}
`,
  },
  {
    id: 'iv-02-lru',
    title: 'LRU Cache',
    language: 'javascript',
    module: 'Classic Problems',
    difficulty: 5,
    concepts: ['cache', 'map-ordering', 'eviction', 'design'],
    instructions: `A perennial design question, because it tests whether you know the *ordering* properties of your language's structures.

### The problem

A cache with a fixed capacity. \`get(key)\` returns the value or \`-1\`. \`put(key, value)\` inserts, and when the cache is full it evicts the **least recently used** entry. Reading counts as use.

Both operations must be O(1).

### The classic answer

A hash map for O(1) lookup, plus a doubly linked list for O(1) reordering: the map stores nodes, the list keeps them in recency order, and every access moves a node to the front.

### The JavaScript answer

\`Map\` already remembers insertion order, and \`map.keys().next().value\` gives you the oldest key. So "move to most recent" is delete-then-set:

\`\`\`js
if (cache.has(key)) {
  const value = cache.get(key);
  cache.delete(key);
  cache.set(key, value);    // now the newest
}
\`\`\`

Both statements are O(1), and the whole cache is 20 lines. In an interview: give this solution, and add that you know the underlying structure is a hash map plus a linked list — that you can use the built-in ordering *and* explain what it is doing is exactly the answer they want.

### Where this shows up for real

Every caching layer you will meet — browser caches, database buffer pools, CDNs — is an eviction policy on a bounded store. LRU is the default because recency predicts reuse well for most workloads.

## YOUR TASK

An \`LRUCache\` class with \`constructor(capacity)\`, \`get(key)\` returning the value or \`-1\`, \`put(key, value)\`, and a \`size\` getter.

Both a \`get\` and a \`put\` count as using a key.`,
    starterCode: `class LRUCache {
  constructor(capacity) {
  }

  get(key) {
  }

  put(key, value) {
  }

  get size() {
  }
}
`,
    testCode: `test("stores and retrieves", () => {
  const c = new LRUCache(2);
  c.put("a", 1);
  expect(c.get("a")).toBe(1);
  expect(c.size).toBe(1);
});

test("returns -1 for a missing key", () => {
  expect(new LRUCache(2).get("nope")).toBe(-1);
});

test("evicts the least recently used entry", () => {
  const c = new LRUCache(2);
  c.put("a", 1);
  c.put("b", 2);
  c.put("c", 3);
  expect(c.get("a")).toBe(-1);
  expect(c.get("b")).toBe(2);
  expect(c.get("c")).toBe(3);
  expect(c.size).toBe(2);
});

test("a read counts as use", () => {
  const c = new LRUCache(2);
  c.put("a", 1);
  c.put("b", 2);
  c.get("a");
  c.put("c", 3);
  expect(c.get("a")).toBe(1);
  expect(c.get("b")).toBe(-1);
});

test("overwriting refreshes recency without growing", () => {
  const c = new LRUCache(2);
  c.put("a", 1);
  c.put("b", 2);
  c.put("a", 10);
  c.put("c", 3);
  expect(c.get("a")).toBe(10);
  expect(c.get("b")).toBe(-1);
  expect(c.size).toBe(2);
});

test("capacity 1 works", () => {
  const c = new LRUCache(1);
  c.put("a", 1);
  c.put("b", 2);
  expect(c.get("a")).toBe(-1);
  expect(c.get("b")).toBe(2);
});

test("handles 50000 operations quickly", () => {
  const c = new LRUCache(1000);
  const start = Date.now();
  for (let i = 0; i < 50000; i++) {
    c.put(i, i);
    c.get(i - 500);
  }
  expect(Date.now() - start).toBeLessThan(500);
});`,
    hints: [
      'A `Map` keeps insertion order, so the first key it yields is the least recently used.',
      'In `get`, on a hit: delete the key and set it again so it moves to the end.',
      'In `put`, delete any existing key first, then set; afterwards, if size exceeds capacity, evict `this.map.keys().next().value`.',
    ],
    solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);

    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }

  get size() {
    return this.map.size;
  }
}
`,
  },
  {
    id: 'iv-03-debounce',
    title: 'Debounce and Throttle',
    language: 'javascript',
    module: 'Classic Problems',
    difficulty: 5,
    concepts: ['closures', 'timers', 'debounce', 'throttle'],
    instructions: `The most-asked front-end implementation question, because it needs closures, timers and \`this\` handling all at once — and because you genuinely use both weekly.

### Debounce

*Wait until the activity stops.* Every new call cancels the pending one and restarts the clock. Only after \`delay\` milliseconds of silence does the function run.

Use it for: search-as-you-type, autosave, validating a field while typing, resize handlers.

\`\`\`js
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
\`\`\`

### Throttle

*At most once per interval.* The first call runs immediately, then further calls are ignored until the window passes.

Use it for: scroll handlers, mousemove, anything firing at 60Hz that you want at 10Hz.

\`\`\`js
function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last < interval) return;
    last = now;
    return fn.apply(this, args);
  };
}
\`\`\`

### Saying the difference well

"Debounce waits for a pause; throttle enforces a rate." Typing a search box: debounce sends one request when they stop. Scrolling a page: throttle keeps the handler running at a steady rate rather than not at all.

Two details worth mentioning unprompted: use \`fn.apply(this, args)\` so the wrapper works on object methods, and a production debounce usually exposes a \`cancel()\` for cleanup when a component unmounts.

## YOUR TASK

1. \`debounce(fn, delay)\` — runs \`fn\` only after \`delay\` ms with no further calls, passing through the most recent arguments.
2. \`throttle(fn, interval)\` — runs \`fn\` immediately, then ignores calls until \`interval\` ms have passed.`,
    starterCode: `function debounce(fn, delay) {
}

function throttle(fn, interval) {
}
`,
    testCode: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test("debounce does not run immediately", async () => {
  let calls = 0;
  const d = debounce(() => calls++, 50);
  d();
  expect(calls).toBe(0);
  await sleep(80);
  expect(calls).toBe(1);
});

test("debounce collapses a burst into one call", async () => {
  let calls = 0;
  const d = debounce(() => calls++, 50);
  d(); d(); d(); d();
  await sleep(100);
  expect(calls).toBe(1);
});

test("debounce uses the most recent arguments", async () => {
  let seen = null;
  const d = debounce((v) => { seen = v; }, 40);
  d("first");
  d("second");
  d("third");
  await sleep(80);
  expect(seen).toBe("third");
});

test("debounce runs again after a quiet period", async () => {
  let calls = 0;
  const d = debounce(() => calls++, 30);
  d();
  await sleep(60);
  d();
  await sleep(60);
  expect(calls).toBe(2);
});

test("throttle runs the first call immediately", () => {
  let calls = 0;
  const t = throttle(() => calls++, 50);
  t();
  expect(calls).toBe(1);
});

test("throttle ignores calls inside the window", () => {
  let calls = 0;
  const t = throttle(() => calls++, 100);
  t(); t(); t(); t();
  expect(calls).toBe(1);
});

test("throttle allows another call after the interval", async () => {
  let calls = 0;
  const t = throttle(() => calls++, 40);
  t();
  await sleep(70);
  t();
  expect(calls).toBe(2);
});

test("throttle passes arguments through", () => {
  let seen = null;
  const t = throttle((v) => { seen = v; }, 50);
  t("hello");
  expect(seen).toBe("hello");
});`,
    hints: [
      'Both keep state in a closure variable declared before the returned function.',
      'For debounce, `clearTimeout(timer)` on every call before setting a new one — that is the whole mechanism.',
      'For throttle, compare `Date.now()` against the last run time and return early when inside the window.',
    ],
    solution: `function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last < interval) return undefined;
    last = now;
    return fn.apply(this, args);
  };
}
`,
  },
  {
    id: 'iv-04-intervals',
    title: 'Merge Intervals',
    language: 'javascript',
    module: 'Classic Problems',
    difficulty: 5,
    concepts: ['sorting', 'intervals', 'greedy', 'scheduling'],
    instructions: `A genuinely practical problem: calendar bookings, room availability, log time ranges, IP address blocks.

### The problem

\`\`\`
[[1,3],[2,6],[8,10],[15,18]]  →  [[1,6],[8,10],[15,18]]
\`\`\`

### Thinking it through

Unsorted, deciding what overlaps what is a mess. **Sort by start time** and it collapses into one pass:

- keep the last interval in your output
- if the next interval starts at or before that one ends, they overlap — extend the end to the larger of the two
- otherwise there is a gap, so push it as a new interval

The subtlety worth catching: extending must use \`Math.max\`. \`[1,10]\` followed by \`[2,3]\` is fully contained, and blindly taking the new end would shrink the merged interval to \`[1,3]\`. That is the bug the tests below check for, and it is the one interviewers watch for.

Complexity: O(n log n) for the sort, then O(n) for the pass. The sort dominates — and being able to say "the sort dominates, so this is O(n log n)" is the expected level of analysis.

### The follow-up you should expect

"Now tell me the minimum number of meeting rooms needed." Same setup, different technique: separate the starts and ends, sort both, and sweep — a running counter that goes up on a start and down on an end, with the peak as the answer.

## YOUR TASK

\`mergeIntervals(intervals)\` — merges all overlapping intervals and returns them sorted by start. Touching intervals such as \`[1,4]\` and \`[4,5]\` count as overlapping. Do not mutate the input.`,
    starterCode: `function mergeIntervals(intervals) {
}
`,
    testCode: `test("merges overlapping intervals", () => {
  expect(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])).toEqual([
    [1, 6],
    [8, 10],
    [15, 18],
  ]);
});

test("merges touching intervals", () => {
  expect(mergeIntervals([[1, 4], [4, 5]])).toEqual([[1, 5]]);
});

test("handles unsorted input", () => {
  expect(mergeIntervals([[8, 10], [1, 3], [2, 6]])).toEqual([[1, 6], [8, 10]]);
});

test("handles a fully contained interval", () => {
  expect(mergeIntervals([[1, 10], [2, 3]])).toEqual([[1, 10]]);
});

test("handles empty and single inputs", () => {
  expect(mergeIntervals([])).toEqual([]);
  expect(mergeIntervals([[1, 2]])).toEqual([[1, 2]]);
});

test("leaves non-overlapping intervals alone", () => {
  expect(mergeIntervals([[1, 2], [3, 4]])).toEqual([[1, 2], [3, 4]]);
});

test("does not mutate the input", () => {
  const input = [[3, 4], [1, 2]];
  mergeIntervals(input);
  expect(input).toEqual([[3, 4], [1, 2]]);
});

test("handles 50000 intervals", () => {
  const many = Array.from({ length: 50000 }, (_, i) => [i * 2, i * 2 + 1]);
  const start = Date.now();
  expect(mergeIntervals(many)).toHaveLength(50000);
  expect(Date.now() - start).toBeLessThan(600);
});`,
    hints: [
      'Copy before sorting: `[...intervals].sort((a, b) => a[0] - b[0])`.',
      'Walk the sorted list keeping a reference to the last interval you pushed into the output.',
      'Overlap is `current[0] <= last[1]`, and extending is `last[1] = Math.max(last[1], current[1])`.',
    ],
    solution: `function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];

  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged = [[...sorted[0]]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push([...current]);
    }
  }

  return merged;
}
`,
  },
  {
    id: 'iv-05-top-k',
    title: 'Top K Frequent Elements',
    language: 'javascript',
    module: 'Classic Problems',
    difficulty: 5,
    concepts: ['hash-map', 'bucket-sort', 'complexity-tradeoffs'],
    instructions: `Tests whether you can go past the obvious answer when pushed — which is exactly what the "can you do better?" follow-up is for.

### The problem

Given \`[1,1,1,2,2,3]\` and \`k = 2\`, return the two most frequent values: \`[1, 2]\`.

### The three answers, in the order an interview will walk you through them

**1. Count, sort, slice.** Build a frequency map, sort the entries by count, take k. O(n log n). Perfectly good, and you should say it first — a working solution beats a stalled clever one.

**2. A heap of size k.** Keep only the k largest counts as you go. O(n log k), better when k is much smaller than n. This is the answer most interviewers are fishing for.

**3. Bucket sort.** The key insight: a frequency can never exceed \`n\`. So make an array of \`n + 1\` buckets, put each value into the bucket matching its count, and read from the top down. **O(n)** — you have beaten the sort entirely by exploiting a bound on the values.

That last move — *noticing that your keys live in a bounded integer range, so you can index instead of compare* — is the transferable idea, and it also underlies counting sort and radix sort.

### Complexity summary to say out loud

Counting is O(n) and unavoidable. After that you are choosing how to select the top k: sorting O(n log n), a heap O(n log k), or bucketing O(n) at the cost of O(n) extra space.

## YOUR TASK

\`topKFrequent(nums, k)\` — the k most frequent values, most frequent first. Ties are broken by which value was seen first. Aim for the bucket approach.`,
    starterCode: `function topKFrequent(nums, k) {
}
`,
    testCode: `test("finds the most frequent values", () => {
  expect(topKFrequent([1, 1, 1, 2, 2, 3], 2)).toEqual([1, 2]);
});

test("k of 1 returns the single most frequent", () => {
  expect(topKFrequent([1], 1)).toEqual([1]);
  expect(topKFrequent([4, 4, 5], 1)).toEqual([4]);
});

test("breaks ties by first appearance", () => {
  expect(topKFrequent([3, 3, 1, 1, 2], 2)).toEqual([3, 1]);
});

test("k equal to the number of distinct values returns them all", () => {
  expect(topKFrequent([1, 2, 3], 3)).toEqual([1, 2, 3]);
});

test("handles an empty array", () => {
  expect(topKFrequent([], 2)).toEqual([]);
});

test("works on strings", () => {
  expect(topKFrequent(["a", "b", "a", "c", "b", "a"], 2)).toEqual(["a", "b"]);
});

test("stays linear on 200000 items", () => {
  const nums = Array.from({ length: 200000 }, (_, i) => i % 1000);
  const start = Date.now();
  expect(topKFrequent(nums, 3)).toHaveLength(3);
  expect(Date.now() - start).toBeLessThan(500);
});`,
    hints: [
      'First pass: a `Map` from value to count. A Map preserves insertion order, which gives you the tie-break rule for free.',
      'Create `buckets = new Array(nums.length + 1)` and push each value into `buckets[count]`.',
      'Walk the buckets from the highest index downward, collecting until you have k values.',
    ],
    solution: `function topKFrequent(nums, k) {
  const counts = new Map();
  for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1);

  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, count] of counts) buckets[count].push(value);

  const out = [];
  for (let count = buckets.length - 1; count >= 0 && out.length < k; count--) {
    for (const value of buckets[count]) {
      out.push(value);
      if (out.length === k) break;
    }
  }

  return out;
}
`,
  },
  {
    id: 'iv-06-behavioural',
    title: 'The Non-Coding Rounds',
    language: 'javascript',
    kind: 'quiz',
    module: 'The Process',
    difficulty: 3,
    concepts: ['interviewing', 'communication', 'behavioural'],
    instructions: `Candidates who can code get rejected in the behavioural round all the time. It is a skill, it is practisable, and it is mostly about structure.

### STAR

Answer with **Situation, Task, Action, Result**. Sixty to ninety seconds. Say "I", not "we" — they are hiring you, not your old team. End on the result, with a number if you have one.

Prepare five stories in advance and reuse them: a conflict, a failure, something you learned fast, something you shipped, something you improved. Almost every behavioural question maps onto one of them.

### While you code

Think out loud. Silence reads as being stuck. State your approach before typing, name the complexity when you finish, and mention the edge cases you are choosing to handle. If you are stuck, say what you are stuck on — a good interviewer will unblock you, and how you use a hint is itself being assessed.

### At the end

Ask real questions. What does a good first three months look like? How does code review work here? What is the on-call situation? These get you information you need *and* signal that you are evaluating them too.`,
    quiz: [
      {
        id: 'q1',
        prompt: '"Tell me about a time you failed." What is the best structure?',
        choices: [
          'Say you have not really failed',
          'Situation, what you did, what went wrong, what you changed afterwards',
          'Blame the circumstances honestly',
          'Pick a trivial failure to stay safe',
        ],
        answerIndex: 1,
        explanation:
          'A real failure, your own role in it stated plainly, and the specific change you made as a result. They are testing self-awareness and whether you learn. "I have not failed" and a deliberately trivial example both read as evasive.',
      },
      {
        id: 'q2',
        prompt: 'You are stuck two minutes into a coding question. What do you do?',
        choices: [
          'Stay silent until you work it out',
          'Say what you are trying, where it breaks down, and what you are considering',
          'Ask to switch questions',
          'Start typing anything to look busy',
        ],
        answerIndex: 1,
        explanation:
          'Narrate. Being stuck is expected; being silently stuck is uninterpretable. Explaining your reasoning lets the interviewer see how you think and gives them a place to nudge you — and using a hint well is a positive signal, not a negative one.',
      },
      {
        id: 'q3',
        prompt: 'You finish a working solution with time remaining. What is the strongest next move?',
        choices: [
          'Say you are done and wait',
          'State the complexity, name the edge cases, and offer how you would improve or test it',
          'Rewrite it in a different style',
          'Ask for a harder problem',
        ],
        answerIndex: 1,
        explanation:
          'Analyse your own solution unprompted. Complexity, edge cases, and what you would change under a different constraint is exactly the senior behaviour they are looking for — and it often earns the "can you do better?" follow-up on your own terms.',
      },
      {
        id: 'q4',
        prompt: 'The interviewer says your approach will not work, and you think it will. What do you do?',
        choices: [
          'Abandon it immediately',
          'Ask what case they are thinking of, then test it against your approach',
          'Insist and continue',
          'Start over with a different problem',
        ],
        answerIndex: 1,
        explanation:
          'Ask for the specific case. Either they hand you a counterexample you had missed, or working through it together shows your approach holds. Both outcomes look good; capitulating instantly and digging in stubbornly both look bad.',
      },
      {
        id: 'q5',
        prompt: 'Which question is worth asking at the end of an interview?',
        choices: [
          'How much is the salary?',
          'What does a successful first three months look like in this role?',
          'Do I get the job?',
          'Nothing — it seems keen',
        ],
        answerIndex: 1,
        explanation:
          'It gets you genuinely useful information about expectations, and it signals that you are thinking about doing the job well. Compensation is a real and legitimate question — it just belongs with the recruiter rather than at the end of a technical round.',
      },
      {
        id: 'q6',
        prompt: 'A take-home says roughly four hours. You could polish it for twelve. What do you do?',
        choices: [
          'Spend twelve to stand out',
          'Stay near the stated time and note in the README what you would do with more',
          'Spend one hour, it is only a screen',
          'Ask for a different format',
        ],
        answerIndex: 1,
        explanation:
          'Respect the timebox and document the trade-offs. A README saying "given more time I would add integration tests and pagination here" demonstrates judgement and honesty. Wildly overshooting is unfair to other candidates and suggests you cannot scope work.',
      },
    ],
  },
];
