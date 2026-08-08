import type { Lesson, LessonDraft, TrackId } from '../types';

const XP_BY_DIFFICULTY: Record<number, number> = { 1: 10, 2: 20, 3: 35, 4: 55, 5: 80 };
const MINUTES_BY_DIFFICULTY: Record<number, number> = { 1: 5, 2: 10, 3: 15, 4: 25, 5: 35 };

export interface BuildDefaults {
  module?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  kind?: Lesson['kind'];
  concepts?: string[];
}

/**
 * Turns the shorthand a lesson author writes into a complete Lesson.
 * Difficulty drives xp and time estimates so those never have to be
 * hand-maintained across a few hundred lessons.
 */
export function buildTrack(
  track: TrackId,
  drafts: LessonDraft[],
  defaults: BuildDefaults = {}
): Lesson[] {
  return drafts.map((d) => {
    const difficulty = d.difficulty ?? defaults.difficulty ?? 2;
    const kind: Lesson['kind'] =
      d.kind ??
      defaults.kind ??
      (d.quiz && !d.starterCode ? 'quiz' : d.testCode ? 'tests' : 'console');

    return {
      id: d.id,
      order: 0, // stamped when the full curriculum is assembled
      track,
      module: d.module ?? defaults.module ?? 'Lessons',
      title: d.title,
      language: d.language,
      kind,
      difficulty,
      minutes: d.minutes ?? MINUTES_BY_DIFFICULTY[difficulty],
      concepts: d.concepts ?? defaults.concepts ?? [],
      instructions: d.instructions,
      starterCode: d.starterCode ?? '',
      expectedOutput: d.expectedOutput,
      testCode: d.testCode,
      webCheck: d.webCheck,
      sqlSetup: d.sqlSetup,
      hints: d.hints,
      solution: d.solution,
      quiz: d.quiz,
      xp: d.xp ?? XP_BY_DIFFICULTY[difficulty],
    };
  });
}

/** Extra material bolted onto lessons that were authored before hints existed. */
export interface LessonAugmentation {
  module?: string;
  concepts?: string[];
  difficulty?: 1 | 2 | 3 | 4 | 5;
  hints?: string[];
  solution?: string;
}

export function augment(
  lessons: Lesson[],
  extras: Record<string, LessonAugmentation>
): Lesson[] {
  return lessons.map((l) => {
    const extra = extras[l.id];
    if (!extra) return l;
    const difficulty = extra.difficulty ?? l.difficulty;
    return {
      ...l,
      module: extra.module ?? l.module,
      concepts: extra.concepts ?? l.concepts,
      difficulty,
      xp: XP_BY_DIFFICULTY[difficulty],
      minutes: MINUTES_BY_DIFFICULTY[difficulty],
      hints: extra.hints ?? l.hints,
      solution: extra.solution ?? l.solution,
    };
  });
}
