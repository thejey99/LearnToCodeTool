import type { LessonDraft } from '../types';

export const DSA_LESSONS: LessonDraft[] = [
  {
    id: 'dsa-01-bigo',
    title: 'Big-O: Talking About Cost',
    language: 'javascript',
    module: 'Complexity',
    difficulty: 3,
    concepts: ['big-o', 'complexity', 'performance'],
    instructions: `Big-O describes how the work a function does **grows** as its input grows. It deliberately ignores constants and hardware, because those change and the growth rate does not.

| Notation | Name | Work for n = 1,000,000 |
| --- | --- | --- |
| O(1) | constant | 1 |
| O(log n) | logarithmic | ~20 |
| O(n) | linear | 1,000,000 |
| O(n log n) | linearithmic | ~20,000,000 |
| O(n²) | quadratic | 1,000,000,000,000 |

That last row is the point of this entire track. An O(n²) function that felt instant on your 100 test rows will take *hours* on a million. The difference between a working feature and an outage is often one nested loop.

### Reading it off the code

\`\`\`js
arr[0]                                  // O(1)  — one step, whatever the size
for (const x of arr) { ... }            // O(n)  — one pass
for (const a of arr) for (const b of arr) {}   // O(n²) — a pass per item
arr.sort()                              // O(n log n)
binarySearch(sorted, x)                 // O(log n) — halves each step
\`\`\`

Rules of thumb: sequential loops **add** (n + n = O(n)); nested loops **multiply** (n × n = O(n²)); constants drop (O(2n) is O(n)); the biggest term wins (O(n² + n) is O(n²)).

### The methods hide loops

\`\`\`js
if (array.includes(x))    // O(n)   — it scans
if (set.has(x))           // O(1)   — it hashes
\`\`\`

An \`includes\` inside a loop is a nested loop wearing a disguise. This is the single most common accidental O(n²) in real code, and the fix — swap the array for a Set — is the most common real optimisation.

### Space complexity

The same notation for **memory**. A function that builds a lookup table of every input uses O(n) space; one that only keeps a running total uses O(1). Time-versus-space is a trade you make consciously.

## YOUR TASK

Two functions that solve the same problem — *does this array contain any duplicates?* — with different complexities.

1. \`hasDuplicateSlow(items)\` — the nested-loop version, comparing every pair. O(n²).
2. \`hasDuplicateFast(items)\` — one pass using a \`Set\`. O(n) time, O(n) space.

The final test runs both on 4,000 items and requires the fast one to be measurably quicker — you will *see* the difference, not just be told about it.`,
    starterCode: `function hasDuplicateSlow(items) {
  // compare every pair with two nested loops
}

function hasDuplicateFast(items) {
  // one pass, remembering what you have seen in a Set
}
`,
    testCode: `test("both find a duplicate", () => {
  expect(hasDuplicateSlow([1, 2, 3, 2])).toBe(true);
  expect(hasDuplicateFast([1, 2, 3, 2])).toBe(true);
});

test("both report no duplicate", () => {
  expect(hasDuplicateSlow([1, 2, 3])).toBe(false);
  expect(hasDuplicateFast([1, 2, 3])).toBe(false);
});

test("both handle empty and single-item arrays", () => {
  expect(hasDuplicateSlow([])).toBe(false);
  expect(hasDuplicateFast([])).toBe(false);
  expect(hasDuplicateSlow([7])).toBe(false);
  expect(hasDuplicateFast([7])).toBe(false);
});

test("both work on strings", () => {
  expect(hasDuplicateFast(["a", "b", "a"])).toBe(true);
  expect(hasDuplicateSlow(["a", "b", "c"])).toBe(false);
});

test("the O(n) version is dramatically faster on 4000 items", () => {
  const big = Array.from({ length: 4000 }, (_, i) => i);

  const t1 = Date.now();
  hasDuplicateSlow(big);
  const slowMs = Date.now() - t1;

  const t2 = Date.now();
  hasDuplicateFast(big);
  const fastMs = Date.now() - t2;

  console.log("O(n^2) took " + slowMs + "ms, O(n) took " + fastMs + "ms");
  expect(fastMs).toBeLessThan(Math.max(slowMs, 5));
});`,
    hints: [
      'The slow version starts its inner loop at `j = i + 1` so it never compares an item with itself.',
      'The fast version: for each item, if the Set already has it return true, otherwise add it.',
      'A Set is created with `new Set()`, and its methods are `.has(x)` and `.add(x)`.',
    ],
    solution: `function hasDuplicateSlow(items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i] === items[j]) return true;
    }
  }
  return false;
}

function hasDuplicateFast(items) {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item)) return true;
    seen.add(item);
  }
  return false;
}
`,
  },
  {
    id: 'dsa-02-hashmaps',
    title: 'Hash Maps: The Workhorse',
    language: 'javascript',
    module: 'Core Structures',
    difficulty: 4,
    concepts: ['hash-map', 'map', 'lookup', 'two-sum'],
    instructions: `If you learn one structure properly, make it this one. A hash map stores key-value pairs and finds any key in **O(1) average time**, regardless of size.

\`\`\`js
const m = new Map();
m.set("ada", 36);
m.get("ada");        // 36
m.has("ada");        // true
m.delete("ada");
m.size;
for (const [k, v] of m) { ... }
\`\`\`

### Map or plain object?

Plain objects work as maps and are fine for simple string-keyed data. \`Map\` is better when: keys are not strings (objects and numbers stay their own type), insertion order matters, you add and remove a lot, or you need \`.size\`. Reaching for \`Map\` in an interview signals you know the difference.

### The pattern: trade space for time

Almost every "make this fast" problem is the same move — **do one pass building a lookup, then answer in O(1)**.

The canonical example is *two-sum*: find two numbers that add to a target.

\`\`\`js
// O(n²): check every pair
for (let i = 0; i < nums.length; i++)
  for (let j = i + 1; j < nums.length; j++)
    if (nums[i] + nums[j] === target) return [i, j];

// O(n): for each number, ask whether its partner has already been seen
const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  const need = target - nums[i];
  if (seen.has(need)) return [seen.get(need), i];
  seen.set(nums[i], i);
}
\`\`\`

The insight is worth sitting with: instead of searching *forward* for a partner, you record what you have passed and check *backward* in constant time. That inversion turns a great many quadratic algorithms linear.

## YOUR TASK

1. \`twoSum(nums, target)\` — indices of the two numbers adding to \`target\`, or \`null\`. Must be a single pass with a Map, not nested loops.
2. \`firstNonRepeating(str)\` — the first character appearing exactly once, or \`null\`.
3. \`groupBy(items, keyFn)\` — an object grouping items by \`keyFn(item)\`.`,
    starterCode: `function twoSum(nums, target) {
}

function firstNonRepeating(str) {
}

function groupBy(items, keyFn) {
}
`,
    testCode: `test("twoSum finds the pair", () => {
  expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
  expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
});

test("twoSum returns null when there is no pair", () => {
  expect(twoSum([1, 2, 3], 100)).toBeNull();
  expect(twoSum([], 0)).toBeNull();
});

test("twoSum does not reuse the same index twice", () => {
  expect(twoSum([3, 5], 6)).toBeNull();
});

test("twoSum stays fast on 20000 items", () => {
  const nums = Array.from({ length: 20000 }, (_, i) => i);
  const start = Date.now();
  expect(twoSum(nums, 39997)).toEqual([19998, 19999]);
  expect(Date.now() - start).toBeLessThan(300);
});

test("firstNonRepeating finds the character", () => {
  expect(firstNonRepeating("swiss")).toBe("w");
  expect(firstNonRepeating("aabbc")).toBe("c");
});

test("firstNonRepeating returns null when every character repeats", () => {
  expect(firstNonRepeating("aabb")).toBeNull();
  expect(firstNonRepeating("")).toBeNull();
});

test("groupBy groups items by the computed key", () => {
  const words = ["one", "two", "three", "four"];
  expect(groupBy(words, (w) => w.length)).toEqual({
    3: ["one", "two"],
    5: ["three"],
    4: ["four"],
  });
});`,
    hints: [
      'In `twoSum`, compute what you need (`target - nums[i]`) and check the Map *before* adding the current number.',
      'For `firstNonRepeating`, do two passes: one to count every character, one to find the first with a count of 1.',
      '`groupBy` builds an object: `(acc[key] ||= []).push(item)` or the longer `if (!acc[key]) acc[key] = [];`.',
    ],
    solution: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}

function firstNonRepeating(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);
  for (const ch of str) if (counts.get(ch) === 1) return ch;
  return null;
}

