import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, REMOTE_ENABLED } from '../firebase';
import type { LessonState, UserProgress } from '../types';

const LOCAL_KEY = 'codelab.progress.v2';

export function emptyProgress(): UserProgress {
  return {
    version: 2,
    completedLessonIds: [],
    lastLessonId: null,
    lessons: {},
    xp: 0,
    streak: { current: 0, longest: 0, lastActiveDay: null },
    updatedAt: 0,
  };
}

export function emptyLessonState(): LessonState {
  return { attempts: 0, hintsUsed: 0, solutionViewed: false };
}

/** Accepts either shape and always returns a v2 record. */
function normalise(data: any): UserProgress {
  const base = emptyProgress();
  if (!data || typeof data !== 'object') return base;

  const completed: string[] = Array.isArray(data.completedLessonIds)
    ? data.completedLessonIds.filter((x: unknown) => typeof x === 'string')
    : [];

  const lessons: Record<string, LessonState> = {};
  if (data.lessons && typeof data.lessons === 'object') {
    for (const [id, raw] of Object.entries<any>(data.lessons)) {
      lessons[id] = {
        attempts: Number(raw?.attempts) || 0,
        hintsUsed: Number(raw?.hintsUsed) || 0,
        solutionViewed: Boolean(raw?.solutionViewed),
        completedAt: raw?.completedAt ?? undefined,
        savedCode: typeof raw?.savedCode === 'string' ? raw.savedCode : undefined,
        quizScore: typeof raw?.quizScore === 'number' ? raw.quizScore : undefined,
      };
    }
  }

  // v1 records only had a list of ids. Give each one a plausible state so the
  // upgrade does not look like lost progress.
  for (const id of completed) {
    if (!lessons[id]) lessons[id] = { ...emptyLessonState(), attempts: 1, completedAt: data.updatedAt ?? Date.now() };
  }

  return {
    version: 2,
    completedLessonIds: completed,
    lastLessonId: data.lastLessonId ?? null,
    lessons,
    xp: Number(data.xp) || 0,
    streak: {
      current: Number(data?.streak?.current) || 0,
      longest: Number(data?.streak?.longest) || 0,
      lastActiveDay: data?.streak?.lastActiveDay ?? null,
    },
    updatedAt: Number(data.updatedAt) || 0,
  };
}

function readLocal(): UserProgress | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? normalise(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeLocal(progress: UserProgress): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(progress));
  } catch {
    /* quota or private mode; cloud sync or in-memory state still works */
  }
}

export async function loadProgress(uid: string): Promise<UserProgress> {
  const local = readLocal();

  if (!REMOTE_ENABLED || !db) return local ?? emptyProgress();

  try {
    const snap = await getDoc(doc(db, 'progress', uid));
    if (!snap.exists()) return local ?? emptyProgress();
    const remote = normalise(snap.data());
    // Whichever record was touched last wins; they are the same person on
    // two devices, not two people editing one document.
    if (local && local.updatedAt > remote.updatedAt) return local;
    return remote;
  } catch (err) {
    console.error('loadProgress failed, falling back to local copy', err);
    return local ?? emptyProgress();
  }
}

export async function saveProgress(
  uid: string,
  progress: UserProgress
): Promise<void> {
  const stamped = { ...progress, updatedAt: Date.now() };
  writeLocal(stamped);

  if (!REMOTE_ENABLED || !db) return;

  try {
    await setDoc(doc(db, 'progress', uid), stamped);
  } catch (err) {
    console.error('saveProgress failed; kept a local copy', err);
  }
}

// ── Derived values ───────────────────────────────────────────

export function levelFor(xp: number): number {
  return Math.floor(Math.sqrt(xp / 60)) + 1;
}

export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 60;
}

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

/** Advances the streak if today is new. Idempotent within a day. */
export function touchStreak(progress: UserProgress, now = Date.now()): UserProgress {
  const today = dayKey(now);
  const last = progress.streak.lastActiveDay;
  if (last === today) return progress;

  const yesterday = dayKey(now - 86400000);
  const current = last === yesterday ? progress.streak.current + 1 : 1;

  return {
    ...progress,
    streak: {
      current,
      longest: Math.max(current, progress.streak.longest),
      lastActiveDay: today,
    },
  };
}
