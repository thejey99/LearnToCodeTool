/**
 * Curriculum self-check.
 *
 * Runs every test-graded lesson's own worked solution against its own test
 * suite, using the same harness the browser sandbox uses. A lesson whose
 * solution does not pass is a bug in the lesson, and without this it would
 * only be found by a learner losing an evening to it.
 *
 * Also enforces structural rules: unique ids, hints and solutions where they
 * are expected, and quiz answers pointing at real choices.
 *
 *   npm run validate
 */
import { transform } from 'sucrase';
import { SEED_LESSONS, LESSONS_BY_TRACK } from '../src/lessons/seed';
import { TRACKS } from '../src/lessons/tracks';
import { JS_TEST_HARNESS } from '../src/runners/harness';
import type { Lesson } from '../src/types';

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

interface Failure {
  lesson: string;
  detail: string;
}

const failures: Failure[] = [];
const notes: string[] = [];

function fail(lesson: Lesson | string, detail: string) {
  failures.push({
    lesson: typeof lesson === 'string' ? lesson : `${lesson.track}/${lesson.id}`,
    detail,
  });
}

// ── Structure ────────────────────────────────────────────────

const seen = new Set<string>();
for (const lesson of SEED_LESSONS) {
  if (seen.has(lesson.id)) fail(lesson, 'duplicate lesson id');
  seen.add(lesson.id);

  if (!lesson.instructions.trim()) fail(lesson, 'empty instructions');

  const graded =
    lesson.kind === 'tests' ||
    lesson.kind === 'console' ||
    lesson.kind === 'web' ||
    lesson.kind === 'sql';

  if (graded && !lesson.solution) fail(lesson, 'no worked solution');
  if (graded && (!lesson.hints || lesson.hints.length === 0)) {
    fail(lesson, 'no hints');
  }
  if (lesson.kind === 'tests' && !lesson.testCode) fail(lesson, 'tests lesson without testCode');
  if (lesson.kind === 'sql' && !lesson.sqlSetup) fail(lesson, 'sql lesson without a schema');
  if (lesson.kind === 'console' && !lesson.expectedOutput) {
    fail(lesson, 'console lesson without expectedOutput');
  }
  if (lesson.kind === 'web' && !lesson.webCheck) notes.push(`${lesson.id}: web lesson has no check`);

  for (const question of lesson.quiz ?? []) {
    if (
      question.answerIndex < 0 ||
      question.answerIndex >= question.choices.length
    ) {
      fail(lesson, `quiz ${question.id}: answerIndex out of range`);
    }
    if (!question.explanation.trim()) fail(lesson, `quiz ${question.id}: no explanation`);
  }
}

for (const track of TRACKS) {
  if ((LESSONS_BY_TRACK[track.id] ?? []).length === 0) {
    fail(track.id, 'track has no lessons');
  }
}

// ── Solutions against their own tests ────────────────────────

async function runSolution(lesson: Lesson): Promise<void> {
  let code = lesson.solution ?? '';
  let testCode = lesson.testCode ?? '';

  if (lesson.language === 'typescript') {
    code = transform(code, { transforms: ['typescript'] }).code;
    testCode = transform(testCode, { transforms: ['typescript'] }).code;
  }

  const results: Array<{ name: string; passed: boolean; message?: string }> = [];
  const body = `${JS_TEST_HARNESS}\n${code}\n${testCode}\nawait __run();`;

  try {
    await new AsyncFunction('__results', body)(results);
  } catch (err: any) {
    fail(lesson, `solution threw: ${err?.message ?? err}`);
    return;
  }

  if (results.length === 0) {
    fail(lesson, 'no tests ran');
    return;
  }

  for (const result of results) {
    if (!result.passed) {
      fail(lesson, `"${result.name}" — ${result.message ?? 'failed'}`);
    }
  }
}

const testLessons = SEED_LESSONS.filter(
  (l) =>
    l.kind === 'tests' &&
    (l.language === 'javascript' || l.language === 'typescript')
);

// ── Console solutions against their expected output ──────────

/** Mirrors the sandbox: capture console, then let queued timers drain. */
async function runConsole(lesson: Lesson): Promise<void> {
  let code = lesson.solution ?? '';
  if (lesson.language === 'typescript') {
    code = transform(code, { transforms: ['typescript'] }).code;
  }

  const logs: string[] = [];
  const fmt = (a: unknown) => {
    if (a instanceof Error) return a.name + ': ' + a.message;
    if (typeof a === 'object' && a !== null) return JSON.stringify(a);
    if (typeof a === 'undefined') return 'undefined';
    return String(a);
  };

  const realLog = console.log;
  console.log = (...args: unknown[]) => logs.push(args.map(fmt).join(' '));

  try {
    await new AsyncFunction(code)();
    await new Promise((r) => setTimeout(r, 60));
  } catch (err: any) {
    fail(lesson, `solution threw: ${err?.message ?? err}`);
    return;
  } finally {
    console.log = realLog;
  }

  const expected = (lesson.expectedOutput ?? []).map((l) => l.trimEnd());
  const actual = logs.map((l) => l.trimEnd());
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(
      lesson,
      `output mismatch\n        expected: ${JSON.stringify(expected)}\n        actual:   ${JSON.stringify(actual)}`
    );
  }
}

const consoleLessons = SEED_LESSONS.filter(
  (l) =>
    l.kind === 'console' &&
    (l.language === 'javascript' || l.language === 'typescript')
);

const timed = await (async () => {
  const start = Date.now();
  for (const lesson of testLessons) await runSolution(lesson);
  for (const lesson of consoleLessons) await runConsole(lesson);
  return Date.now() - start;
})();

// ── Report ───────────────────────────────────────────────────

const byKind = SEED_LESSONS.reduce<Record<string, number>>((acc, l) => {
  acc[l.kind] = (acc[l.kind] ?? 0) + 1;
  return acc;
}, {});

console.log(`\nCurriculum: ${SEED_LESSONS.length} lessons across ${TRACKS.length} tracks`);
console.log(
  '  ' +
    Object.entries(byKind)
      .map(([kind, count]) => `${kind}: ${count}`)
      .join('   ')
);
console.log(
  `  verified ${testLessons.length} test-graded and ${consoleLessons.length} console solutions in ${timed}ms\n`
);

for (const note of notes) console.log(`  note: ${note}`);

if (failures.length > 0) {
  console.error(`${failures.length} problem(s):\n`);
  for (const f of failures) console.error(`  ✘ ${f.lesson}\n      ${f.detail}`);
  process.exit(1);
}

console.log('All checks passed.\n');
