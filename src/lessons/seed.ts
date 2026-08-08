import type { Lesson, TrackId } from '../types';
import { buildTrack, augment } from './builder';
import { LEGACY_SUPPORT } from './legacy-support';
import { TRACKS, TRACK_BY_ID, TRACK_ORDER } from './tracks';

import { JS_LESSONS } from './js';
import { JS_DEEP_LESSONS } from './js-deep';
import { TS_LESSONS } from './ts';
import { TS_PRO_LESSONS } from './ts-pro';
import { ASYNC_LESSONS } from './async';
import { TESTING_LESSONS } from './testing';
import { FRONTEND_LESSONS } from './frontend';
import { GAME_LESSONS } from './games';
import { PY_LESSONS } from './py';
import { PY_PRO_LESSONS } from './py-pro';
import { DATA_LESSONS } from './data';
import { DSA_LESSONS } from './dsa';
import { BACKEND_LESSONS } from './backend';
import { CRAFT_LESSONS } from './craft';
import { INTERVIEW_LESSONS } from './interview';

export { TRACKS, TRACK_BY_ID, TRACK_ORDER };

/** Tracks appear in this order; lesson order is stamped from it. */
const CURRICULUM: Array<[TrackId, Lesson[]]> = [
  ['foundations', augment(buildTrack('foundations', JS_LESSONS, { module: 'Programming Basics' }), LEGACY_SUPPORT)],
  ['js-deep', buildTrack('js-deep', JS_DEEP_LESSONS)],
  [
    'types',
    [
      ...augment(buildTrack('types', TS_LESSONS, { module: 'TypeScript Basics' }), LEGACY_SUPPORT),
      ...buildTrack('types', TS_PRO_LESSONS),
    ],
  ],
  ['async', buildTrack('async', ASYNC_LESSONS)],
  ['testing', buildTrack('testing', TESTING_LESSONS)],
  ['frontend', buildTrack('frontend', FRONTEND_LESSONS)],
  ['games', augment(buildTrack('games', GAME_LESSONS, { module: 'Console Games' }), LEGACY_SUPPORT)],
  [
    'python',
    [
      ...augment(buildTrack('python', PY_LESSONS, { module: 'Python Basics' }), LEGACY_SUPPORT),
      ...buildTrack('python', PY_PRO_LESSONS),
    ],
  ],
  ['data', buildTrack('data', DATA_LESSONS)],
  ['dsa', buildTrack('dsa', DSA_LESSONS)],
  ['backend', buildTrack('backend', BACKEND_LESSONS)],
  ['craft', buildTrack('craft', CRAFT_LESSONS)],
  ['interview', buildTrack('interview', INTERVIEW_LESSONS)],
];

export const SEED_LESSONS: Lesson[] = CURRICULUM.flatMap(([, lessons]) => lessons).map(
  (lesson, index) => ({ ...lesson, order: index + 1 })
);

export const LESSON_BY_ID = new Map(SEED_LESSONS.map((l) => [l.id, l]));

export const LESSONS_BY_TRACK: Record<TrackId, Lesson[]> = Object.fromEntries(
  TRACK_ORDER.map((id) => [id, SEED_LESSONS.filter((l) => l.track === id)])
) as Record<TrackId, Lesson[]>;

/** Chapters within a track, in curriculum order. */
export function modulesOf(trackId: TrackId): Array<{ name: string; lessons: Lesson[] }> {
  const groups: Array<{ name: string; lessons: Lesson[] }> = [];
  for (const lesson of LESSONS_BY_TRACK[trackId] ?? []) {
    const last = groups[groups.length - 1];
    if (last && last.name === lesson.module) last.lessons.push(lesson);
    else groups.push({ name: lesson.module, lessons: [lesson] });
  }
  return groups;
}

// ── Progression ──────────────────────────────────────────────

/** A prerequisite track counts as done at this fraction, so nobody is
 *  blocked by one stubborn lesson at the end of a track they have learnt. */
export const TRACK_UNLOCK_RATIO = 0.6;

export function trackCompletion(trackId: TrackId, completedIds: Set<string>): number {
  const lessons = LESSONS_BY_TRACK[trackId] ?? [];
  if (lessons.length === 0) return 0;
  const done = lessons.filter((l) => completedIds.has(l.id)).length;
  return done / lessons.length;
}

export function isTrackUnlocked(trackId: TrackId, completedIds: Set<string>): boolean {
  const track = TRACK_BY_ID[trackId];
  if (!track?.requires?.length) return true;
  return track.requires.every(
    (req) => trackCompletion(req, completedIds) >= TRACK_UNLOCK_RATIO
  );
}

/**
 * Sequential within a track, gated by prerequisites between tracks.
 * `explore` lifts the gating entirely, for people who would rather
 * jump straight to the topic they need.
 */
export function isLessonUnlocked(
  lesson: Lesson,
  completedIds: Set<string>,
  explore = false
): boolean {
  if (explore) return true;
  if (completedIds.has(lesson.id)) return true;
  if (!isTrackUnlocked(lesson.track, completedIds)) return false;

  const siblings = LESSONS_BY_TRACK[lesson.track] ?? [];
  const index = siblings.findIndex((l) => l.id === lesson.id);
  if (index <= 0) return true;
  return completedIds.has(siblings[index - 1].id);
}

/** The lesson the "continue" button should open. */
export function nextLesson(completedIds: Set<string>, explore = false): Lesson | null {
  return (
    SEED_LESSONS.find(
      (l) => !completedIds.has(l.id) && isLessonUnlocked(l, completedIds, explore)
    ) ?? null
  );
}

export function searchLessons(query: string): Lesson[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SEED_LESSONS.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      l.module.toLowerCase().includes(q) ||
      l.concepts.some((c) => c.includes(q)) ||
      TRACK_BY_ID[l.track].title.toLowerCase().includes(q)
  );
}

export const TOTAL_XP = SEED_LESSONS.reduce((sum, l) => sum + l.xp, 0);
export const TOTAL_MINUTES = SEED_LESSONS.reduce((sum, l) => sum + l.minutes, 0);
