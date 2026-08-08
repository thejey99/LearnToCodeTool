# Code Lab

A browser-based curriculum that takes someone from `console.log("Hello")` to being
employable as a software developer. Every lesson runs real code in a sandbox — no
setup, no toolchain, nothing to install.

**134 lessons across 13 tracks.** Roughly 36 hours of material.

```bash
npm install
npm run dev
```

That is the whole setup. Firebase is optional (see below); without it, progress
saves to `localStorage` and everything else works identically.

---

## How lessons are graded

Five grading modes, chosen per lesson to match what is being taught.

| Kind | How it works | Used for |
| --- | --- | --- |
| `console` | Code runs in a worker; stdout is matched against expected lines | Syntax and first principles |
| `tests` | Code runs against a hidden suite using a Jest-shaped `test()` / `expect()` API | Everything from `js-deep` onward |
| `web` | Code is a full HTML document rendered in a sandboxed iframe; an assertion runs against the live DOM | DOM, events, games |
| `sql` | Code is SQL executed against a real in-memory SQLite database, seeded per run | The Data & SQL track |
| `quiz` | Multiple choice with an explanation on every answer, right or wrong | Checkpoints, git, security, system design |

The `tests` mode is the important one. Instead of "make your program print exactly
this", the learner implements a function against a specification and sees per-assertion
feedback:

```
✔ addTax applies 20% and rounds
✘ addTax does not modify the original array
    Expected [100, 200] but got [120, 240]
```

Several suites also assert on **performance**, so an O(n²) solution genuinely fails
where an O(n) one passes. Learners see the difference rather than being told about it.

---

## The curriculum

| Track | Lessons | What it is for |
| --- | --- | --- |
| 🧱 Programming Foundations | 12 | Variables, logic, loops, functions, arrays |
| ⚡ JavaScript in Depth | 16 | Closures, map/filter/reduce, references, classes, errors, JSON |
| 🛡️ TypeScript | 16 | Interfaces, narrowing, discriminated unions, utility types, generics, `unknown` |
| ⏳ Asynchronous JavaScript | 7 | Event loop, promises, concurrency, retries, race conditions |
| 🧪 Testing & Debugging | 6 | Unit tests, TDD, edge cases, seams, reading a stack trace |
| 🖥️ Front-End Engineering | 5 | DOM, delegation, state→render, loading/error/empty states |
| 🎮 Build Games | 14 | Clicker, Snake, Breakout, Memory Match |
| 🐍 Python | 21 | A second language, then comprehensions, dataclasses, generators, pipelines |
| 🗄️ Data & SQL | 7 | Real queries: filtering, aggregates, joins, indexes, N+1 |
| 🧠 Data Structures & Algorithms | 12 | Big-O, hash maps, two pointers, windows, trees, graphs, DP |
| 🔌 Back-End & APIs | 5 | HTTP, REST design, routing, validation, rate limiting |
| 🛠️ Working as an Engineer | 7 | Git, code review, security, clean code, system design |
| 🎯 Interview Preparation | 6 | Classic problems under test, plus the non-coding rounds |

Tracks unlock when their prerequisites are 60% done. **Explore mode** (on the
dashboard) removes the gating entirely for anyone who would rather jump straight
to the topic they need.

Every graded lesson has progressive **hints** and a **worked solution**. The solution
stays locked until all hints are used and three attempts have been made, because
handing over the answer at the first sign of friction is where learning stops.

---

## Architecture

```
src/
  types.ts              Domain model: Lesson, Track, RunResult, UserProgress
  runners/
    harness.ts          The test harness injected into the sandbox (JS + Python)
    jsRunner.ts         Web Worker sandbox: no DOM, timeout-killed
    tsRunner.ts         Strips types via Sucrase, then runs as JS
    pythonRunner.ts     Pyodide in a persistent worker, globals reset per run
    sqlRunner.ts        SQLite via Python's stdlib, fresh database per run
  lessons/
    tracks.ts           Track metadata and prerequisites
    builder.ts          Fills in xp/time/kind from difficulty
    seed.ts             Assembles the curriculum, plus the progression rules
    <track>.ts          The lesson content itself
  components/           Dashboard, LessonView, TestResults, Quiz, Hints, Playground
  lib/markdown.tsx      Dependency-free Markdown → React (no innerHTML anywhere)
scripts/
  validate-curriculum.ts
```