function groupBy(items, keyFn) {
  const out = {};
  for (const item of items) {
    const key = keyFn(item);
    if (!out[key]) out[key] = [];
    out[key].push(item);
  }
  return out;
}
`,
  },
  {
    id: 'dsa-03-two-pointers',
    title: 'Two Pointers',
    language: 'javascript',
    module: 'Array Techniques',
    difficulty: 4,
    concepts: ['two-pointers', 'in-place', 'sorted-arrays'],
    instructions: `Two pointers is a technique, not a structure: keep two indices moving through an array and let their positions carry the state. It turns many O(n²) problems into O(n) with O(1) extra memory.

### Converging from both ends

\`\`\`js
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}
\`\`\`

One pass, no reversed copy, no extra memory.

### On a sorted array

Sorting unlocks the strongest version. To find a pair summing to a target:

\`\`\`js
let lo = 0, hi = nums.length - 1;
while (lo < hi) {
  const sum = nums[lo] + nums[hi];
  if (sum === target) return [lo, hi];
  if (sum < target) lo++;      // need more: move the small end up
  else hi--;                   // need less: move the big end down
}
\`\`\`

Every step eliminates a whole column of possibilities. That is only sound *because* the array is sorted — say that out loud in an interview, because it is the part being tested.

### Both pointers moving forward

A "read" pointer scans while a "write" pointer trails behind, compacting in place:

\`\`\`js
function removeValue(nums, value) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== value) nums[write++] = nums[read];
  }
  return write;   // new length
}
\`\`\`

## YOUR TASK

1. \`isPalindrome(s)\` — ignoring case and any non-letter/digit character. \`"A man, a plan, a canal: Panama"\` is a palindrome.
2. \`sortedTwoSum(sorted, target)\` — indices of the pair, or \`null\`. Use converging pointers, not a Map.
3. \`moveZeros(nums)\` — move every zero to the end **in place**, keeping the order of the other numbers, and return the same array.`,
    starterCode: `function isPalindrome(s) {
}

function sortedTwoSum(sorted, target) {
}

function moveZeros(nums) {
}
`,
    testCode: `test("isPalindrome ignores punctuation and case", () => {
  expect(isPalindrome("A man, a plan, a canal: Panama")).toBe(true);
  expect(isPalindrome("racecar")).toBe(true);
});

test("isPalindrome rejects non-palindromes", () => {
  expect(isPalindrome("hello")).toBe(false);
  expect(isPalindrome("ab@ba!x")).toBe(false);
});

test("isPalindrome treats empty and single characters as palindromes", () => {
  expect(isPalindrome("")).toBe(true);
  expect(isPalindrome("a")).toBe(true);
  expect(isPalindrome(".,!")).toBe(true);
});

test("sortedTwoSum finds the pair", () => {
  expect(sortedTwoSum([1, 3, 4, 7, 11], 11)).toEqual([2, 3]);
  expect(sortedTwoSum([2, 4], 6)).toEqual([0, 1]);
});

test("sortedTwoSum returns null when nothing matches", () => {
  expect(sortedTwoSum([1, 2, 3], 99)).toBeNull();
  expect(sortedTwoSum([], 0)).toBeNull();
});

test("moveZeros pushes zeros to the end in place", () => {
  const nums = [0, 1, 0, 3, 12];
  const result = moveZeros(nums);
  expect(result).toEqual([1, 3, 12, 0, 0]);
  expect(result).toBe(nums);
});

test("moveZeros handles all zeros and no zeros", () => {
  expect(moveZeros([0, 0])).toEqual([0, 0]);
  expect(moveZeros([1, 2, 3])).toEqual([1, 2, 3]);
});`,
    hints: [
      'Clean the string first: `s.toLowerCase().replace(/[^a-z0-9]/g, "")`, then run the converging loop.',
      'In `sortedTwoSum`, the sum being too small means the *low* pointer must move up; too large means the high pointer moves down.',
      'In `moveZeros`, copy the non-zeros forward with a write pointer, then fill the remaining slots with 0.',
    ],
    solution: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0;
  let right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

function sortedTwoSum(sorted, target) {
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo < hi) {
    const sum = sorted[lo] + sorted[hi];
    if (sum === target) return [lo, hi];
    if (sum < target) lo++;
    else hi--;
  }
  return null;
}

function moveZeros(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) nums[write++] = nums[read];
  }
  while (write < nums.length) nums[write++] = 0;
  return nums;
}
`,
  },
  {
    id: 'dsa-04-sliding-window',
    title: 'Sliding Window',
    language: 'javascript',
    module: 'Array Techniques',
    difficulty: 5,
    concepts: ['sliding-window', 'subarrays', 'optimisation'],
    instructions: `Whenever a problem says "contiguous subarray" or "substring", think sliding window.

The naive approach recomputes each window from scratch — O(n·k). The window approach **reuses** the previous answer: slide one step, add what entered, subtract what left.

### Fixed-size window

