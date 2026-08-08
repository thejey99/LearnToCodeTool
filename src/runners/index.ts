import type { Lesson, RunResult } from '../types';
import { runJS } from './jsRunner';
import { runTS } from './tsRunner';
import { runPython, warmupPython } from './pythonRunner';
import { runSQL } from './sqlRunner';

export { warmupPython };

/** Single entry point: hands a lesson's code to the right sandbox. */
export function runLesson(lesson: Lesson, code: string): Promise<RunResult> {
  const testCode = lesson.kind === 'tests' ? lesson.testCode : undefined;

  switch (lesson.language) {
    case 'python':
      return runPython(code, { testCode });
    case 'typescript':
      return runTS(code, { testCode });
    case 'sql':
      return runSQL(code, lesson.sqlSetup);
    case 'javascript':
    default:
      return runJS(code, { testCode });
  }
}

/** Used by the Playground, which has a language picker but no lesson. */
export function runScratch(
  language: Lesson['language'],
  code: string
): Promise<RunResult> {
  switch (language) {
    case 'python':
      return runPython(code);
    case 'typescript':
      return runTS(code);
    case 'sql':
      return runSQL(code, '');
    case 'javascript':
    default:
      return runJS(code);
  }
}
