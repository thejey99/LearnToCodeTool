import type { ReviewItem, ReviewState, UserProgress } from '../types';

/**
 * Spaced repetition, deliberately simple.
 *
 * The heavy lifting in retention is done by *when* you see something again,
 * not by how clever the algorithm is. A Leitner ladder — get it right and the
 * gap grows, get it wrong and you start over — captures nearly all of the
 * benefit of SM-2 with none of the tuning parameters, and it is easy to
 * reason about when the schedule does something surprising.
 */
export const INTERVAL_DAYS = [1, 3, 7, 16, 35, 90] as const;

const DAY_MS = 86_400_000;

/** Items shown per session. Long enough to be worth opening, short enough to finish. */
export const SESSION_SIZE = 10;

export function newReviewState(now = Date.now()): ReviewState {
  return { box: 0, dueAt: now, lastReviewedAt: 0, correct: 0, incorrect: 0 };
}

export function intervalFor(box: number): number {
  const index = Math.min(box, INTERVAL_DAYS.length - 1);
  return INTERVAL_DAYS[index] * DAY_MS;
}

/**
 * Advances an item after an answer.
 *
 * A miss drops all the way back to box 0 rather than down one step: being
 * wrong means the memory is not there, and pretending otherwise is how a
 * queue fills up with things you keep failing.
 *
 * It also becomes due *immediately* rather than tomorrow. Every real spaced
 * repetition system puts a lapsed card into a short relearning step, because
 * the useful moment to see something again is soon after failing it — a
 * 24-hour gap is long enough to forget it a second time.
 */
export function grade(
  state: ReviewState,
  wasCorrect: boolean,
  now = Date.now()
): ReviewState {
  const box = wasCorrect ? state.box + 1 : 0;

  return {
    box,
    dueAt: wasCorrect ? now + intervalFor(box) : now,
    lastReviewedAt: now,
    correct: state.correct + (wasCorrect ? 1 : 0),
    incorrect: state.incorrect + (wasCorrect ? 0 : 1),
  };
}

/** Items whose lesson is finished — anything else would spoil unseen material. */
export function availableItems(
  bank: ReviewItem[],
  completedLessonIds: Set<string>
): ReviewItem[] {
  return bank.filter((item) => completedLessonIds.has(item.lessonId));
}

export function stateFor(progress: UserProgress, itemId: string): ReviewState {
  return progress.review[itemId] ?? newReviewState(0);
}

/** Never seen, or the interval has elapsed. */
export function isDue(
  progress: UserProgress,
  item: ReviewItem,
  now = Date.now()
): boolean {
  const state = progress.review[item.id];
  if (!state) return true;
  return state.dueAt <= now;
}

export function dueCount(
  bank: ReviewItem[],
  progress: UserProgress,
  completedLessonIds: Set<string>,
  now = Date.now()
): number {
  return availableItems(bank, completedLessonIds).filter((item) =>
    isDue(progress, item, now)
  ).length;
}

/**
 * Deterministic shuffle, so a session can be reproduced from its seed —
 * which is what makes the whole thing testable.
 */
function seededShuffle<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let state = seed || 1;
  const next = () => {
    // xorshift32
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return Math.abs(state) / 2 ** 31;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Interleaves by lesson so consecutive questions come from different places.
 *
 * Studying one topic in a block feels more fluent and produces worse recall
 * than mixing topics — the mixing is what forces you to work out *which*
 * idea applies, which is the part you actually need later.
 */
function interleave(items: ReviewItem[]): ReviewItem[] {
  const byLesson = new Map<string, ReviewItem[]>();
  for (const item of items) {
    const bucket = byLesson.get(item.lessonId) ?? [];
    bucket.push(item);
    byLesson.set(item.lessonId, bucket);
  }

  const queues = [...byLesson.values()];
  const out: ReviewItem[] = [];

  while (out.length < items.length) {
    let placedAny = false;
    for (const queue of queues) {
      const next = queue.shift();
      if (next) {
        out.push(next);
        placedAny = true;
      }
    }
    if (!placedAny) break;
  }

  return out;
}

export interface SessionOptions {
  size?: number;
  now?: number;
  /** Fixed seed makes a session reproducible; omit for a fresh shuffle. */
  seed?: number;
}

/**
 * Builds a review session: everything due, oldest first, interleaved.
 *
 * When less than a full session is due it tops up with the items whose
 * intervals are closest to elapsing, so opening review early still gives you
 * something useful rather than an empty screen.
 */
export function buildSession(
  bank: ReviewItem[],
  progress: UserProgress,
  completedLessonIds: Set<string>,
  options: SessionOptions = {}
): ReviewItem[] {
  const size = options.size ?? SESSION_SIZE;
  const now = options.now ?? Date.now();
  const seed = options.seed ?? now;

  const available = availableItems(bank, completedLessonIds);
  if (available.length === 0) return [];

  const due = available.filter((item) => isDue(progress, item, now));
  const notYetDue = available
    .filter((item) => !isDue(progress, item, now))
    .sort((a, b) => stateFor(progress, a.id).dueAt - stateFor(progress, b.id).dueAt);

  // Shuffle within the due set so the same items do not always lead.
  const chosen = [
    ...interleave(seededShuffle(due, seed)),
    ...notYetDue,
  ].slice(0, size);

  return chosen;
}

/**
 * Concepts you keep getting wrong, worst first. Only reports a concept once
 * there is enough history to mean something.
 */
export function weakConcepts(
  progress: UserProgress,
  limit = 3
): Array<{ concept: string; correct: number; incorrect: number }> {
  return Object.entries(progress.conceptStats)
    .map(([concept, stats]) => ({ concept, ...stats }))
    .filter((entry) => entry.incorrect >= 2)
    .sort((a, b) => {
      const aRate = a.incorrect / (a.correct + a.incorrect);
      const bRate = b.incorrect / (b.correct + b.incorrect);
      return bRate - aRate || b.incorrect - a.incorrect;
    })
    .slice(0, limit);
}

/** Applies one answer to the whole progress record. */
export function recordAnswer(
  progress: UserProgress,
  item: ReviewItem,
  wasCorrect: boolean,
  now = Date.now()
): UserProgress {
  const conceptStats = { ...progress.conceptStats };
  for (const concept of item.concepts) {
    const current = conceptStats[concept] ?? { correct: 0, incorrect: 0 };
    conceptStats[concept] = {
      correct: current.correct + (wasCorrect ? 1 : 0),
      incorrect: current.incorrect + (wasCorrect ? 0 : 1),
    };
  }

  return {
    ...progress,
    review: {
      ...progress.review,
      [item.id]: grade(stateFor(progress, item.id), wasCorrect, now),
    },
    conceptStats,
  };
}

/** Whitespace-forgiving comparison for typed output. */
export function matchesExpected(typed: string, expected: string[]): boolean {
  const actual = typed
    .split('\n')
    .map((line) => line.trim())
    .filter((line, i, all) => line !== '' || i < all.length - 1);

  while (actual.length && actual[actual.length - 1] === '') actual.pop();

  const wanted = expected.map((line) => line.trim());
  if (actual.length !== wanted.length) return false;
  return wanted.every((line, i) => actual[i] === line);
}