\`\`\`js
function maxSum(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];     // first window
  let best = sum;

  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];                 // slide: add new, drop old
    best = Math.max(best, sum);
  }
  return best;
}
\`\`\`

Each element is added once and removed once: O(n).

### Variable-size window

Grow the right edge; when the window becomes invalid, shrink from the left until it is valid again:

\`\`\`js
function longestUnique(s) {
  const lastSeen = new Map();
  let start = 0, best = 0;

  for (let end = 0; end < s.length; end++) {
    const ch = s[end];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= start) {
      start = lastSeen.get(ch) + 1;      // jump past the earlier copy
    }
    lastSeen.set(ch, end);
    best = Math.max(best, end - start + 1);
  }
  return best;
}
\`\`\`

The subtle part is \`>= start\`: a character seen *before* the window began is not a conflict. Getting that condition wrong is the usual bug.

Both pointers only ever move forward, so despite the nested feel this is O(n).

## YOUR TASK

1. \`maxSubarraySum(nums, k)\` — the largest sum of any \`k\` consecutive elements. Return \`0\` if the array is shorter than \`k\`.
2. \`longestUniqueSubstring(s)\` — the length of the longest substring with no repeated character.
3. \`minSubarrayLen(nums, target)\` — the length of the shortest contiguous subarray of positive numbers summing to at least \`target\`, or \`0\` if none exists.`,
    starterCode: `function maxSubarraySum(nums, k) {
}

function longestUniqueSubstring(s) {
}

function minSubarrayLen(nums, target) {
}
`,
    testCode: `test("maxSubarraySum finds the best window", () => {
  expect(maxSubarraySum([2, 1, 5, 1, 3, 2], 3)).toBe(9);
  expect(maxSubarraySum([1, 2, 3], 3)).toBe(6);
});

test("maxSubarraySum handles a too-short array", () => {
  expect(maxSubarraySum([1, 2], 5)).toBe(0);
  expect(maxSubarraySum([], 1)).toBe(0);
});

test("maxSubarraySum copes with negatives", () => {
  expect(maxSubarraySum([-1, -2, -3, -1], 2)).toBe(-3);
});

test("maxSubarraySum stays linear on 100000 items", () => {
  const big = Array.from({ length: 100000 }, (_, i) => i % 7);
  const start = Date.now();
  maxSubarraySum(big, 1000);
  expect(Date.now() - start).toBeLessThan(300);
});

test("longestUniqueSubstring measures the window", () => {
  expect(longestUniqueSubstring("abcabcbb")).toBe(3);
  expect(longestUniqueSubstring("bbbbb")).toBe(1);
  expect(longestUniqueSubstring("pwwkew")).toBe(3);
});

test("longestUniqueSubstring handles the empty string", () => {
  expect(longestUniqueSubstring("")).toBe(0);
});

test("minSubarrayLen finds the shortest qualifying window", () => {
  expect(minSubarrayLen([2, 3, 1, 2, 4, 3], 7)).toBe(2);
  expect(minSubarrayLen([1, 1, 1, 1], 4)).toBe(4);
});

test("minSubarrayLen returns 0 when the target is unreachable", () => {
  expect(minSubarrayLen([1, 1], 100)).toBe(0);
});`,
    hints: [
      'For the fixed window, build the first window with its own loop, then slide with `sum += nums[i] - nums[i - k]`.',
      'For unique substrings, track the last index of each character and move `start` past a conflict only when that index is inside the current window.',
      'For `minSubarrayLen`, grow `end` adding to a running sum, then use a `while (sum >= target)` loop to shrink from the left while recording the best length.',
    ],
    solution: `function maxSubarraySum(nums, k) {
  if (nums.length < k || k <= 0) return 0;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    if (sum > best) best = sum;
  }
  return best;
}

function longestUniqueSubstring(s) {
  const lastSeen = new Map();
  let start = 0;
  let best = 0;
  for (let end = 0; end < s.length; end++) {
    const ch = s[end];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= start) {
      start = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, end);
    best = Math.max(best, end - start + 1);
  }
  return best;
}

function minSubarrayLen(nums, target) {
  let start = 0;
  let sum = 0;
  let best = Infinity;
  for (let end = 0; end < nums.length; end++) {
    sum += nums[end];
    while (sum >= target) {
      best = Math.min(best, end - start + 1);
      sum -= nums[start++];
    }
  }
  return best === Infinity ? 0 : best;
}
`,
  },
  {
    id: 'dsa-05-stacks-queues',
    title: 'Stacks and Queues',
    language: 'javascript',
    module: 'Core Structures',
    difficulty: 4,
    concepts: ['stack', 'queue', 'lifo', 'fifo'],
    instructions: `Two structures defined entirely by *which end you take things from*.

A **stack** is last-in-first-out. A JavaScript array is already one: \`push\` to add, \`pop\` to remove, both O(1).

\`\`\`js
const stack = [];
stack.push(1); stack.push(2);
stack.pop();          // 2
stack[stack.length - 1];   // peek without removing
\`\`\`

Stacks appear wherever there is nesting: matching brackets, undo history, the browser back button, expression evaluation, and the **call stack** itself — which is why deep recursion produces "maximum call stack size exceeded".

### The bracket-matching pattern

\`\`\`js
for (const ch of s) {
  if (isOpener(ch)) stack.push(ch);
  else {
    if (stack.pop() !== matchingOpener(ch)) return false;
  }
}
return stack.length === 0;     // nothing left unclosed
\`\`\`

That final check catches \`"((("\` — easy to forget.

A **queue** is first-in-first-out: a line at a shop. Print jobs, task queues, and breadth-first search all use one.

\`\`\`js
const queue = [];
queue.push(1);
queue.shift();       // takes from the front — but O(n)!
\`\`\`

\`shift\` re-indexes the entire array, so a queue built on \`shift\` is O(n) per removal. For small queues nobody cares; for large ones you keep a head index and move it instead of shifting, which is what the task asks you to do.

## YOUR TASK

1. \`isBalanced(s)\` — are \`()\`, \`[]\` and \`{}\` correctly matched and nested? \`"{[()]}"\` yes, \`"([)]"\` no.
2. A \`Queue\` class with \`enqueue(x)\`, \`dequeue()\` (returns \`undefined\` when empty), \`peek()\` and a \`size\` getter — with **O(1) dequeue**, using a head index rather than \`shift\`.`,
    starterCode: `function isBalanced(s) {
}

class Queue {
  constructor() {
  }

  enqueue(item) {
  }

  dequeue() {
  }

  peek() {
  }

  get size() {
  }
}
`,
    testCode: `test("isBalanced accepts correct nesting", () => {
  expect(isBalanced("{[()]}")).toBe(true);
  expect(isBalanced("()")).toBe(true);
  expect(isBalanced("")).toBe(true);
});

test("isBalanced rejects crossed brackets", () => {
  expect(isBalanced("([)]")).toBe(false);
});

test("isBalanced rejects unclosed brackets", () => {
  expect(isBalanced("(((")).toBe(false);
  expect(isBalanced("())")).toBe(false);
});

test("isBalanced ignores other characters", () => {
  expect(isBalanced("a(b[c]d)e")).toBe(true);
});

test("the queue is first in, first out", () => {
  const q = new Queue();
  q.enqueue("a"); q.enqueue("b"); q.enqueue("c");
  expect(q.dequeue()).toBe("a");
  expect(q.dequeue()).toBe("b");
  expect(q.size).toBe(1);
});

test("peek does not remove", () => {
  const q = new Queue();
  q.enqueue(1);
  expect(q.peek()).toBe(1);
  expect(q.size).toBe(1);
});

test("dequeue on an empty queue is undefined", () => {
  const q = new Queue();
  expect(q.dequeue()).toBeUndefined();
  expect(q.size).toBe(0);
});

test("the queue survives interleaved use", () => {
  const q = new Queue();
  q.enqueue(1); q.enqueue(2);
  q.dequeue();
  q.enqueue(3);
  expect(q.dequeue()).toBe(2);
  expect(q.dequeue()).toBe(3);
  expect(q.dequeue()).toBeUndefined();
});

test("dequeue stays fast for 50000 items", () => {
  const q = new Queue();
  for (let i = 0; i < 50000; i++) q.enqueue(i);
  const start = Date.now();
  for (let i = 0; i < 50000; i++) q.dequeue();
  expect(Date.now() - start).toBeLessThan(300);
});`,
    hints: [
      'Map each closer to its opener: `const pairs = { ")": "(", "]": "[", "}": "{" };`',
      'If the character is not a bracket at all, skip it. At the end, the stack must be empty.',
      'For the queue, keep `this.items = []` and `this.head = 0`; dequeue reads `items[head]` then increments `head`. Size is `items.length - head`.',
    ],
    solution: `function isBalanced(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const openers = new Set(["(", "[", "{"]);
  const stack = [];

  for (const ch of s) {
    if (openers.has(ch)) {
      stack.push(ch);
    } else if (pairs[ch]) {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}

class Queue {
  constructor() {
    this.items = [];
    this.head = 0;
  }

  enqueue(item) {
    this.items.push(item);
    return this;
  }

  dequeue() {
    if (this.head >= this.items.length) return undefined;
    const item = this.items[this.head];
    this.items[this.head] = undefined;
    this.head++;
    return item;
  }

  peek() {
    return this.head < this.items.length ? this.items[this.head] : undefined;
  }

  get size() {
    return this.items.length - this.head;
  }
}
`,
  },
  {
    id: 'dsa-06-recursion',
    title: 'Recursion',
    language: 'javascript',
    module: 'Recursion & Search',
    difficulty: 4,
    concepts: ['recursion', 'base-case', 'call-stack', 'trees'],
    instructions: `A recursive function solves a problem by calling itself on a smaller version of the same problem.

Every recursive function needs exactly two things:

1. A **base case** — an input small enough to answer without recursing. Without it you get infinite recursion and a stack overflow.
2. A **recursive case** that makes the problem strictly smaller and trusts the function to handle it.

\`\`\`js
function factorial(n) {
  if (n <= 1) return 1;              // base case
  return n * factorial(n - 1);       // smaller problem
}
\`\`\`

### Stop tracing, start trusting

The instinct is to trace every level in your head. Do not. Assume \`factorial(n - 1)\` is already correct, and ask only: *given that, is my line right?* This "leap of faith" is the skill; tracing does not scale past two levels.

### Where recursion is the natural fit

Anything with a nested or branching shape: file systems, HTML/JSON trees, menus, org charts, binary trees.

\`\`\`js
function countLeaves(node) {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((sum, c) => sum + countLeaves(c), 0);
}
\`\`\`

Writing that with loops means managing your own stack. Recursion lets the language do it.

### The cost

Each call consumes a stack frame. Around 10,000 deep, JavaScript throws "maximum call stack size exceeded". Recursion is for **branching** data (where depth is roughly log n) more than for long linear sequences.

And beware naive recursive Fibonacci — it recomputes the same values exponentially many times. The fix, memoisation, is the Dynamic Programming lesson.

## YOUR TASK

1. \`sumNested(arr)\` — sum all numbers in an arbitrarily nested array. \`[1, [2, [3, [4]]]]\` gives 10.
2. \`flatten(arr)\` — flatten any nesting into one array, preserving order.
3. \`countNodes(node)\` — count every node in a tree of \`{ value, children }\` objects, including the root.`,
    starterCode: `function sumNested(arr) {
}

function flatten(arr) {
}

function countNodes(node) {
}
`,
    testCode: `test("sumNested handles a flat array", () => {
  expect(sumNested([1, 2, 3])).toBe(6);
});

test("sumNested handles deep nesting", () => {
  expect(sumNested([1, [2, [3, [4]]]])).toBe(10);
  expect(sumNested([[[[5]]]])).toBe(5);
});

test("sumNested handles empty arrays", () => {
  expect(sumNested([])).toBe(0);
  expect(sumNested([[], [[]]])).toBe(0);
});

test("flatten preserves order", () => {
  expect(flatten([1, [2, 3], [[4]], 5])).toEqual([1, 2, 3, 4, 5]);
});

test("flatten handles an empty array", () => {
  expect(flatten([])).toEqual([]);
});

test("countNodes counts a single node", () => {
  expect(countNodes({ value: 1, children: [] })).toBe(1);
});

test("countNodes counts a whole tree", () => {
  const tree = {
    value: 1,
    children: [
      { value: 2, children: [{ value: 4, children: [] }] },
      { value: 3, children: [] },
    ],
  };
  expect(countNodes(tree)).toBe(4);
});

test("countNodes tolerates a missing children array", () => {
  expect(countNodes({ value: 1 })).toBe(1);
});`,
    hints: [
      'For `sumNested`, loop the items: if `Array.isArray(item)` recurse, otherwise add the number.',
      'For `flatten`, build the output with `push(...flatten(item))` for arrays and `push(item)` otherwise.',
      'For `countNodes`, the answer is 1 plus the counts of every child — `reduce` over `node.children ?? []`.',
    ],
    solution: `function sumNested(arr) {
  let total = 0;
  for (const item of arr) {
    total += Array.isArray(item) ? sumNested(item) : item;
  }
  return total;
}

function flatten(arr) {
  const out = [];
  for (const item of arr) {
    if (Array.isArray(item)) out.push(...flatten(item));
    else out.push(item);
  }
  return out;
}

function countNodes(node) {
  const children = node.children ?? [];
  return 1 + children.reduce((sum, child) => sum + countNodes(child), 0);
}
`,
  },
  {
    id: 'dsa-07-binary-search',
    title: 'Binary Search',
    language: 'javascript',
    module: 'Recursion & Search',
    difficulty: 4,
    concepts: ['binary-search', 'logarithmic', 'sorted-arrays', 'off-by-one'],
    instructions: `Binary search finds an item in a **sorted** array in O(log n) by halving the search space each step. A million items takes 20 comparisons.

\`\`\`js
function search(sorted, target) {
  let lo = 0;
  let hi = sorted.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) lo = mid + 1;    // answer is to the right
    else hi = mid - 1;                          // answer is to the left
  }
  return -1;
}
\`\`\`

Four details, each of which is a classic bug:

- \`lo <= hi\`, not \`<\`. With \`<\` you miss a one-element range.
- \`mid + 1\` and \`mid - 1\`, not \`mid\`. Leaving \`mid\` in the range makes it loop forever.
- \`Math.floor\` — an index must be an integer.
- The array **must be sorted**. On unsorted input it does not fail loudly; it quietly returns wrong answers, which is worse.

> Jon Bentley reported that when he asked professional programmers to write binary search, roughly 90% of the implementations were buggy — and a bug in Java's own version survived for nine years. Do not feel bad about getting it wrong once; do write out the edge cases.

### The variant that matters more

"Find the *first* item that satisfies a condition" comes up far more often than exact-match search: first date after X, first version containing a bug, the leftmost valid position.

\`\`\`js
function firstAtLeast(sorted, target) {
  let lo = 0, hi = sorted.length;    // note: length, not length - 1
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid;                   // keep mid as a candidate
  }
  return lo;                          // may be sorted.length if none qualify
}
\`\`\`

## YOUR TASK

1. \`binarySearch(sorted, target)\` — the index, or \`-1\`.
2. \`firstAtLeast(sorted, target)\` — the index of the first element \`>= target\`, or \`sorted.length\` if there is none.
3. \`sqrtFloor(n)\` — the integer part of the square root of \`n\`, found by binary searching the answer rather than calling \`Math.sqrt\`.`,
    starterCode: `function binarySearch(sorted, target) {
}

function firstAtLeast(sorted, target) {
}

function sqrtFloor(n) {
}
`,
    testCode: `test("binarySearch finds present values", () => {
  const a = [1, 3, 5, 7, 9, 11];
  expect(binarySearch(a, 1)).toBe(0);
  expect(binarySearch(a, 7)).toBe(3);
  expect(binarySearch(a, 11)).toBe(5);
});

test("binarySearch returns -1 for missing values", () => {
  expect(binarySearch([1, 3, 5], 4)).toBe(-1);
  expect(binarySearch([1, 3, 5], 99)).toBe(-1);
  expect(binarySearch([], 1)).toBe(-1);
});

test("binarySearch handles a single element", () => {
  expect(binarySearch([5], 5)).toBe(0);
  expect(binarySearch([5], 4)).toBe(-1);
});

test("binarySearch is logarithmic on a million items", () => {
  const big = Array.from({ length: 1000000 }, (_, i) => i * 2);
  const start = Date.now();
  expect(binarySearch(big, 1999998)).toBe(999999);
  expect(Date.now() - start).toBeLessThan(50);
});

test("firstAtLeast finds the boundary", () => {
  const a = [1, 3, 5, 7];
  expect(firstAtLeast(a, 5)).toBe(2);
  expect(firstAtLeast(a, 4)).toBe(2);
  expect(firstAtLeast(a, 0)).toBe(0);
});

test("firstAtLeast returns the length when nothing qualifies", () => {
  expect(firstAtLeast([1, 3, 5], 99)).toBe(3);
  expect(firstAtLeast([], 1)).toBe(0);
});

test("sqrtFloor computes integer square roots", () => {
  expect(sqrtFloor(0)).toBe(0);
  expect(sqrtFloor(1)).toBe(1);
  expect(sqrtFloor(8)).toBe(2);
  expect(sqrtFloor(9)).toBe(3);
  expect(sqrtFloor(99)).toBe(9);
  expect(sqrtFloor(1000000)).toBe(1000);
});`,
    hints: [
      'Keep the loop condition `lo <= hi` and always move past `mid`, or the loop will never end.',
      '`firstAtLeast` uses the other template: `hi` starts at `length`, the condition is `lo < hi`, and the else branch sets `hi = mid`.',
      'For `sqrtFloor`, binary search candidate answers between 0 and n, keeping any `mid` whose square is `<= n`.',
    ],
    solution: `function binarySearch(sorted, target) {
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

function firstAtLeast(sorted, target) {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function sqrtFloor(n) {
  if (n < 2) return n;
  let lo = 1;
  let hi = n;
  let best = 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (mid * mid <= n) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}
`,
  },
  {
    id: 'dsa-08-trees',
    title: 'Trees and Traversal',
    language: 'javascript',
    module: 'Trees & Graphs',
    difficulty: 5,
    concepts: ['binary-tree', 'traversal', 'bst', 'recursion'],
    instructions: `A **binary tree** is nodes, each with up to two children:

\`\`\`js
const node = { value: 5, left: null, right: null };
\`\`\`

Almost every tree function is the same three lines: handle the empty case, recurse left, recurse right, combine.

\`\`\`js
function depth(node) {
  if (!node) return 0;
  return 1 + Math.max(depth(node.left), depth(node.right));
}
\`\`\`

### Traversal order

*Depth-first*, distinguished by when you visit the node relative to its children:

\`\`\`js
inOrder:   left, node, right     // on a BST this yields sorted order
preOrder:  node, left, right     // copying / serialising a tree
postOrder: left, right, node     // deleting / evaluating bottom-up
\`\`\`

*Breadth-first* visits level by level and uses a queue rather than recursion:

\`\`\`js
function levelOrder(root) {
  if (!root) return [];
  const out = [], queue = [root];
  while (queue.length) {
    const node = queue.shift();
    out.push(node.value);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return out;
}
\`\`\`

That queue-driven loop is the same shape as the shortest-path algorithm in the next lesson.

### Binary search trees

A **BST** keeps everything smaller on the left and everything larger on the right. That invariant makes lookup O(log n) — *when the tree is balanced*. Insert already-sorted data and it degenerates into a linked list at O(n), which is why real systems use self-balancing variants such as red-black or AVL trees. Knowing that failure mode is more valuable than being able to implement the rebalancing.

## YOUR TASK

Using nodes shaped \`{ value, left, right }\`:

1. \`depth(node)\` — the height; an empty tree is 0.
2. \`inOrder(node)\` — an array of values, left-node-right.
3. \`levelOrder(node)\` — an array of values, top to bottom, left to right.
4. \`isBST(node)\` — is this a valid binary search tree? Careful: checking only against the immediate parent is **not** enough.`,
    starterCode: `function depth(node) {
}

function inOrder(node) {
}

function levelOrder(node) {
}

function isBST(node) {
}
`,
    testCode: `const leaf = (v) => ({ value: v, left: null, right: null });
const TREE = {
  value: 5,
  left: { value: 3, left: leaf(1), right: leaf(4) },
  right: { value: 8, left: null, right: leaf(9) },
};

test("depth measures the tallest path", () => {
  expect(depth(null)).toBe(0);
  expect(depth(leaf(1))).toBe(1);
  expect(depth(TREE)).toBe(3);
});

test("inOrder returns sorted values for a BST", () => {
  expect(inOrder(TREE)).toEqual([1, 3, 4, 5, 8, 9]);
  expect(inOrder(null)).toEqual([]);
});

test("levelOrder walks the tree by level", () => {
  expect(levelOrder(TREE)).toEqual([5, 3, 8, 1, 4, 9]);
  expect(levelOrder(null)).toEqual([]);
});

test("isBST accepts a valid tree", () => {
  expect(isBST(TREE)).toBe(true);
  expect(isBST(null)).toBe(true);
  expect(isBST(leaf(1))).toBe(true);
});

test("isBST rejects an obviously wrong child", () => {
  const bad = { value: 5, left: leaf(9), right: null };
  expect(isBST(bad)).toBe(false);
});

test("isBST rejects a violation deeper in the tree", () => {
  // 6 is larger than the root, yet sits in the left subtree
  const sneaky = {
    value: 5,
    left: { value: 3, left: null, right: leaf(6) },
    right: leaf(8),
  };
  expect(isBST(sneaky)).toBe(false);
});`,
    hints: [
      'Every one of these starts with the empty check: `if (!node) return ...`.',
      '`inOrder` concatenates three pieces: the left result, `[node.value]`, and the right result.',
      'For `isBST`, pass an allowed range down: a helper `check(node, min, max)` where going left tightens `max` and going right tightens `min`.',
    ],
    solution: `function depth(node) {
  if (!node) return 0;
  return 1 + Math.max(depth(node.left), depth(node.right));
}

function inOrder(node) {
  if (!node) return [];
  return [...inOrder(node.left), node.value, ...inOrder(node.right)];
}

function levelOrder(node) {
  if (!node) return [];
  const out = [];
  const queue = [node];
  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    out.push(current.value);
    if (current.left) queue.push(current.left);
    if (current.right) queue.push(current.right);
  }
  return out;
}

function isBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true;
  if (node.value <= min || node.value >= max) return false;
  return isBST(node.left, min, node.value) && isBST(node.right, node.value, max);
}
`,
  },
  {
    id: 'dsa-09-graphs',
    title: 'Graphs: BFS and DFS',
    language: 'javascript',
    module: 'Trees & Graphs',
    difficulty: 5,
    concepts: ['graphs', 'bfs', 'dfs', 'shortest-path', 'visited-set'],
    instructions: `A **graph** is nodes connected by edges. Social networks, road maps, dependency trees, file links, state machines — all graphs. The usual representation is an adjacency list:

\`\`\`js
const graph = {
  a: ["b", "c"],
  b: ["d"],
  c: ["d"],
  d: [],
};
\`\`\`

Graphs differ from trees in one crucial way: they can contain **cycles**. Traverse without tracking what you have visited and you loop forever. The \`visited\` set is not an optimisation, it is a correctness requirement.

### Breadth-first search — a queue

\`\`\`js
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const next of graph[node] ?? []) {
      if (!visited.has(next)) {
        visited.add(next);       // mark on enqueue, not on dequeue
        queue.push(next);
      }
    }
  }
  return order;
}
\`\`\`

Marking as visited when you *enqueue* rather than when you dequeue prevents the same node being queued twice. Getting this wrong is the usual BFS bug.

### Depth-first search — a stack, or recursion

Swap the queue for a stack (or recurse) and you go deep before wide.

### Which to use

**BFS finds the shortest path** in an unweighted graph, because it explores every node at distance 1 before any at distance 2. DFS does not — it finds *a* path. Any question about "fewest steps", "minimum moves", "closest" is a BFS question.

To recover the path itself, remember where each node came from:

\`\`\`js
const cameFrom = new Map([[start, null]]);
// ... during traversal: cameFrom.set(next, node)
// then walk backwards from the target and reverse
\`\`\`

Weighted edges need Dijkstra's algorithm — same idea, priority queue instead of a plain one.

## YOUR TASK

1. \`bfs(graph, start)\` — nodes in breadth-first order, starting with \`start\`.
2. \`hasPath(graph, from, to)\` — is \`to\` reachable from \`from\`? Must terminate on cyclic graphs.
3. \`shortestPath(graph, from, to)\` — the shortest route as an array of nodes including both ends, or \`null\` if unreachable.`,
    starterCode: `function bfs(graph, start) {
}

function hasPath(graph, from, to) {
}

function shortestPath(graph, from, to) {
}
`,
    testCode: `const GRAPH = {
  a: ["b", "c"],
  b: ["d"],
  c: ["d", "e"],
  d: ["f"],
  e: ["f"],
  f: [],
  lonely: [],
};

const CYCLIC = { x: ["y"], y: ["z"], z: ["x"] };

test("bfs visits level by level", () => {
  expect(bfs(GRAPH, "a")).toEqual(["a", "b", "c", "d", "e", "f"]);
});

test("bfs on an isolated node returns just that node", () => {
  expect(bfs(GRAPH, "lonely")).toEqual(["lonely"]);
});

test("bfs terminates on a cyclic graph", () => {
  expect(bfs(CYCLIC, "x")).toEqual(["x", "y", "z"]);
});

test("hasPath finds reachable nodes", () => {
  expect(hasPath(GRAPH, "a", "f")).toBe(true);
  expect(hasPath(GRAPH, "b", "f")).toBe(true);
  expect(hasPath(GRAPH, "a", "a")).toBe(true);
});

test("hasPath rejects unreachable nodes", () => {
  expect(hasPath(GRAPH, "b", "c")).toBe(false);
  expect(hasPath(GRAPH, "a", "lonely")).toBe(false);
});

test("hasPath terminates on a cycle", () => {
  expect(hasPath(CYCLIC, "x", "z")).toBe(true);
  expect(hasPath(CYCLIC, "x", "nothing")).toBe(false);
});

test("shortestPath returns the fewest hops", () => {
  expect(shortestPath(GRAPH, "a", "f")).toEqual(["a", "b", "d", "f"]);
});

test("shortestPath from a node to itself is a single step", () => {
  expect(shortestPath(GRAPH, "a", "a")).toEqual(["a"]);
});

test("shortestPath returns null when unreachable", () => {
  expect(shortestPath(GRAPH, "f", "a")).toBeNull();
});`,
    hints: [
      'All three share the same skeleton: a `visited` Set seeded with the start, and a queue.',
      'Add to `visited` at the moment you push onto the queue, not when you pop.',
      'For the path, keep a Map from node to the node you arrived from, then walk it backwards from the target and `reverse()`.',
    ],
    solution: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  let head = 0;

  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (const next of graph[node] ?? []) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}

