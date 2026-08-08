// ─────────────────────────────────────────────────────────────
// Core domain types for the Code Lab curriculum engine.
// ─────────────────────────────────────────────────────────────

export type Language = 'javascript' | 'typescript' | 'python' | 'sql';

/** How a lesson is presented and graded.
 *  console — code runs in a worker, stdout is matched against expectedOutput
 *  tests   — code runs against a hidden/visible test suite (the real-world mode)
 *  web     — code is a full HTML document rendered live in an iframe
 *  react   — code is JSX, compiled and mounted with the real React library
 *  sql     — code is SQL executed against an in-memory SQLite database
 *  quiz    — no code; a set of multiple-choice concept checks
 *  reading — no code; explanation only, completed by acknowledging  */
export type LessonKind =
  | 'console'
  | 'tests'
  | 'web'
  | 'react'
  | 'sql'
  | 'quiz'
  | 'reading';

export interface TestResult {
  name: string;
  passed: boolean;
  /** Failure detail, e.g. "Expected 6 but got 5" */
  message?: string;
}

export interface RunResult {
  stdout: string[];
  error: string | null;
  durationMs: number;
  /** Present for 'tests' lessons. */
  tests?: TestResult[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  /** Shown after answering, right or wrong. Teaching happens here. */
  explanation: string;
}

// ── Tracks ───────────────────────────────────────────────────

export type TrackId =
  | 'foundations'
  | 'js-deep'
  | 'async'
  | 'types'
  | 'python'
  | 'data'
  | 'dsa'
  | 'testing'
  | 'frontend'
  | 'react'
  | 'backend'
  | 'craft'
  | 'interview'
  | 'games';

export type TrackLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Professional';

export interface Track {
  id: TrackId;
  title: string;
  /** One line shown on the track card. */
  blurb: string;
  /** Two or three sentences: what this track is for and why it matters on the job. */
  rationale: string;
  icon: string;
  color: string;
  level: TrackLevel;
  /** Concrete capabilities the learner walks away with. */
  outcomes: string[];
  /** Tracks that should be substantially done first. */
  requires?: TrackId[];
}

// ── Lessons ──────────────────────────────────────────────────

export interface Lesson {
  id: string;
  /** Global position in the curriculum. Stamped by the builder. */
  order: number;
  track: TrackId;
  /** Chapter within the track, used for sidebar grouping. */
  module: string;
  title: string;
  language: Language;
  kind: LessonKind;
  /** 1 = trivial … 5 = genuinely hard */
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Rough time to complete, in minutes. */
  minutes: number;
  /** Skill tags, used for review scheduling and search. */
  concepts: string[];
  /** Markdown. */
  instructions: string;
  starterCode: string;

  /** console lessons: exact-match stdout lines. */
  expectedOutput?: string[];
  /** tests lessons: source appended after the learner's code, using the
   *  test()/expect() harness injected by the runner. */
  testCode?: string;
  /** web and react lessons: JS expression evaluated in the iframe after load.
   *  May return a promise, for checks that need to await an interaction. */
  webCheck?: string;
  /** sql lessons: schema + seed data executed before the learner's query. */
  sqlSetup?: string;

  /** Progressive nudges. Revealed one at a time, never the whole answer at once. */
  hints?: string[];
  /** A worked solution, unlocked after real effort. */
  solution?: string;
  /** Concept checks. On 'quiz' lessons these are the whole lesson. */
  quiz?: QuizQuestion[];

  xp: number;
}

/** What a lesson author writes. The builder fills in the rest. */
export interface LessonDraft {
  id: string;
  title: string;
  language: Language;
  module?: string;
  kind?: LessonKind;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  minutes?: number;
  concepts?: string[];
  instructions: string;
  starterCode?: string;
  expectedOutput?: string[];
  testCode?: string;
  webCheck?: string;
  sqlSetup?: string;
  hints?: string[];
  solution?: string;
  quiz?: QuizQuestion[];
  xp?: number;
  /** Legacy field from the original curriculum; ignored, order is computed. */
  order?: number;
}

// ── Progress ─────────────────────────────────────────────────

export interface LessonState {
  /** Number of Run presses that were graded. */
  attempts: number;
  hintsUsed: number;
  solutionViewed: boolean;
  completedAt?: number;
  /** Last code the learner had in the editor, so work survives navigation. */
  savedCode?: string;
  /** Quiz score as a fraction 0..1, for quiz lessons. */
  quizScore?: number;
}

export interface StreakState {
  current: number;
  longest: number;
  /** YYYY-MM-DD of the last day a lesson was completed. */
  lastActiveDay: string | null;
}

export interface UserProgress {
  version: 2;
  completedLessonIds: string[];
  lastLessonId: string | null;
  lessons: Record<string, LessonState>;
  xp: number;
  streak: StreakState;
  updatedAt: number;
}
