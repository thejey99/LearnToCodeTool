import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { SEED_LESSONS } from '../src/lessons/seed';
import { reactDocument, transformJsx } from '../src/runners/reactRunner';

/**
 * Verifies the one part of the curriculum the Node validator cannot touch.
 *
 * Web lessons are graded by evaluating a `webCheck` expression against a live
 * DOM, so checking them needs a real browser. Two properties matter, and the
 * second is the one people forget: the check must pass on the worked solution,
 * and it must *fail* on the starter code. A check that already passes before
 * the learner writes anything grades nothing at all.
 */

const WEB_LESSONS = SEED_LESSONS.filter((l) => l.kind === 'web' && l.webCheck);
const REACT_LESSONS = SEED_LESSONS.filter((l) => l.kind === 'react' && l.webCheck);

/**
 * The app loads these as a lazy Vite chunk via `?raw`; Node reads them off
 * disk instead. Same bytes, same document builder, so the page under test is
 * byte-for-byte what a learner sees.
 */
const REACT_UMD = readFileSync(
  'node_modules/react/umd/react.development.js',
  'utf8'
);
const REACT_DOM_UMD = readFileSync(
  'node_modules/react-dom/umd/react-dom.development.js',
  'utf8'
);

function buildReactPage(code: string): string {
  const { js, error } = transformJsx(code);
  if (error || js === null) {
    throw new Error(`JSX failed to compile: ${error}`);
  }
  return reactDocument({ react: REACT_UMD, reactDom: REACT_DOM_UMD, js });
}

/**
 * Mirrors the harness in WebPreview.tsx exactly — same IIFE wrapper, same
 * 300ms settle, same Promise normalisation — so a result here means the same
 * thing it would mean in the app.
 */
function harnessFor(check: string): string {
  return `<script>
    window.addEventListener('load', function () {
      setTimeout(function () {
        var report = function (ok) { window.__codelabCheck = !!ok; };
        try {
          Promise.resolve((function () { return (${check}); })())
            .then(report, function () { report(false); });
        } catch (e) {
          report(false);
        }
      }, 300);
    });
  <\/script>`;
}

async function runCheck(page: Page, html: string, check: string): Promise<boolean> {
  await page.setContent(html + harnessFor(check), { waitUntil: 'load' });

  try {
    await page.waitForFunction(
      () => (window as unknown as Record<string, unknown>).__codelabCheck !== undefined,
      undefined,
      { timeout: 12_000 }
    );
  } catch {
    // The app treats a check that never reports as a failure too.
    return false;
  }

  return page.evaluate(
    () => (window as unknown as Record<string, unknown>).__codelabCheck as boolean
  );
}

test.describe('web lesson checks', () => {
  test('there are web lessons to check', () => {
    expect(WEB_LESSONS.length).toBeGreaterThan(0);
  });

  for (const lesson of WEB_LESSONS) {
    test(`${lesson.id} — the worked solution passes`, async ({ page }) => {
      expect(lesson.solution, `${lesson.id} has no solution`).toBeTruthy();
      const passed = await runCheck(page, lesson.solution!, lesson.webCheck!);
      expect(passed, `${lesson.id}: the solution should satisfy its own check`).toBe(true);
    });

    test(`${lesson.id} — the starter code does not`, async ({ page }) => {
      const passed = await runCheck(page, lesson.starterCode, lesson.webCheck!);
      expect(
        passed,
        `${lesson.id}: the check passes on the unmodified starter, so it grades nothing`
      ).toBe(false);
    });
  }
});

test.describe('react lesson checks', () => {
  test('there are react lessons to check', () => {
    expect(REACT_LESSONS.length).toBeGreaterThan(0);
  });

  for (const lesson of REACT_LESSONS) {
    test(`${lesson.id} — the worked solution passes`, async ({ page }) => {
      expect(lesson.solution, `${lesson.id} has no solution`).toBeTruthy();
      const passed = await runCheck(
        page,
        buildReactPage(lesson.solution!),
        lesson.webCheck!
      );
      expect(passed, `${lesson.id}: the solution should satisfy its own check`).toBe(true);
    });

    test(`${lesson.id} — the starter code does not`, async ({ page }) => {
      const passed = await runCheck(
        page,
        buildReactPage(lesson.starterCode),
        lesson.webCheck!
      );
      expect(
        passed,
        `${lesson.id}: the check passes on the unmodified starter, so it grades nothing`
      ).toBe(false);
    });

    test(`${lesson.id} — the starter code compiles`, () => {
      expect(transformJsx(lesson.starterCode).error).toBeNull();
    });
  }
});