function hasPath(graph, from, to) {
  return bfs(graph, from).includes(to);
}

function shortestPath(graph, from, to) {
  const cameFrom = new Map([[from, null]]);
  const queue = [from];
  let head = 0;

  while (head < queue.length) {
    const node = queue[head++];
    if (node === to) {
      const path = [];
      let current = to;
      while (current !== null) {
        path.push(current);
        current = cameFrom.get(current);
      }
      return path.reverse();
    }
    for (const next of graph[node] ?? []) {
      if (!cameFrom.has(next)) {
        cameFrom.set(next, node);
        queue.push(next);
      }
    }
  }
  return null;
}
`,
  },
  {
    id: 'dsa-10-sorting',
    title: 'Sorting Algorithms',
    language: 'javascript',
    module: 'Sorting & DP',
    difficulty: 5,
    concepts: ['merge-sort', 'divide-and-conquer', 'stability', 'complexity'],
    instructions: `You will use the built-in \`sort\` at work. You are asked to implement one in interviews, because it is the cleanest demonstration of **divide and conquer**.

### Merge sort — O(n log n), always

Three steps: split in half, sort each half recursively, merge the two sorted halves.

\`\`\`js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;              // base case
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}
\`\`\`

The interesting half is the merge: two sorted arrays combine in linear time by repeatedly taking whichever front element is smaller.

Why O(n log n)? There are log n levels of halving, and each level does O(n) work merging. Merge sort's cost never degrades — no input makes it slow — and it is **stable**, meaning equal elements keep their original relative order. Stability matters more than people expect: sort by date, then by author, and a stable sort leaves each author's items still in date order.

### The others, briefly

| Algorithm | Average | Worst | In place? | Stable? |
| --- | --- | --- | --- | --- |
| Merge sort | O(n log n) | O(n log n) | no | yes |
| Quicksort | O(n log n) | O(n²) | yes | no |
| Insertion sort | O(n²) | O(n²) | yes | yes |

Quicksort is usually faster in practice (better memory locality) but degrades to O(n²) on a bad pivot choice. Insertion sort is quadratic yet beats everything on tiny or nearly-sorted arrays — which is why real engines use a **hybrid**: quicksort or merge sort down to small chunks, then insertion sort. V8's \`Array.prototype.sort\` is one of these.

## YOUR TASK

1. \`merge(a, b)\` — merge two already-sorted arrays into one sorted array. Linear time: no calling \`sort\`.
2. \`mergeSort(arr)\` — full merge sort, returning a **new** array and leaving the input untouched.
3. \`insertionSort(arr)\` — the O(n²) version, also returning a new array.`,
    starterCode: `function merge(a, b) {
}

function mergeSort(arr) {
}

function insertionSort(arr) {
}
`,
    testCode: `test("merge combines two sorted arrays", () => {
  expect(merge([1, 3, 5], [2, 4, 6])).toEqual([1, 2, 3, 4, 5, 6]);
  expect(merge([1, 2], [])).toEqual([1, 2]);
  expect(merge([], [])).toEqual([]);
});

test("merge handles duplicates and uneven lengths", () => {
  expect(merge([1, 1, 5], [1, 2])).toEqual([1, 1, 1, 2, 5]);
});

test("mergeSort sorts", () => {
  expect(mergeSort([5, 2, 9, 1, 7])).toEqual([1, 2, 5, 7, 9]);
  expect(mergeSort([])).toEqual([]);
  expect(mergeSort([1])).toEqual([1]);
});

test("mergeSort leaves the input untouched", () => {
  const input = [3, 1, 2];
  mergeSort(input);
  expect(input).toEqual([3, 1, 2]);
});

test("mergeSort handles already-sorted and reversed input", () => {
  expect(mergeSort([1, 2, 3])).toEqual([1, 2, 3]);
  expect(mergeSort([3, 2, 1])).toEqual([1, 2, 3]);
});

test("mergeSort handles 5000 items quickly", () => {
  const big = Array.from({ length: 5000 }, () => Math.floor(Math.random() * 10000));
  const start = Date.now();
  const sorted = mergeSort(big);
  expect(Date.now() - start).toBeLessThan(500);
  for (let i = 1; i < sorted.length; i++) {
    expect(sorted[i] >= sorted[i - 1]).toBe(true);
  }
});

test("insertionSort sorts", () => {
  expect(insertionSort([5, 2, 9, 1])).toEqual([1, 2, 5, 9]);
  expect(insertionSort([])).toEqual([]);
});`,
    hints: [
      '`merge` walks two indices, always taking the smaller front element, then appends whatever remains of the other array.',
      '`mergeSort` recurses on `arr.slice(0, mid)` and `arr.slice(mid)` — `slice` already copies, so the input is safe.',
      '`insertionSort` takes each item and shifts larger items right until it finds the slot.',
    ],
    solution: `function merge(a, b) {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) out.push(a[i++]);
    else out.push(b[j++]);
  }
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}

function mergeSort(arr) {
  if (arr.length <= 1) return [...arr];
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}

function insertionSort(arr) {
  const out = [...arr];
  for (let i = 1; i < out.length; i++) {
    const current = out[i];
    let j = i - 1;
    while (j >= 0 && out[j] > current) {
      out[j + 1] = out[j];
      j--;
    }
    out[j + 1] = current;
  }
  return out;
}
`,
  },
  {
    id: 'dsa-11-dynamic-programming',
    title: 'Dynamic Programming',
    language: 'javascript',
    module: 'Sorting & DP',
    difficulty: 5,
    concepts: ['dynamic-programming', 'memoisation', 'tabulation', 'optimal-substructure'],
    instructions: `Dynamic programming has a fearsome reputation and a simple core: **do not compute the same thing twice**.

Naive recursive Fibonacci:

\`\`\`js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
\`\`\`

\`fib(40)\` makes over 300 million calls, because \`fib(35)\` is recomputed millions of times. The work is exponential — O(2ⁿ).

### Memoisation — top-down

Keep the answers you have already worked out:

\`\`\`js
function fib(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}
\`\`\`

Now each value is computed once: O(n). Three added lines, and \`fib(40)\` goes from seconds to instant.

### Tabulation — bottom-up

Build a table from the smallest case upward, no recursion at all:

\`\`\`js
function fib(n) {
  const table = [0, 1];
  for (let i = 2; i <= n; i++) table[i] = table[i - 1] + table[i - 2];
  return table[n];
}
\`\`\`

And since each step needs only the last two values, you can drop the table entirely and use two variables — O(1) space.

### Recognising a DP problem

Two properties must hold:

1. **Optimal substructure** — the answer is built from answers to smaller versions.
2. **Overlapping subproblems** — those smaller versions repeat.

Without the second, plain recursion is enough. Typical signals in a problem statement: "in how many ways…", "the minimum/maximum number of…", "can you reach…". Climbing stairs, coin change, edit distance, knapsack and longest common subsequence are all the same machinery.

## YOUR TASK

1. \`fibMemo(n)\` — memoised Fibonacci; \`fibMemo(50)\` must be instant.
2. \`climbStairs(n)\` — how many distinct ways to climb \`n\` steps taking 1 or 2 at a time. (Fibonacci in disguise — see if you spot why.)
3. \`coinChange(coins, amount)\` — the fewest coins summing exactly to \`amount\`, or \`-1\` if impossible. \`amount\` 0 needs 0 coins.`,
    starterCode: `function fibMemo(n) {
}

function climbStairs(n) {
}

function coinChange(coins, amount) {
}
`,
    testCode: `test("fibMemo computes small values", () => {
  expect(fibMemo(0)).toBe(0);
  expect(fibMemo(1)).toBe(1);
  expect(fibMemo(10)).toBe(55);
});

test("fibMemo(50) is instant", () => {
  const start = Date.now();
  expect(fibMemo(50)).toBe(12586269025);
  expect(Date.now() - start).toBeLessThan(50);
});

test("climbStairs counts the ways", () => {
  expect(climbStairs(1)).toBe(1);
  expect(climbStairs(2)).toBe(2);
  expect(climbStairs(3)).toBe(3);
  expect(climbStairs(5)).toBe(8);
});

test("climbStairs handles a large input without exploding", () => {
  const start = Date.now();
  expect(climbStairs(40)).toBe(165580141);
  expect(Date.now() - start).toBeLessThan(50);
});

test("coinChange finds the minimum", () => {
  expect(coinChange([1, 5, 10, 25], 30)).toBe(2);
  expect(coinChange([1, 2, 5], 11)).toBe(3);
});

test("coinChange prefers the genuinely optimal set, not the greedy one", () => {
  // greedy would take 4 then be stuck; the answer is 3 + 3
  expect(coinChange([1, 3, 4], 6)).toBe(2);
});

test("coinChange handles zero and the impossible case", () => {
  expect(coinChange([1, 5], 0)).toBe(0);
  expect(coinChange([5], 3)).toBe(-1);
  expect(coinChange([], 5)).toBe(-1);
});`,
    hints: [
      'For `fibMemo`, either use a default `memo` parameter or a `Map` declared outside the function.',
      'Climbing stairs: the ways to reach step n are the ways to reach n-1 plus the ways to reach n-2.',
      'For `coinChange`, build a table where `best[i]` is the fewest coins for amount `i`; start it filled with `Infinity`, set `best[0] = 0`, and for each amount try every coin.',
    ],
    solution: `function fibMemo(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

function climbStairs(n) {
  if (n <= 2) return n;
  let prev = 1;
  let current = 2;
  for (let i = 3; i <= n; i++) {
    const next = prev + current;
    prev = current;
    current = next;
  }
  return current;
}

function coinChange(coins, amount) {
  const best = new Array(amount + 1).fill(Infinity);
  best[0] = 0;

  for (let value = 1; value <= amount; value++) {
    for (const coin of coins) {
      if (coin <= value && best[value - coin] + 1 < best[value]) {
        best[value] = best[value - coin] + 1;
      }
    }
  }

  return best[amount] === Infinity ? -1 : best[amount];
}
`,
  },
  {
    id: 'dsa-12-quiz',
    title: 'Checkpoint: Complexity Judgement',
    language: 'javascript',
    kind: 'quiz',
    module: 'Sorting & DP',
    difficulty: 4,
    concepts: ['big-o', 'data-structures', 'trade-offs', 'review'],
    instructions: `Interviewers rarely ask "what is Big-O". They show you code and ask what it costs, or describe a situation and ask which structure you would use. That is what this checkpoint drills.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'What is the complexity of `for (const x of a) { if (b.includes(x)) count++; }` where both arrays have n items?',
        choices: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
        answerIndex: 2,
        explanation:
          'O(n²). `includes` scans, so it is an O(n) operation inside an O(n) loop. Converting b to a Set first makes the check O(1) and the whole thing O(n). This is the most common accidental quadratic in real code.',
      },
      {
        id: 'q2',
        prompt: 'You need to repeatedly check membership in a collection of 100,000 strings. What do you use?',
        choices: ['An array with includes', 'A Set', 'A sorted array with binary search', 'A linked list'],
        answerIndex: 1,
        explanation:
          'A Set — O(1) average lookup with no need to keep anything sorted. Binary search on a sorted array is a reasonable second answer at O(log n), and is preferable if you also need ordered traversal or range queries.',
      },
      {
        id: 'q3',
        prompt: 'Which requires a sorted input to be correct?',
        choices: ['Hash map lookup', 'Binary search', 'Breadth-first search', 'Merge sort'],
        answerIndex: 1,
        explanation:
          'Binary search. And its failure mode is nasty: on unsorted input it does not crash, it silently returns wrong answers. Merge sort produces sorted output but does not require it as input.',
      },
      {
        id: 'q4',
        prompt: 'Which finds the shortest path in an unweighted graph?',
        choices: ['DFS', 'BFS', 'Either works', 'Neither — you need Dijkstra'],
        answerIndex: 1,
        explanation:
          'BFS. It explores every node at distance 1 before any at distance 2, so the first time it reaches the target it has done so in the fewest hops. DFS finds a path but not necessarily the shortest. Weighted edges are where Dijkstra becomes necessary.',
      },
      {
        id: 'q5',
        prompt: 'Naive recursive Fibonacci is O(2ⁿ). What single change makes it O(n)?',
        choices: [
          'Using a for loop instead',
          'Caching results by input (memoisation)',
          'Using BigInt',
          'Making it async',
        ],
        answerIndex: 1,
        explanation:
          'Memoisation. The exponential cost comes entirely from recomputing the same subproblems; caching them means each value is computed once. Rewriting it iteratively achieves the same complexity and is really the bottom-up form of the same idea.',
      },
      {
        id: 'q6',
        prompt: 'A binary search tree gives O(log n) lookup. When does that guarantee fail?',
        choices: [
          'When the tree holds strings',
          'When the tree is unbalanced, for instance built from sorted input',
          'When it has more than 1000 nodes',
          'It never fails',
        ],
        answerIndex: 1,
        explanation:
          'When it is unbalanced. Inserting already-sorted data produces a chain with no branching — effectively a linked list, O(n) lookup. This is why production systems use self-balancing trees such as red-black or AVL.',
      },
      {
        id: 'q7',
        prompt: 'What does it mean for a sort to be "stable"?',
        choices: [
          'It never crashes',
          'Equal elements keep their original relative order',
          'It always runs in O(n log n)',
          'It sorts in place',
        ],
        answerIndex: 1,
        explanation:
          'Equal elements keep their relative order. It matters when you sort by several keys in sequence: sort by date, then by author, and a stable sort leaves each author’s rows still in date order. Merge sort is stable; classic quicksort is not.',
      },
      {
        id: 'q8',
        prompt: 'A function builds a Set of all n inputs to answer queries fast. How would you describe it?',
        choices: [
          'O(n) time, O(1) space',
          'O(n) time, O(n) space',
          'O(n²) time, O(n) space',
          'O(1) time, O(n) space',
        ],
        answerIndex: 1,
        explanation:
          'O(n) time and O(n) space — the classic trade. Being explicit about both dimensions is what interviewers listen for; candidates who only ever mention time sound like they have memorised the notation rather than understood it.',
      },
    ],
  },
];
