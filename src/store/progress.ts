import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProgress } from '../types';

const EMPTY: UserProgress = {
  completedLessonIds: [],
  lastLessonId: null,
  updatedAt: 0,
};

export async function loadProgress(uid: string): Promise<UserProgress> {
  try {
    const snap = await getDoc(doc(db, 'progress', uid));
    if (!snap.exists()) return { ...EMPTY };
    const data = snap.data();
    return {
      completedLessonIds: Array.isArray(data.completedLessonIds)
        ? data.completedLessonIds
        : [],
      lastLessonId: data.lastLessonId ?? null,
      updatedAt: data.updatedAt ?? 0,
    };
  } catch (err) {
    console.error('loadProgress failed', err);
    return { ...EMPTY };
  }
}

export async function saveProgress(
  uid: string,
  progress: UserProgress
): Promise<void> {
  try {
    await setDoc(doc(db, 'progress', uid), {
      ...progress,
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.error('saveProgress failed', err);
  }
}
