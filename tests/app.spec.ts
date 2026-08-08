import { test, expect, type Page } from '@playwright/test';
import { SEED_LESSONS } from '../src/lessons/seed';

/**
 * End-to-end coverage of the parts no unit-level check can reach: the Web
 * Worker sandbox actually starting, CodeMirror actually receiving input, and
 * grading actually updating progress — in a real browser, through the real UI.
 *
 * Runs against the app in local mode, since Firebase is optional.
 */

/** Seeds progress before the app boots, so tests can start from a known state. */
async function seedProgress(
  page: Page,
  savedCode: Record<string, string> = {}
): Promise<void> {
  await page.addInitScript((payload: { savedCode: Record<string, string> }) => {
    // Explore mode removes the sequential gating, so a test can open any lesson.
    localStorage.setItem('codelab.explore', 'true');
    localStorage.setItem(
      'codelab.progress.v2',
      JSON.stringify({
        version: 2,
        completedLessonIds: [],
        lastLessonId: null,
        lessons: Object.fromEntries(
          Object.entries(payload.savedCode).map(([id, code]) => [
            id,
            { attempts: 0, hintsUsed: 0, solutionViewed: false, savedCode: code },
          ])
        ),
        xp: 0,
        streak: { current: 0, longest: 0, lastActiveDay: null },
        updatedAt: Date.now(),
      })
    );
  }, { savedCode });
}

const lessonById = (id: string) => {
  const lesson = SEED_LESSONS.find((l) => l.id === id);
  if (!lesson) throw new Error(`Test refers to a lesson that no longer exists: ${id}`);
  return lesson;
};

test('the dashboard lists the tracks and runs without a backend', async ({ page }) => {
  await seedProgress(page);
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Code Lab' })).toBeVisible();
  await expect(page.getByText('local progress')).toBeVisible();

  await expect(page.getByText('Programming Foundations')).toBeVisible();
  await expect(page.getByText('Data Structures & Algorithms')).toBeVisible();
  await expect(page.getByText('Interview Preparation')).toBeVisible();
});

test('a console lesson runs typed code and records progress', async ({ page }) => {
  await seedProgress(page);
  await page.goto('/');

  await page.getByRole('button', { name: /Start learning/ }).click();
  await expect(page.getByRole('heading', { name: 'Hello, World!' })).toBeVisible();

  const editor = page.locator('.cm-content');
  await editor.click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('console.log("Hello, World!");');

  await page.getByRole('button', { name: '▶ Run' }).click();

  // The header counter is the observable proof that grading passed.
  await expect(page.getByText(/^1\/\d+$/)).toBeVisible();
  await expect(page.getByText('✔ completed')).toBeVisible();
});

test('a test-graded lesson reports every assertion', async ({ page }) => {
  const lesson = lessonById('jsd-01-scope');
  await seedProgress(page, { [lesson.id]: lesson.solution! });
  await page.goto('/');

  await page.getByText('JavaScript in Depth').click();
  await expect(page.getByRole('heading', { name: lesson.title })).toBeVisible();

  await page.getByRole('button', { name: '▶ Run' }).click();

  // Same number passing as total — the suite is green.
  await expect(page.getByText(/^(\d+) of \1 tests passing$/)).toBeVisible();
  await expect(page.getByText(/^1\/\d+$/)).toBeVisible();
});

test('a failing solution shows the assertion message rather than just failing', async ({
  page,
}) => {
  const lesson = lessonById('jsd-04-map');
  // Deliberately wrong: no rounding, and it mutates nothing correctly.
  await seedProgress(page, {
    [lesson.id]: 'function addTax(prices) {\n  return prices;\n}\n\nfunction fullNames(people) {\n  return [];\n}\n',
  });
  await page.goto('/');

  await page.getByText('JavaScript in Depth').click();
  await page.getByText(lesson.title).click();
  await page.getByRole('button', { name: '▶ Run' }).click();

  await expect(page.getByText(/tests passing/)).toBeVisible();
  await expect(page.getByText(/Expected .* but got/).first()).toBeVisible();
});

test('the solution stays locked until hints and attempts are spent', async ({ page }) => {
  await seedProgress(page);
  await page.goto('/');

  await page.getByRole('button', { name: /Start learning/ }).click();

  const solutionButton = page.getByRole('button', { name: /Solution/ });
  await expect(solutionButton).toBeDisabled();

  await page.getByRole('button', { name: /Give me a hint/ }).click();
  await expect(page.getByText('HINT 1')).toBeVisible();
});

test('the playground executes scratch code', async ({ page }) => {
  await seedProgress(page);
  await page.goto('/');

  await page.getByRole('button', { name: /Playground/ }).click();
  await expect(page.getByRole('button', { name: 'TypeScript' })).toBeVisible();

  await page.getByRole('button', { name: '▶ Run' }).click();
  await expect(page.locator('.xterm-rows')).toContainText('finished in');
});
