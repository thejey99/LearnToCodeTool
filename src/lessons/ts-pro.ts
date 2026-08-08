import type { LessonDraft } from '../types';

/**
 * The second half of the TypeScript track.
 *
 * Honest constraint, which lesson ts-14 makes explicit rather than hiding:
 * the sandbox strips types and runs the JavaScript, so tests verify runtime
 * behaviour. Tasks are therefore designed so that getting the types right is
 * what makes the runtime behaviour right — exhaustiveness checks, type
 * guards, and `as const` lookups all have observable consequences.
 */
export const TS_PRO_LESSONS: LessonDraft[] = [
  {
    id: 'ts-08-narrowing',
    title: 'Narrowing',
    language: 'typescript',
    module: 'Working With Types',
    difficulty: 3,
    concepts: ['narrowing', 'type-guards', 'unions', 'control-flow'],
    instructions: `A union type says a value could be several things. **Narrowing** is how you convince TypeScript which one it is right now.

\`\`\`ts
function format(value: string | number): string {
  return value.toFixed(2);   // Error: toFixed does not exist on string
}
\`\`\`

TypeScript is right to refuse — half the time that value is a string. Check first, and TypeScript follows your reasoning:

\`\`\`ts
function format(value: string | number): string {
  if (typeof value === "number") {
    return value.toFixed(2);   // here it is definitely a number
  }
  return value.toUpperCase();  // and here it is definitely a string
}
\`\`\`

This is **control-flow analysis**: TypeScript tracks what must be true on each branch. It is the feature that makes union types practical rather than annoying.

### The narrowing tools

\`\`\`ts
typeof x === "string"        // string, number, boolean, symbol, bigint, function, object, undefined
Array.isArray(x)             // arrays
x instanceof Date            // classes
"radius" in shape            // does the object have this property?
x === null                   // equality against a literal narrows too
\`\`\`

### Truthiness narrows, and cuts too deep

\`\`\`ts
function greet(name?: string) {
  if (name) return \`Hello \${name}\`;   // narrowed to string
  return "Hello stranger";
}
\`\`\`

Careful: this also excludes the **empty string**, which is often a legitimate value. When you mean "was it provided", write \`if (name !== undefined)\`. Same trap as \`||\` versus \`??\` in the JavaScript track, wearing a different hat.

### typeof null

\`typeof null === "object"\`, that 1995 bug again. So \`typeof x === "object"\` does **not** exclude null, and TypeScript knows it — you need an explicit \`x !== null\` check.

## YOUR TASK

1. \`describe(value: string | number | boolean)\` — \`"text: hi"\`, \`"number: 3.50"\` (two decimals), or \`"boolean: true"\`
2. \`lengthOf(value: string | unknown[] | null)\` — the length, or \`0\` for null
3. \`labelFor(value: string | null | undefined)\` — the string itself, but \`"(none)"\` when it is null or undefined. An **empty string must stay an empty string**.`,
    starterCode: `function describe(value: string | number | boolean): string {
}

function lengthOf(value: string | unknown[] | null): number {
}

function labelFor(value: string | null | undefined): string {
}
`,
    testCode: `test("describe handles each member of the union", () => {
  expect(describe("hi")).toBe("text: hi");
  expect(describe(3.5)).toBe("number: 3.50");
  expect(describe(true)).toBe("boolean: true");
  expect(describe(false)).toBe("boolean: false");
});

test("describe formats numbers to two decimals", () => {
  expect(describe(7)).toBe("number: 7.00");
});

test("lengthOf measures strings and arrays", () => {
  expect(lengthOf("hello")).toBe(5);
  expect(lengthOf([1, 2, 3])).toBe(3);
  expect(lengthOf("")).toBe(0);
  expect(lengthOf([])).toBe(0);
});

test("lengthOf treats null as zero", () => {
  expect(lengthOf(null)).toBe(0);
});

test("labelFor passes real strings through", () => {
  expect(labelFor("Ada")).toBe("Ada");
});

test("labelFor replaces null and undefined", () => {
  expect(labelFor(null)).toBe("(none)");
  expect(labelFor(undefined)).toBe("(none)");
});

test("labelFor keeps the empty string", () => {
  expect(labelFor("")).toBe("");
});`,
    hints: [
      'Narrow with `typeof value === "number"` and `typeof value === "boolean"`, leaving string as the fall-through.',
      '`toFixed(2)` gives you the two-decimal formatting.',
      'For `labelFor`, a truthiness check would swallow the empty string — compare against null and undefined explicitly, which `value == null` does in one go.',
    ],
    solution: `function describe(value: string | number | boolean): string {
  if (typeof value === "number") return \`number: \${value.toFixed(2)}\`;
  if (typeof value === "boolean") return \`boolean: \${value}\`;
  return \`text: \${value}\`;
}

function lengthOf(value: string | unknown[] | null): number {
  if (value === null) return 0;
  return value.length;
}

function labelFor(value: string | null | undefined): string {
  if (value === null || value === undefined) return "(none)";
  return value;
}
`,
  },
  {
    id: 'ts-09-discriminated-unions',
    title: 'Discriminated Unions',
    language: 'typescript',
    module: 'Working With Types',
    difficulty: 4,
    concepts: ['discriminated-unions', 'exhaustiveness', 'never', 'modelling'],
    instructions: `This is the single most valuable pattern in TypeScript, and the one that most changes how you design data.

Give every member of a union a shared literal field — the **discriminant** — and narrowing becomes effortless:

\`\`\`ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;   // radius is known here
    case "square": return shape.size ** 2;
    case "rect":   return shape.width * shape.height;
  }
}
\`\`\`

Inside each case, TypeScript knows exactly which member you have and which fields exist. Ask for \`shape.radius\` in the square branch and it is an error.

### Making invalid states unrepresentable

Compare the shape people write first:

\`\`\`ts
interface Shape {
  kind: string;
  radius?: number;
  size?: number;
  width?: number;
  height?: number;
}
\`\`\`

Every field is optional, so \`{ kind: "circle", width: 3 }\` type-checks — a circle with a width and no radius. The union makes that combination *impossible to construct*. Pushing correctness into the type instead of into runtime checks is the whole game.

The same pattern models request state (\`{status:"loading"} | {status:"error", error:string} | {status:"success", data:T}\`), which is exactly the four-states problem from the front-end track — and it is why separate \`isLoading\` and \`hasError\` booleans are the wrong shape.

### Exhaustiveness with never

\`\`\`ts
default: {
  const impossible: never = shape;
  throw new Error(\`Unhandled shape: \${JSON.stringify(impossible)}\`);
}
\`\`\`

\`never\` is the type with no values. If you have handled every case, the value reaching \`default\` has type \`never\` and the assignment compiles. Add a fourth shape and forget its case, and **that line fails to compile** — the compiler points at the code you forgot to update.

This turns "add a variant and hunt for every switch statement" into a task the compiler does for you. It is the argument that wins TypeScript sceptics over.

## YOUR TASK

1. A \`Shape\` discriminated union: \`circle\` with \`radius\`, \`square\` with \`size\`, \`rect\` with \`width\` and \`height\`
2. \`area(shape)\` — rounded to two decimals, with a \`never\` exhaustiveness check in the default that **throws** on an unknown kind
3. \`totalArea(shapes)\` — the sum of the areas, rounded to two decimals`,
    starterCode: `type Shape =
  // three members, each with a "kind" discriminant
  ;

function area(shape: Shape): number {
}

function totalArea(shapes: Shape[]): number {
}
`,
    testCode: `test("area of a circle", () => {
  expect(area({ kind: "circle", radius: 1 })).toBe(3.14);
  expect(area({ kind: "circle", radius: 2 })).toBe(12.57);
});

test("area of a square", () => {
  expect(area({ kind: "square", size: 3 })).toBe(9);
});

test("area of a rectangle", () => {
  expect(area({ kind: "rect", width: 2, height: 5 })).toBe(10);
});

test("an unknown kind throws rather than returning undefined", () => {
  expect(() => area({ kind: "triangle", base: 1 } as any)).toThrow();
});

test("totalArea sums every shape", () => {
  const shapes: Shape[] = [
    { kind: "square", size: 2 },
    { kind: "rect", width: 3, height: 4 },
  ];
  expect(totalArea(shapes)).toBe(16);
});

test("totalArea of nothing is zero", () => {
  expect(totalArea([])).toBe(0);
});

test("totalArea rounds the result", () => {
  expect(totalArea([{ kind: "circle", radius: 1 }])).toBe(3.14);
});`,
    hints: [
      'Each union member is an object type with a literal `kind`, joined by `|`.',
      'Round with `Math.round(value * 100) / 100`.',
      'In the default branch, assign the value to a `const impossible: never` and then throw — that assignment is what makes the compiler catch a missing case later.',
    ],
    solution: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rect"; width: number; height: number };

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return round2(Math.PI * shape.radius ** 2);
    case "square":
      return round2(shape.size ** 2);
    case "rect":
      return round2(shape.width * shape.height);
    default: {
      const impossible: never = shape;
      throw new Error(\`Unhandled shape: \${JSON.stringify(impossible)}\`);
    }
  }
}

function totalArea(shapes: Shape[]): number {
  return round2(shapes.reduce((sum, shape) => sum + area(shape), 0));
}
`,
  },
  {
    id: 'ts-10-shapes',
    title: 'Optional, Readonly and Index Signatures',
    language: 'typescript',
    module: 'Working With Types',
    difficulty: 3,
    concepts: ['optional-properties', 'readonly', 'index-signatures', 'interfaces'],
    instructions: `Three modifiers that let an interface describe what your data is really like.

### Optional properties

\`\`\`ts
interface Config {
  host: string;
  port?: number;        // may be absent
}
\`\`\`

\`port\` is now \`number | undefined\`, and TypeScript forces you to deal with the undefined before using it. Note the difference between "optional" and "required but possibly undefined":

\`\`\`ts
interface A { port?: number }              // { host } is valid
interface B { port: number | undefined }   // you must write port: undefined
\`\`\`

Use \`?\` for genuinely optional configuration; use the explicit union when a caller must consciously decide.

### readonly

\`\`\`ts
interface Point {
  readonly x: number;
  readonly y: number;
}

const p: Point = { x: 1, y: 2 };
p.x = 5;                     // Error
\`\`\`

And for arrays:

\`\`\`ts
function sum(nums: readonly number[]): number { ... }
\`\`\`

A \`readonly number[]\` parameter has no \`push\`, \`pop\` or \`sort\` — the signature now *promises* the function will not modify what you passed in. That is documentation the compiler enforces, and it directly addresses the mutation bugs from the JavaScript track.

\`readonly\` is compile-time only: nothing stops \`(p as any).x = 5\` at runtime.

### Index signatures

For objects whose keys you do not know in advance:

\`\`\`ts
interface Counts {
  [word: string]: number;
}
\`\`\`

The name \`word\` is documentation; only the types matter. The catch is that TypeScript will then happily let you read a key that does not exist and hand you a \`number\` that is actually \`undefined\`. \`Record<string, number>\` is the more idiomatic spelling, and the \`noUncheckedIndexedAccess\` compiler option makes the lie visible.

## YOUR TASK

1. An interface \`Settings\` with \`host: string\`, an optional \`port\`, and an optional \`tags\` array of strings
2. \`describeSettings(settings)\` — \`"example.com:8080 [a, b]"\`, defaulting the port to \`443\` and omitting the bracketed part when there are no tags
3. \`sumAll(nums: readonly number[])\` — the total, without modifying the array
4. \`mergeCounts(a, b)\` — combine two \`Record<string, number>\` objects, adding values for shared keys`,
    starterCode: `interface Settings {
}

function describeSettings(settings: Settings): string {
}

function sumAll(nums: readonly number[]): number {
}

function mergeCounts(
  a: Record<string, number>,
  b: Record<string, number>
): Record<string, number> {
}
`,
    testCode: `test("describeSettings uses host and port", () => {
  expect(describeSettings({ host: "example.com", port: 8080 })).toBe("example.com:8080");
});

test("describeSettings defaults the port to 443", () => {
  expect(describeSettings({ host: "example.com" })).toBe("example.com:443");
});

test("describeSettings appends tags when present", () => {
  expect(describeSettings({ host: "a.com", port: 80, tags: ["x", "y"] })).toBe("a.com:80 [x, y]");
});

test("describeSettings omits an empty tag list", () => {
  expect(describeSettings({ host: "a.com", port: 80, tags: [] })).toBe("a.com:80");
});

test("sumAll totals the array", () => {
  expect(sumAll([1, 2, 3])).toBe(6);
  expect(sumAll([])).toBe(0);
});

test("sumAll leaves the input untouched", () => {
  const nums = [3, 1, 2];
  sumAll(nums);
  expect(nums).toEqual([3, 1, 2]);
});

test("mergeCounts adds shared keys", () => {
  expect(mergeCounts({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 5, c: 4 });
});

test("mergeCounts handles empty objects", () => {
  expect(mergeCounts({}, {})).toEqual({});
  expect(mergeCounts({ a: 1 }, {})).toEqual({ a: 1 });
});

test("mergeCounts does not mutate its inputs", () => {
  const a = { x: 1 };
  const b = { x: 2 };
  mergeCounts(a, b);
  expect(a).toEqual({ x: 1 });
  expect(b).toEqual({ x: 2 });
});`,
    hints: [
      'Optional properties are marked with `?`: `port?: number;` and `tags?: string[];`.',
      'Default the port with `??`, not `||`, and check `tags?.length` before adding the bracketed section.',
      'For `mergeCounts`, start from a copy — `{ ...a }` — then loop `Object.entries(b)` adding into it.',
    ],
    solution: `interface Settings {
  host: string;
  port?: number;
  tags?: string[];
}

function describeSettings(settings: Settings): string {
  const port = settings.port ?? 443;
  const base = \`\${settings.host}:\${port}\`;
  if (!settings.tags || settings.tags.length === 0) return base;
  return \`\${base} [\${settings.tags.join(", ")}]\`;
}

function sumAll(nums: readonly number[]): number {
  return nums.reduce((total, n) => total + n, 0);
}

function mergeCounts(
  a: Record<string, number>,
  b: Record<string, number>
): Record<string, number> {
  const merged: Record<string, number> = { ...a };
  for (const [key, value] of Object.entries(b)) {
    merged[key] = (merged[key] ?? 0) + value;
  }
  return merged;
}
`,
  },
  {
    id: 'ts-11-utility-types',
    title: 'Utility Types',
    language: 'typescript',
    module: 'Composing Types',
    difficulty: 4,
    concepts: ['utility-types', 'partial', 'pick', 'omit', 'record'],
    instructions: `TypeScript ships transformations that build one type from another. Using them instead of copying an interface and editing it is what keeps a codebase's types in step with each other.

\`\`\`ts
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}
\`\`\`

\`\`\`ts
Partial<User>              // every field optional — perfect for an update payload
Required<User>             // every field mandatory
Pick<User, "id" | "name">  // just those two
Omit<User, "createdAt">    // everything except that
Readonly<User>             // every field readonly
Record<string, User>       // an object keyed by string
\`\`\`

These compose:

\`\`\`ts
type UserUpdate = Partial<Omit<User, "id" | "createdAt">>;
\`\`\`

"Anything about a user you may change, all optional, minus the fields you may not touch." That single line expresses a rule that would otherwise live in a comment and go stale.

### Why it matters

Add a field to \`User\` and every derived type updates automatically. Duplicate the interface by hand and they drift — and drifting types are worse than no types, because they are confidently wrong.

The pattern you will meet most is the update endpoint:

\`\`\`ts
function updateUser(id: number, changes: Partial<User>): User { ... }
\`\`\`

The caller may send any subset; the compiler still checks each field's type and rejects a field that does not exist.

> \`Omit\` is deliberately permissive about keys that are not in the type, which occasionally hides a typo. \`Pick\` is stricter, so prefer it when the list is short.

### Applying a partial update, type-safely

The obvious implementation is a loop over \`Object.entries(changes)\` assigning into a copy. It works at runtime and **does not type-check**, because TypeScript cannot express that a key and its value belong together — it only knows the key is one of several and the value is one of several, not that they are the matching pair. Writing it needs a cast, and a cast is a promise, not a check.

The idiomatic alternative is the **conditional spread**:

\`\`\`ts
return {
  ...user,
  ...(changes.name !== undefined && { name: changes.name }),
};
\`\`\`

Spreading \`false\` contributes nothing, so the property appears only when there is a value — and every field keeps its real type all the way through. It is more verbose and completely honest, which is usually the right trade.

## YOUR TASK

Given a \`User\` interface with \`id: number\`, \`name: string\`, \`email: string\`, \`active: boolean\`:

1. \`type UserSummary = Pick<...>\` — just \`id\` and \`name\`
2. \`type UserUpdate = Partial<Omit<...>>\` — any changeable field, id excluded
3. \`summarise(user)\` — returns a \`UserSummary\` containing **only** those two fields
4. \`applyUpdate(user, changes)\` — a new user with the changes applied, ignoring any \`undefined\` value so an explicit \`undefined\` cannot wipe a field
5. \`indexById(users)\` — a \`Record<number, User>\``,
    starterCode: `interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

type UserSummary = ;

type UserUpdate = ;

function summarise(user: User): UserSummary {
}

function applyUpdate(user: User, changes: UserUpdate): User {
}

function indexById(users: User[]): Record<number, User> {
}
`,
    testCode: `const ADA: User = { id: 1, name: "Ada", email: "ada@example.com", active: true };

test("summarise keeps only id and name", () => {
  expect(summarise(ADA)).toEqual({ id: 1, name: "Ada" });
});

test("summarise drops the other fields entirely", () => {
  const result = summarise(ADA) as Record<string, unknown>;
  expect(Object.keys(result).sort()).toEqual(["id", "name"]);
});

test("applyUpdate applies changes", () => {
  expect(applyUpdate(ADA, { name: "Ada L" })).toEqual({
    id: 1, name: "Ada L", email: "ada@example.com", active: true,
  });
});

test("applyUpdate can change several fields", () => {
  const updated = applyUpdate(ADA, { name: "X", active: false });
  expect(updated.name).toBe("X");
  expect(updated.active).toBe(false);
});

test("applyUpdate does not mutate the original", () => {
  applyUpdate(ADA, { name: "Changed" });
  expect(ADA.name).toBe("Ada");
});

test("applyUpdate ignores undefined values", () => {
  const updated = applyUpdate(ADA, { name: undefined });
  expect(updated.name).toBe("Ada");
});

test("applyUpdate with no changes returns an equal user", () => {
  expect(applyUpdate(ADA, {})).toEqual(ADA);
});

test("indexById keys users by their id", () => {
  const alan: User = { id: 2, name: "Alan", email: "a@b.c", active: false };
  expect(indexById([ADA, alan])).toEqual({ 1: ADA, 2: alan });
  expect(indexById([])).toEqual({});
});`,
    hints: [
      '`Pick<User, "id" | "name">` and `Partial<Omit<User, "id">>` are the two type aliases.',
      '`summarise` must build a fresh object — spreading the user would carry the other fields through at runtime, and one test checks exactly that.',
      'In `applyUpdate`, use one conditional spread per changeable field: `...(changes.name !== undefined && { name: changes.name })`.',
    ],
    solution: `interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

type UserSummary = Pick<User, "id" | "name">;

type UserUpdate = Partial<Omit<User, "id">>;

function summarise(user: User): UserSummary {
  return { id: user.id, name: user.name };
}

function applyUpdate(user: User, changes: UserUpdate): User {
  return {
    ...user,
    ...(changes.name !== undefined && { name: changes.name }),
    ...(changes.email !== undefined && { email: changes.email }),
    ...(changes.active !== undefined && { active: changes.active }),
  };
}

function indexById(users: User[]): Record<number, User> {
  const index: Record<number, User> = {};
  for (const user of users) index[user.id] = user;
  return index;
}
`,
  },
  {
    id: 'ts-12-generic-constraints',
    title: 'Generic Constraints and keyof',
    language: 'typescript',
    module: 'Composing Types',
    difficulty: 5,
    concepts: ['generics', 'constraints', 'keyof', 'lookup-types'],
    instructions: `A bare \`<T>\` means "any type at all", so you can do almost nothing with it. **Constraints** let you require capabilities while staying generic.

\`\`\`ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hello", "hi");       // works — strings have length
longest([1, 2], [3]);         // works — arrays do too
longest(1, 2);                // Error — numbers do not
\`\`\`

\`extends\` here means "at least this", not inheritance. Inside the function \`T\` is still whatever the caller passed, so the return type is exactly right — call it with strings and you get a string back, not a \`{length: number}\`.

### keyof

\`keyof T\` is the union of a type's property names:

\`\`\`ts
interface User { id: number; name: string }
type UserKey = keyof User;      // "id" | "name"
\`\`\`

Combine the two and you get the classic type-safe property accessor:

\`\`\`ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

get(user, "name");     // typed string
get(user, "id");       // typed number
get(user, "nmae");     // Error, caught as you type
\`\`\`

\`T[K]\` is a **lookup type**: the type of that property. So this one function returns a different, correct type for every key — no overloads, no casts. A typo in a property name becomes a compile error, which in plain JavaScript would be \`undefined\` propagating quietly until something downstream breaks.

This exact signature is why libraries like Lodash have precise types today.

### Generic constraints on the value, too

\`\`\`ts
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

pluck(users, "name");   // string[]
\`\`\`

## YOUR TASK

1. \`longest<T extends { length: number }>(a, b)\` — the longer of two, preferring \`a\` on a tie
2. \`get<T, K extends keyof T>(obj, key)\` — the property value
3. \`pluck<T, K extends keyof T>(items, key)\` — that property from every item
4. \`groupBy<T, K extends keyof T>(items, key)\` — a \`Record<string, T[]>\` grouping items by the string form of that property, preserving order`,
    starterCode: `function longest<T extends { length: number }>(a: T, b: T): T {
}

function get<T, K extends keyof T>(obj: T, key: K): T[K] {
}

function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
}

function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {
}
`,
    testCode: `interface Person {
  name: string;
  age: number;
  city: string;
}

const PEOPLE: Person[] = [
  { name: "Ada", age: 36, city: "London" },
  { name: "Alan", age: 41, city: "London" },
  { name: "Grace", age: 45, city: "New York" },
];

test("longest picks the longer value", () => {
  expect(longest("hello", "hi")).toBe("hello");
  expect(longest([1, 2], [3])).toEqual([1, 2]);
});

test("longest prefers the first on a tie", () => {
  expect(longest("ab", "cd")).toBe("ab");
});

test("get reads a property", () => {
  expect(get(PEOPLE[0], "name")).toBe("Ada");
  expect(get(PEOPLE[0], "age")).toBe(36);
});

test("pluck collects one property from every item", () => {
  expect(pluck(PEOPLE, "name")).toEqual(["Ada", "Alan", "Grace"]);
  expect(pluck(PEOPLE, "age")).toEqual([36, 41, 45]);
});

test("pluck on an empty list is empty", () => {
  expect(pluck([] as Person[], "name")).toEqual([]);
});

test("groupBy groups by the chosen property", () => {
  const grouped = groupBy(PEOPLE, "city");
  expect(Object.keys(grouped)).toEqual(["London", "New York"]);
  expect(grouped["London"]).toHaveLength(2);
  expect(grouped["New York"][0].name).toBe("Grace");
});

test("groupBy handles numeric values as string keys", () => {
  const grouped = groupBy(PEOPLE, "age");
  expect(grouped["36"]).toHaveLength(1);
});

test("groupBy of nothing is an empty object", () => {
  expect(groupBy([] as Person[], "city")).toEqual({});
});`,
    hints: [
      '`longest` is one line with `>=` so a tie returns `a`.',
      '`get` and `pluck` are `obj[key]` and `items.map((item) => item[key])` — the work is all in the signature.',
      'In `groupBy`, convert the key with `String(item[key])`, then build the record with the same create-if-missing-then-push pattern as the algorithms track.',
    ],
    solution: `function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
  }
  return groups;
}
`,
  },
  {
    id: 'ts-13-unknown',
    title: 'unknown, any, and Guarding the Boundary',
    language: 'typescript',
    module: 'Composing Types',
    difficulty: 5,
    concepts: ['unknown', 'any', 'type-predicates', 'validation'],
    instructions: `Data arriving from outside your program — an API response, \`localStorage\`, a webhook, a config file — is not typed. It is whatever the sender felt like sending.

\`\`\`ts
const data = await response.json();    // any
data.user.name.toUpperCase();          // compiles. May explode at runtime.
\`\`\`

### any switches the compiler off

\`any\` means "stop checking". Every property access on it is allowed, every call compiles, and the type infection spreads to everything it touches. A single \`any\` at your API boundary can void the guarantees of an entire module.

### unknown is the honest version

\`unknown\` also means "could be anything", but you **must narrow it before use**:

\`\`\`ts
function handle(input: unknown) {
  input.toUpperCase();               // Error, and rightly so
  if (typeof input === "string") {
    input.toUpperCase();             // fine
  }
}
\`\`\`

Same amount of ignorance, enforced instead of ignored. Type external data as \`unknown\` and let the compiler make you validate it.

### Type predicates

A function whose return type is \`value is Something\` teaches the compiler what a successful check means:

\`\`\`ts
interface User { id: number; name: string }

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as User).id === "number" &&
    typeof (value as User).name === "string"
  );
}

const parsed: unknown = JSON.parse(text);
if (isUser(parsed)) {
  parsed.name;         // narrowed to User
}
\`\`\`

The compiler cannot verify that your check is correct — the predicate is a promise you are making. So the validation must genuinely cover every field, including the \`value !== null\` line that \`typeof x === "object"\` does not give you.

> In real projects a schema library (Zod, Valibot) generates both the validator and the type from one declaration, so they cannot drift apart. Hand-writing one first is how you understand what those libraries are doing.

## YOUR TASK

1. \`isUser(value)\` — a type predicate for \`{ id: number; name: string }\`. Rejects null, arrays, missing fields and wrong types. Extra properties are fine.
2. \`parseUser(text)\` — parses JSON and returns the \`User\`, or \`null\` for invalid JSON or a non-matching shape. Must never throw.
3. \`parseUsers(text)\` — parses a JSON array and returns only the valid users; \`[]\` for anything that is not an array.`,
    starterCode: `interface User {
  id: number;
  name: string;
}

function isUser(value: unknown): value is User {
}

function parseUser(text: string): User | null {
}

function parseUsers(text: string): User[] {
}
`,
    testCode: `test("isUser accepts a valid user", () => {
  expect(isUser({ id: 1, name: "Ada" })).toBe(true);
});

test("isUser allows extra properties", () => {
  expect(isUser({ id: 1, name: "Ada", extra: true })).toBe(true);
});

test("isUser rejects missing or wrong fields", () => {
  expect(isUser({ id: 1 })).toBe(false);
  expect(isUser({ name: "Ada" })).toBe(false);
  expect(isUser({ id: "1", name: "Ada" })).toBe(false);
  expect(isUser({ id: 1, name: 2 })).toBe(false);
});

test("isUser rejects null, arrays and primitives", () => {
  expect(isUser(null)).toBe(false);
  expect(isUser(undefined)).toBe(false);
  expect(isUser([])).toBe(false);
  expect(isUser("Ada")).toBe(false);
  expect(isUser(42)).toBe(false);
});

test("parseUser parses valid JSON", () => {
  expect(parseUser('{"id":1,"name":"Ada"}')).toEqual({ id: 1, name: "Ada" });
});

test("parseUser returns null for invalid JSON", () => {
  expect(parseUser("{not json")).toBeNull();
  expect(parseUser("")).toBeNull();
});

test("parseUser returns null for the wrong shape", () => {
  expect(parseUser('{"id":1}')).toBeNull();
  expect(parseUser('[]')).toBeNull();
  expect(parseUser('null')).toBeNull();
});

test("parseUsers keeps only the valid entries", () => {
  const text = '[{"id":1,"name":"Ada"},{"id":2},{"id":3,"name":"Grace"}]';
  expect(parseUsers(text)).toEqual([{ id: 1, name: "Ada" }, { id: 3, name: "Grace" }]);
});

test("parseUsers returns an empty array for non-arrays and bad JSON", () => {
  expect(parseUsers('{"id":1,"name":"Ada"}')).toEqual([]);
  expect(parseUsers("nope")).toEqual([]);
  expect(parseUsers("[]")).toEqual([]);
});`,
    hints: [
      'Start `isUser` with `typeof value === "object" && value !== null && !Array.isArray(value)` — arrays are objects too.',
      'Cast once to read the fields: `const candidate = value as Record<string, unknown>;` then check each with `typeof`.',
      '`parseUser` wraps `JSON.parse` in try/catch and then runs `isUser` on the result; `parseUsers` additionally checks `Array.isArray` before filtering.',
    ],
    solution: `interface User {
  id: number;
  name: string;
}

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === "number" && typeof candidate.name === "string";
}

function parseUser(text: string): User | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  return isUser(parsed) ? parsed : null;
}

function parseUsers(text: string): User[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isUser);
}
`,
  },
  {
    id: 'ts-14-erasure',
    title: 'Types Are Erased',
    language: 'typescript',
    module: 'TypeScript in Practice',
    difficulty: 4,
    concepts: ['type-erasure', 'as-const', 'runtime-validation', 'compilation'],
    instructions: `Every type you write disappears before the code runs. This is the most important thing to understand about TypeScript, and the source of most confusion about what it can and cannot do for you.

\`\`\`ts
interface User { id: number; name: string }
const user: User = { id: 1, name: "Ada" };
\`\`\`

compiles to

\`\`\`js
const user = { id: 1, name: "Ada" };
\`\`\`

The interface is gone. So:

\`\`\`ts
if (value instanceof User) { }        // Error: User is a type, not a value
if (typeof value === "User") { }      // never true
\`\`\`

There is no runtime check for an interface — which is exactly why the previous lesson had you write \`isUser\` by hand.

> This app's sandbox strips types with Sucrase and runs the JavaScript, so the tests here check runtime behaviour. That is not a shortcut peculiar to this app: it is what \`tsc\`, Babel, esbuild and Node's type stripping all do too. Type errors are caught by the compiler in your editor and in CI, never by the running program.

### What this means in practice

**Types cannot validate input.** A response typed as \`User\` is a claim, not a check. If the API sends something else, your program believes the lie until it crashes somewhere unrelated. Boundaries need real runtime validation.

**A cast is a promise, not a conversion.** \`value as User\` performs nothing at runtime — it only silences the compiler. Casting to escape an error usually relocates the error to a worse place.

### What survives compilation

Some constructs are values as well as types, and those do exist at runtime: \`class\`, \`enum\`, and plain objects. So:

\`\`\`ts
const STATUS = {
  active: "Active",
  archived: "Archived",
} as const;

type Status = keyof typeof STATUS;      // "active" | "archived"
\`\`\`

This is the pattern to learn. \`as const\` makes every property \`readonly\` and narrows the values to literals rather than \`string\`. Then \`typeof STATUS\` gets the type back from the value, and \`keyof\` extracts the keys — one object serving as both the runtime lookup table and the source of the type. Change the object, and the type changes with it.

Most teams now prefer this to \`enum\`, which generates extra runtime code and has some genuinely surprising behaviour.

## YOUR TASK

1. \`const STATUS\` — an \`as const\` object mapping \`active\`, \`archived\`, \`pending\` to \`"Active"\`, \`"Archived"\`, \`"Pending"\`
2. \`type StatusKey = keyof typeof STATUS\`
3. \`labelFor(key)\` — the label for a key
4. \`isStatusKey(value: string)\` — a **runtime** check, since the type cannot do it, narrowing to \`StatusKey\`
5. \`parseStatus(value: string)\` — the label, or \`"Unknown"\``,
    starterCode: `const STATUS = {
  // three entries, then "as const"
};

type StatusKey = ;

function labelFor(key: StatusKey): string {
}

function isStatusKey(value: string): value is StatusKey {
}

function parseStatus(value: string): string {
}
`,
    testCode: `test("STATUS exists at runtime", () => {
  expect(STATUS.active).toBe("Active");
  expect(STATUS.archived).toBe("Archived");
  expect(STATUS.pending).toBe("Pending");
});

test("STATUS has exactly three keys", () => {
  expect(Object.keys(STATUS).sort()).toEqual(["active", "archived", "pending"]);
});

test("labelFor returns the label", () => {
  expect(labelFor("active")).toBe("Active");
  expect(labelFor("pending")).toBe("Pending");
});

test("isStatusKey accepts real keys", () => {
  expect(isStatusKey("active")).toBe(true);
  expect(isStatusKey("archived")).toBe(true);
});

test("isStatusKey rejects anything else", () => {
  expect(isStatusKey("deleted")).toBe(false);
  expect(isStatusKey("")).toBe(false);
  expect(isStatusKey("Active")).toBe(false);
});

test("isStatusKey is not fooled by inherited properties", () => {
  expect(isStatusKey("toString")).toBe(false);
  expect(isStatusKey("constructor")).toBe(false);
});

test("parseStatus converts a valid key", () => {
  expect(parseStatus("archived")).toBe("Archived");
});

test("parseStatus falls back for an unknown key", () => {
  expect(parseStatus("deleted")).toBe("Unknown");
  expect(parseStatus("")).toBe("Unknown");
});`,
    hints: [
      'The `as const` goes after the closing brace of the object literal.',
      '`type StatusKey = keyof typeof STATUS;` — `typeof` on a value gives its type, `keyof` then gives the key union.',
      'For the runtime check use `Object.prototype.hasOwnProperty.call(STATUS, value)`, or `Object.keys(STATUS).includes(value)` — a plain `value in STATUS` would also match inherited names like `toString`.',
    ],
    solution: `const STATUS = {
  active: "Active",
  archived: "Archived",
  pending: "Pending",
} as const;

type StatusKey = keyof typeof STATUS;

function labelFor(key: StatusKey): string {
  return STATUS[key];
}

function isStatusKey(value: string): value is StatusKey {
  return Object.prototype.hasOwnProperty.call(STATUS, value);
}

function parseStatus(value: string): string {
  return isStatusKey(value) ? labelFor(value) : "Unknown";
}
`,
  },
  {
    id: 'ts-15-async-types',
    title: 'Typing Async Code and Results',
    language: 'typescript',
    module: 'TypeScript in Practice',
    difficulty: 5,
    concepts: ['promises', 'async-types', 'result-types', 'error-handling'],
    instructions: `An async function's return type is always a promise:

\`\`\`ts
async function loadUser(id: number): Promise<User> {
  const response = await fetch(\`/users/\${id}\`);
  return response.json() as Promise<User>;
}
\`\`\`

Write \`Promise<User>\`, not \`User\` — TypeScript will remind you, and \`await\` unwraps it at the call site. \`Awaited<T>\` gets the inner type back when you need it generically.

### The problem with throwing

\`\`\`ts
async function loadUser(id: number): Promise<User> { ... }
\`\`\`

The signature says this returns a user. It does not say it might throw \`NotFoundError\`, or that the network might fail. **Exceptions are invisible in the type system** — TypeScript has no equivalent of Java's checked exceptions — so nothing forces a caller to handle failure, and forgetting is silent.

### The Result type

Model failure as a value instead, using the discriminated union from earlier in this track:

\`\`\`ts
type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function loadUser(id: number): Promise<Result<User>> {
  try {
    return { ok: true, value: await fetchUser(id) };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
\`\`\`

Now the signature tells the truth, and the caller *cannot* reach \`value\` without checking \`ok\` first — the compiler will not narrow the union until they do:

\`\`\`ts
const result = await loadUser(1);
result.value;                  // Error: not on the failure member
if (result.ok) result.value;   // fine
\`\`\`

This is standard in Rust and Go, increasingly common in TypeScript, and worth being able to discuss: the trade is more ceremony at every call site in exchange for failures that cannot be ignored. Most teams use it at boundaries — network, parsing, external input — and plain exceptions for genuine bugs.

### Typing a caught error

\`\`\`ts
try { ... } catch (err) {
  // err is unknown — anything can be thrown, not just Errors
  const message = err instanceof Error ? err.message : String(err);
}
\`\`\`

\`catch\` gives you \`unknown\` under modern settings, for good reason: \`throw "a string"\` is legal JavaScript.

## YOUR TASK

1. \`type Result<T, E = string>\` — the discriminated union above
2. \`ok(value)\` and \`err(error)\` — small constructors
3. \`attempt(fn)\` — runs a function, returning a success \`Result\` or a failure one whose \`error\` is the thrown \`Error\`'s message (or \`String(thrown)\` for a non-Error)
4. \`attemptAsync(fn)\` — the same for an async function, returning \`Promise<Result<T>>\`
5. \`unwrapOr(result, fallback)\` — the value, or the fallback on failure`,
    starterCode: `type Result<T, E = string> = ;

function ok<T>(value: T): Result<T, never> {
}

function err<E>(error: E): Result<never, E> {
}

function attempt<T>(fn: () => T): Result<T> {
}

async function attemptAsync<T>(fn: () => Promise<T>): Promise<Result<T>> {
}

function unwrapOr<T>(result: Result<T>, fallback: T): T {
}
`,
    testCode: `test("ok and err build the two shapes", () => {
  expect(ok(42)).toEqual({ ok: true, value: 42 });
  expect(err("nope")).toEqual({ ok: false, error: "nope" });
});

test("attempt captures a successful return", () => {
  expect(attempt(() => 2 + 2)).toEqual({ ok: true, value: 4 });
});

test("attempt captures a thrown Error's message", () => {
  const result = attempt(() => { throw new Error("boom"); });
  expect(result.ok).toBe(false);
  expect(result).toEqual({ ok: false, error: "boom" });
});

test("attempt handles a thrown non-Error", () => {
  const result = attempt(() => { throw "just a string"; });
  expect(result).toEqual({ ok: false, error: "just a string" });
});

test("attempt preserves falsy successful values", () => {
  expect(attempt(() => 0)).toEqual({ ok: true, value: 0 });
  expect(attempt(() => null)).toEqual({ ok: true, value: null });
});

test("attemptAsync resolves to a success result", async () => {
  expect(await attemptAsync(async () => "hi")).toEqual({ ok: true, value: "hi" });
});

test("attemptAsync captures a rejection", async () => {
  const result = await attemptAsync(async () => { throw new Error("network"); });
  expect(result).toEqual({ ok: false, error: "network" });
});

test("attemptAsync never rejects", async () => {
  let threw = false;
  try {
    await attemptAsync(async () => { throw new Error("x"); });
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

test("unwrapOr returns the value or the fallback", () => {
  expect(unwrapOr(ok(5) as Result<number>, 0)).toBe(5);
  expect(unwrapOr(err("bad") as Result<number>, 0)).toBe(0);
});

test("unwrapOr keeps a falsy success value", () => {
  expect(unwrapOr(ok(0) as Result<number>, 99)).toBe(0);
});`,
    hints: [
      'The union is `{ ok: true; value: T } | { ok: false; error: E }`.',
      'In the catch, `err instanceof Error ? err.message : String(err)` handles both cases the tests check.',
      '`unwrapOr` must branch on `result.ok`, not on the truthiness of the value — one test passes a successful `0`.',
    ],
    solution: `type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

function messageOf(thrown: unknown): string {
  return thrown instanceof Error ? thrown.message : String(thrown);
}

function attempt<T>(fn: () => T): Result<T> {
  try {
    return { ok: true, value: fn() };
  } catch (thrown) {
    return { ok: false, error: messageOf(thrown) };
  }
}

async function attemptAsync<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, value: await fn() };
  } catch (thrown) {
    return { ok: false, error: messageOf(thrown) };
  }
}

function unwrapOr<T>(result: Result<T>, fallback: T): T {
  return result.ok ? result.value : fallback;
}
`,
  },
  {
    id: 'ts-16-quiz',
    title: 'Checkpoint: TypeScript Judgement',
    language: 'typescript',
    kind: 'quiz',
    module: 'TypeScript in Practice',
    difficulty: 4,
    concepts: ['types', 'trade-offs', 'review'],
    instructions: `TypeScript interview questions are mostly about judgement — when a type earns its keep, and what the compiler is and is not doing for you.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'What happens to an `interface` when the code is compiled and run?',
        choices: [
          'It becomes a runtime object you can inspect',
          'It disappears entirely — types are erased',
          'It becomes a class',
          'It is checked on every object creation',
        ],
        answerIndex: 1,
        explanation:
          'Erased. Nothing about an interface exists at runtime, which is why `value instanceof MyInterface` is impossible and why external data needs a hand-written or generated validator. Types protect you while you write; they do nothing while you run.',
      },
      {
        id: 'q2',
        prompt: 'When should you reach for `any`?',
        choices: [
          'Whenever a type error is inconvenient',
          'Almost never — `unknown` gives the same flexibility while still requiring a check',
          'For all API responses',
          'For every function parameter',
        ],
        answerIndex: 1,
        explanation:
          '`unknown` expresses the same ignorance but forces you to narrow before use, whereas `any` switches checking off and spreads through everything it touches. A single `any` at a boundary can void the guarantees of a whole module.',
      },
      {
        id: 'q3',
        prompt: 'Why prefer a discriminated union over an interface with several optional fields?',
        choices: [
          'It compiles faster',
          'It makes invalid combinations impossible to construct, and narrows automatically',
          'It produces smaller JavaScript',
          'Optional fields are deprecated',
        ],
        answerIndex: 1,
        explanation:
          'All-optional fields permit nonsense like a circle with a width and no radius. A union makes that unrepresentable and lets the compiler narrow inside each branch. Add a `never` check in the default and it will even find every switch you forgot to update.',
      },
      {
        id: 'q4',
        prompt: 'What does `value as User` do at runtime?',
        choices: [
          'Validates that the value matches User',
          'Nothing — it only silences the compiler',
          'Converts the object into a User',
          'Throws if the shape is wrong',
        ],
        answerIndex: 1,
        explanation:
          'Nothing at all. A cast is a promise you are making to the compiler, not a check. Casting to make an error go away usually just relocates the failure to somewhere less obvious. Validate with a type predicate instead.',
      },
      {
        id: 'q5',
        prompt: 'You add a field to a `User` interface. Which approach keeps derived types in step automatically?',
        choices: [
          'Copying the interface and editing each copy',
          'Deriving them with Pick, Omit and Partial',
          'Using `any` for the derived types',
          'Adding a comment to remember',
        ],
        answerIndex: 1,
        explanation:
          'Derive them. `Partial<Omit<User, "id">>` updates itself when User changes; hand-copied interfaces drift, and drifting types are worse than none because they are confidently wrong.',
      },
      {
        id: 'q6',
        prompt: 'What is the value of returning a `Result<T, E>` rather than throwing?',
        choices: [
          'It is faster',
          'Failure becomes part of the signature, so a caller cannot silently ignore it',
          'It avoids try/catch entirely in all code',
          'It gives better stack traces',
        ],
        answerIndex: 1,
        explanation:
          'Exceptions are invisible in a type signature — nothing tells a caller that a function can fail. A Result puts failure in the return type, and the union will not narrow until `ok` is checked. The cost is ceremony at every call site, which is why most teams use it at boundaries and keep exceptions for bugs.',
      },
      {
        id: 'q7',
        prompt: 'What does `keyof typeof STATUS` give you for an `as const` object?',
        choices: [
          'The union of its values',
          'The union of its key names as literal types',
          'A runtime array of keys',
          'The type `string`',
        ],
        answerIndex: 1,
        explanation:
          'The literal union of key names. `typeof` recovers the type from the value and `keyof` extracts its keys, so one object serves as both the runtime lookup and the source of the type. `as const` is what stops the values widening to `string`.',
      },
      {
        id: 'q8',
        prompt: 'In `catch (err)`, what type does `err` have under modern settings, and why?',
        choices: [
          'Error — only Errors can be thrown',
          'unknown — JavaScript permits throwing any value',
          'any, always',
          'It depends on the try block',
        ],
        answerIndex: 1,
        explanation:
          '`unknown`, because `throw "a string"` is legal JavaScript and libraries do throw non-Errors. Narrow before use: `err instanceof Error ? err.message : String(err)`.',
      },
    ],
  },
];
