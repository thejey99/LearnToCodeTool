import type { RunResult } from '../types';
import { JS_TEST_HARNESS } from './harness';

/** How long to let queued timers drain after the main body finishes. */
const SETTLE_MS = 60;

/**
 * The sandbox. Learner code never touches the app: it runs inside a Web
 * Worker built from a blob, with no DOM and no access to this page. A hung
 * program is killed by terminating the worker.
 */
const WORKER_SRC = `
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

self.onmessage = async (e) => {
  const logs = [];
  const fmt = (a) => {
    try {
      if (a instanceof Error) return a.name + ': ' + a.message;
      if (typeof a === 'object' && a !== null) return JSON.stringify(a);
      if (typeof a === 'undefined') return 'undefined';
      return String(a);
    } catch { return String(a); }
  };
  const push = (args) => logs.push(args.map(fmt).join(' '));
  console.log = (...a) => push(a);
  console.error = (...a) => push(a);
  console.warn = (...a) => push(a);
  console.info = (...a) => push(a);
  console.debug = (...a) => push(a);

  const results = [];
  const { code, testCode, harness } = e.data;

  const body = harness
    ? harness + '\\n' + code + '\\n' + (testCode || '') + '\\nawait __run();'
    : code;

  try {
    const fn = new AsyncFunction('__results', body);
    await fn(results);
    // The body finishing does not mean the program has: a setTimeout(fn, 0)
    // callback is still queued. Give the task queue a moment to drain so
    // event-loop lessons can actually show their output.
    await new Promise((r) => setTimeout(r, ' + SETTLE_MS + '));
    self.postMessage({ ok: true, logs, tests: results });
  } catch (err) {
    self.postMessage({
      ok: false,
      logs,
      tests: results,
      error: (err && err.message) ? err.name + ': ' + err.message : String(err)
    });
  }
};
`;

export interface RunOptions {
  /** When present, the code is graded by a test suite instead of stdout. */
  testCode?: string;
  timeoutMs?: number;
}

export function runJS(code: string, opts: RunOptions = {}): Promise<RunResult> {
  const timeoutMs = opts.timeoutMs ?? 5000;

  return new Promise((resolve) => {
    const blob = new Blob([WORKER_SRC], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    const start = performance.now();

    const cleanup = () => {
      worker.terminate();
      URL.revokeObjectURL(url);
    };

    const timer = setTimeout(() => {
      cleanup();
      resolve({
        stdout: [],
        error:
          'Execution timed out after ' +
          timeoutMs +
          'ms. The usual cause is a loop whose condition never becomes false.',
        durationMs: timeoutMs,
      });
    }, timeoutMs);

    worker.onmessage = (e) => {
      clearTimeout(timer);
      cleanup();
      resolve({
        stdout: e.data.logs,
        error: e.data.ok ? null : e.data.error,
        durationMs: Math.round(performance.now() - start),
        tests: opts.testCode ? e.data.tests : undefined,
      });
    };

    worker.onerror = (e) => {
      clearTimeout(timer);
      cleanup();
      resolve({
        stdout: [],
        error: e.message || 'The sandbox failed to start.',
        durationMs: Math.round(performance.now() - start),
      });
    };

    worker.postMessage({
      code,
      testCode: opts.testCode,
      harness: opts.testCode ? JS_TEST_HARNESS : undefined,
    });
  });
}
