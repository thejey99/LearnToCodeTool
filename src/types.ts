export interface RunResult {
  stdout: string[];
  error: string | null;
  durationMs: number;
}

export type Language = 'javascript' | 'typescript' | 'python';

export interface Lesson {
  id: string;
  order: number;
  title: string;
  language: Language;
  instructions: string;       // markdown
  starterCode: string;
  expectedOutput?: string[];  // exact-match lines for auto-check
  validator?: string;         // optional: name of custom check
}

export interface UserProgress {
  completedLessonIds: string[];
  lastLessonId: string | null;
  updatedAt: number;
}