### Sandboxing

Learner code never touches the app. JavaScript and TypeScript run in a Web Worker
built from a blob — no DOM, no access to the page — and a hung program is killed by
terminating the worker. Web lessons render in an iframe with `sandbox="allow-scripts"`.
Python and SQL run inside Pyodide's WASM sandbox.

The Python worker is kept alive between runs because booting the interpreter is slow,
which creates a trap: a function defined by an earlier run would still exist after the
learner deletes it, and their code would pass against a ghost. Every run therefore
clears user-defined globals first.

---

## Curriculum validation

A lesson whose own worked solution fails its own tests is a bug that would otherwise
be found by a learner losing an evening to it. So it is checked in CI-able form:

```bash
npm run check      # typecheck + curriculum validation
```

The validator:

- runs **every** JavaScript and TypeScript test-graded solution through the same harness the browser uses
- replays every console solution against its expected output
- executes every Python lesson through a real CPython interpreter
- runs every SQL lesson against real SQLite, comparing formatted output line for line
- **type-checks every TypeScript solution with `tsc --strict`**, which the browser sandbox cannot do because it strips types rather than checking them
- enforces structural rules — unique ids, hints and solutions present, quiz answers pointing at real choices

It has caught three genuine content bugs so far, including a type error in a
TypeScript lesson's own worked solution. The Python and SQL stages skip with a note
when there is no `python3` on the path; everything else runs everywhere.

### Browser tests

Web lessons are graded against a live DOM, so verifying them needs a real browser:

```bash
npm run test:e2e     # Playwright
npm run check:all    # everything above, plus the browser suite
```

Two suites:

**`tests/web-lessons.spec.ts`** checks every `web` lesson twice, using the same
harness `WebPreview.tsx` injects. The worked solution must satisfy the check, **and
the starter code must not** — a check that already passes before the learner writes
anything grades nothing at all.

**`tests/app.spec.ts`** drives the real app: the dashboard renders without a backend,
typing into CodeMirror and pressing Run grades a console lesson and moves the progress
counter, a test-graded lesson reports per-assertion results, a deliberately wrong
solution surfaces the assertion message, the solution stays locked until hints and
attempts are spent, and the playground executes scratch code.

If the machine already has a Chromium — most CI images do — point at it instead of
downloading one:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium npm run test:e2e
```

---

## Configuration

Cloud sync is optional. With these environment variables set, progress follows the
learner between devices via Firestore:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Without them the app runs in local mode against `localStorage`. Progress records are
versioned and migrate forward, so an existing v1 record (just a list of completed
lesson ids) is upgraded on load rather than lost.

Access to the hosted app is restricted by the allow-list in `src/firebase.ts`; mirror
that list in your Firestore security rules.

---

## Adding a lesson

Lessons are data. Add a `LessonDraft` to the relevant file in `src/lessons/`:

```ts
{
  id: 'jsd-99-example',
  title: 'Something Useful',
  language: 'javascript',
  module: 'Working With Data',
  difficulty: 3,
  concepts: ['map', 'immutability'],
  instructions: `Markdown goes here.`,
  starterCode: `function doThing(items) {\n}\n`,
  testCode: `test("does the thing", () => {
  expect(doThing([1])).toEqual([2]);
});`,
  hints: ['First nudge', 'Second nudge'],
  solution: `function doThing(items) {\n  return items.map((n) => n + 1);\n}\n`,
}
```

`kind` is inferred (`testCode` → tests, `quiz` alone → quiz), and xp and time estimates
come from `difficulty`. Then run `npm run check` — it will tell you if the solution does
not pass, or if hints are missing.
