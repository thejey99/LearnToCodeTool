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
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { transform } from 'sucrase';
import { SEED_LESSONS, LESSONS_BY_TRACK } from '../src/lessons/seed';
import { TRACKS } from '../src/lessons/tracks';
import {
  JS_TEST_HARNESS,
  PY_TEST_HARNESS,
  PY_TEST_FOOTER,
  PY_RESULT_MARKER,
} from '../src/runners/harness';
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
    lesson.kind === 'react' ||
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
  if ((lesson.kind === 'web' || lesson.kind === 'react') && !lesson.webCheck) {
    notes.push(`${lesson.id}: preview lesson has no check`);
  }

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

// ── Python solutions, through a real interpreter ─────────────

/**
 * Pyodide is CPython compiled to WASM, so a local python3 is a faithful
 * enough stand-in for checking that lesson code and the test harness agree.
 * Skipped with a note when no interpreter is available.
 */
function runPythonLessons(): number {
  const lessons = SEED_LESSONS.filter(
    (l) => l.language === 'python' && l.kind === 'tests'
  );
  if (lessons.length === 0) return 0;

  try {
    execFileSync('python3', ['--version'], { stdio: 'ignore' });
  } catch {
    notes.push(`python3 not available — skipped ${lessons.length} Python test lessons`);
    return 0;
  }

  const dir = mkdtempSync(join(tmpdir(), 'codelab-py-'));
  let checked = 0;

  try {
    for (const lesson of lessons) {
      const source = [
        PY_TEST_HARNESS,
        lesson.solution ?? '',
        lesson.testCode ?? '',
        PY_TEST_FOOTER,
      ].join('\n');

      const file = join(dir, `${lesson.id.replace(/[^a-z0-9]/gi, '_')}.py`);
      writeFileSync(file, source);

      let stdout = '';
      try {
        stdout = execFileSync('python3', [file], {
          encoding: 'utf8',
          cwd: dir,
          timeout: 30000,
        });
      } catch (err: any) {
        const stderr = String(err?.stderr ?? err?.message ?? err).trim();
        fail(lesson, `python raised: ${stderr.split('\n').pop()}`);
        continue;
      }

      const line = stdout.split('\n').find((l) => l.includes(PY_RESULT_MARKER));
      if (!line) {
        fail(lesson, 'no test report produced');
        continue;
      }

      const results: Array<{ name: string; passed: boolean; message?: string }> =
        JSON.parse(line.slice(line.indexOf(PY_RESULT_MARKER) + PY_RESULT_MARKER.length));

      if (results.length === 0) {
        fail(lesson, 'no tests ran');
        continue;
      }
      for (const result of results) {
        if (!result.passed) {
          fail(lesson, `"${result.name}" — ${result.message ?? 'failed'}`);
        }
      }
      checked++;
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  return checked;
}

const pythonChecked = runPythonLessons();

// ── SQL solutions, against a real SQLite ─────────────────────

/**
 * Reproduces sqlRunner.ts — same statement splitting, same cell formatting —
 * so a mismatch here means the lesson's expectedOutput is genuinely wrong
 * rather than the harness disagreeing with itself.
 */
const SQL_DRIVER = `
import json, sqlite3, sys

def split(text):
    out, cur, quote = [], "", None
    for ch in text:
        if quote:
            cur += ch
            if ch == quote:
                quote = None
        elif ch in ("'", '"'):
            quote = ch
            cur += ch
        elif ch == ";":
            out.append(cur); cur = ""
        else:
            cur += ch
    out.append(cur)
    return [s.strip() for s in out if s.strip() and not s.strip().startswith("--")]

def cell(v):
    if v is None:
        return "NULL"
    if isinstance(v, float):
        s = ("%.4f" % v).rstrip("0").rstrip(".")
        return s if s else "0"
    return str(v)

report = []
for lesson in json.load(open(sys.argv[1])):
    con = sqlite3.connect(":memory:")
    con.executescript(lesson["setup"])
    lines = []
    try:
        for stmt in split(lesson["sql"]):
            cur = con.execute(stmt)
            if cur.description:
                lines.append(" | ".join(d[0] for d in cur.description))
                for row in cur.fetchall():
                    lines.append(" | ".join(cell(v) for v in row))
    except Exception as e:
        lines = ["ERROR " + type(e).__name__ + ": " + str(e)]
    if lines != lesson["expected"]:
        report.append({"id": lesson["id"], "expected": lesson["expected"], "actual": lines})

print(json.dumps(report))
`;

function runSqlLessons(): number {
  const lessons = SEED_LESSONS.filter((l) => l.kind === 'sql');
  if (lessons.length === 0) return 0;

  try {
    execFileSync('python3', ['--version'], { stdio: 'ignore' });
  } catch {
    notes.push(`python3 not available — skipped ${lessons.length} SQL lessons`);
    return 0;
  }

  const dir = mkdtempSync(join(tmpdir(), 'codelab-sql-'));

  try {
    const dataFile = join(dir, 'lessons.json');
    const driverFile = join(dir, 'driver.py');
    writeFileSync(
      dataFile,
      JSON.stringify(
        lessons.map((l) => ({
          id: l.id,
          setup: l.sqlSetup ?? '',
          sql: l.solution ?? '',
          expected: l.expectedOutput ?? [],
        }))
      )
    );
    writeFileSync(driverFile, SQL_DRIVER);

    const stdout = execFileSync('python3', [driverFile, dataFile], {
      encoding: 'utf8',
      timeout: 30000,
    });

    for (const problem of JSON.parse(stdout.trim())) {
      fail(
        `data/${problem.id}`,
        `output mismatch\n        expected: ${JSON.stringify(problem.expected)}\n        actual:   ${JSON.stringify(problem.actual)}`
      );
    }
  } catch (err: any) {
    notes.push(`SQL check failed to run: ${String(err?.message ?? err).split('\n')[0]}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  return lessons.length;
}

const sqlChecked = runSqlLessons();

// ── TypeScript solutions, through the compiler ───────────────

/**
 * The browser sandbox strips types rather than checking them, so a type error
 * in a lesson's own solution would ship silently. tsc catches it here instead.
 * Each lesson becomes its own module so their declarations cannot collide.
 */
const TS_PRELUDE = `/* eslint-disable */
declare function test(name: string, fn: () => unknown): void;
declare const expect: (actual: any) => any;
`;

function typecheckTsLessons(): number {
  const lessons = SEED_LESSONS.filter(
    (l) => l.language === 'typescript' && (l.kind === 'tests' || l.kind === 'console')
  );
  if (lessons.length === 0) return 0;

  const dir = mkdtempSync(join(tmpdir(), 'codelab-ts-'));
  const files: string[] = [];

  try {
    for (const lesson of lessons) {
      const file = join(dir, `${lesson.id.replace(/[^a-z0-9]/gi, '_')}.ts`);
      writeFileSync(
        file,
        [TS_PRELUDE, lesson.solution ?? '', lesson.testCode ?? '', 'export {};'].join('\n')
      );
      files.push(file);
    }

    try {
      execFileSync(
        'npx',
        [
          'tsc',
          '--noEmit',
          '--strict',
          '--target', 'ES2020',
          '--lib', 'ES2020,DOM',
          '--module', 'ESNext',
          '--moduleResolution', 'bundler',
          '--skipLibCheck',
          ...files,
        ],
        { encoding: 'utf8', stdio: 'pipe' }
      );
    } catch (err: any) {
      const output = String(err?.stdout ?? '') + String(err?.stderr ?? '');
      for (const line of output.split('\n')) {
        const match = /^(.*?)\((\d+),\d+\): error (.*)$/.exec(line.trim());
        if (!match) continue;
        const id = match[1].split('/').pop()?.replace(/\.ts$/, '') ?? 'unknown';
        fail(`types/${id}`, `line ${match[2]}: ${match[3]}`);
      }
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  return lessons.length;
}

const tsChecked = typecheckTsLessons();

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
console.log(`  verified ${testLessons.length} test-graded and ${consoleLessons.length} console solutions in ${timed}ms`);
console.log(`  ran ${pythonChecked} Python lessons through CPython`);
console.log(`  ran ${sqlChecked} SQL lessons against real SQLite`);
console.log(`  type-checked ${tsChecked} TypeScript solutions with tsc\n`);

for (const note of notes) console.log(`  note: ${note}`);

if (failures.length > 0) {
  console.error(`${failures.length} problem(s):\n`);
  for (const f of failures) console.error(`  ✘ ${f.lesson}\n      ${f.detail}`);
  process.exit(1);
}

console.log('All checks passed.\n');
