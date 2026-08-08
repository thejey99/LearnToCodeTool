import type { RunResult, TestResult } from '../types';
import { PY_TEST_HARNESS, PY_TEST_FOOTER, PY_RESULT_MARKER } from './harness';

const PYODIDE_VERSION = '0.26.4';

const WORKER_SRC = `
importScripts('https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js');
let pyodidePromise = loadPyodide();

self.onmessage = async (e) => {
  const pyodide = await pyodidePromise;
  const out = [];
  pyodide.setStdout({ batched: (s) => out.push(s) });
  pyodide.setStderr({ batched: (s) => out.push(s) });
  try {
    await pyodide.runPythonAsync(e.data.code);
    self.postMessage({ ok: true, logs: out });
  } catch (err) {
    self.postMessage({ ok: false, logs: out, error: String(err) });
  }
};

self.postMessage({ ready: false, booting: true });
pyodidePromise.then(() => self.postMessage({ ready: true }));
`;

/**
 * The Python interpreter is a multi-megabyte WASM download, so unlike the JS
 * sandbox the worker is kept alive between runs. That persistence is a trap:
 * a function defined by an earlier run would still exist after the learner
 * deletes it, and their tests would pass against a ghost. Every run therefore
 * starts by clearing user-defined globals.
 */
const RESET_GLOBALS = `
for __k in [__n for __n in list(globals().keys()) if not __n.startswith('__')]:
    del globals()[__k]
`;

let worker: Worker | null = null;
let workerUrl: string | null = null;

function getWorker(): Worker {
  if (worker) return worker;
  const blob = new Blob([WORKER_SRC], { type: 'application/javascript' });
  workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl);
  return worker;
}

function killWorker() {
  if (worker) worker.terminate();
  if (workerUrl) URL.revokeObjectURL(workerUrl);
  worker = null;
  workerUrl = null;
}

/** Call on app load to start the ~3-5s WASM boot early. */
export function warmupPython(): void {
  getWorker();
}

export interface PythonRunOptions {
  testCode?: string;
  timeoutMs?: number;
}

/** Runs raw Python. Used by both the Python and SQL tracks. */
export function runPythonSource(
  source: string,
  timeoutMs = 20000
): Promise<{ stdout: string[]; error: string | null; durationMs: number }> {
  return new Promise((resolve) => {
    const w = getWorker();
    const start = performance.now();

    const timer = setTimeout(() => {
      // The worker is persistent, so a hung run means we must rebuild it.
      killWorker();
      resolve({
        stdout: [],
        error:
          'Execution timed out after ' +
          timeoutMs +
          'ms. The usual cause is a loop whose condition never becomes false. The Python engine has been restarted.',
        durationMs: timeoutMs,
      });
    }, timeoutMs);

    const handler = (e: MessageEvent) => {
      if (e.data.ready !== undefined || e.data.booting !== undefined) return;
      clearTimeout(timer);
      w.removeEventListener('message', handler);
      resolve({
        stdout: e.data.logs,
        error: e.data.ok ? null : e.data.error,
        durationMs: Math.round(performance.now() - start),
      });
    };

    w.addEventListener('message', handler);
    w.postMessage({ code: source });
  });
}

export async function runPython(
  code: string,
  opts: PythonRunOptions = {}
): Promise<RunResult> {
  const source = opts.testCode
    ? [RESET_GLOBALS, PY_TEST_HARNESS, code, opts.testCode, PY_TEST_FOOTER].join('\n')
    : [RESET_GLOBALS, code].join('\n');

  const raw = await runPythonSource(source, opts.timeoutMs ?? 20000);

  if (!opts.testCode) {
    return { ...raw, tests: undefined };
  }

  // Lift the JSON test report back out of stdout and hide it from the learner.
  const stdout: string[] = [];
  let tests: TestResult[] = [];
  for (const line of raw.stdout) {
    const at = line.indexOf(PY_RESULT_MARKER);
    if (at === -1) {
      stdout.push(line);
      continue;
    }
    const before = line.slice(0, at);
    if (before) stdout.push(before);
    try {
      tests = JSON.parse(line.slice(at + PY_RESULT_MARKER.length));
    } catch {
      /* leave tests empty; the error path below explains it */
    }
  }

  return { stdout, error: raw.error, durationMs: raw.durationMs, tests };
}
