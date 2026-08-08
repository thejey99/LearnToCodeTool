import { transform } from 'sucrase';
import { runJS, type RunOptions } from './jsRunner';
import type { RunResult } from '../types';

/**
 * TypeScript is stripped to JavaScript before it reaches the sandbox.
 *
 * Note the honest limitation, which lessons in the Types track call out:
 * this strips annotations, it does not type-check. Sucrase reports syntax
 * errors only. Type errors are taught through the lesson text and tests
 * rather than through a compiler.
 */
export async function runTS(
  code: string,
  opts: RunOptions = {}
): Promise<RunResult> {
  let js: string;
  try {
    js = transform(code, { transforms: ['typescript'] }).code;
  } catch (err: any) {
    return {
      stdout: [],
      error: 'TypeScript syntax error: ' + (err?.message ?? String(err)),
      durationMs: 0,
    };
  }

  let testCode = opts.testCode;
  if (testCode) {
    try {
      testCode = transform(testCode, { transforms: ['typescript'] }).code;
    } catch {
      // Test source is authored here, so a failure means a lesson bug,
      // not a learner mistake. Fall through with the original text.
    }
  }

  return runJS(js, { ...opts, testCode });
}
