export interface RunResult {
  stdout: string[];
  error: string | null;
  durationMs: number;
}

export type Language = 'javascript' | 'typescript' | 'python';

export type LessonKind = 'console' | 'web';

export interface Lesson {
  id: string;
  order: number;
  title: string;
  language: Language;
  /** 'console' (default): code runs in worker, output in terminal.
      'web': code is a full HTML document rendered live in an iframe. */
  kind?: LessonKind;
  instructions: string;       // plain text/markdown-ish
  starterCode: string;
  expectedOutput?: string[];  // console lessons: exact-match lines
  /** web lessons: JS expression evaluated inside the iframe after load.
      If it returns true, the lesson is marked complete. */
  webCheck?: string;
}

export interface UserProgress {
  completedLessonIds: string[];
  lastLessonId: string | null;
  updatedAt: number;
}
