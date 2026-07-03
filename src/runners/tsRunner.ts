import { transform } from 'sucrase';
import { runJS } from './jsRunner';
import type { RunResult } from '../types';

export async function runTS(code: string): Promise<RunResult> {
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
  return runJS(js);
}
