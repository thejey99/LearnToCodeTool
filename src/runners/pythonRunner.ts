import type { RunResult } from '../types';

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

export function runPython(code: string, timeoutMs = 15000): Promise<RunResult> {
  return new Promise((resolve) => {
    const w = getWorker();
    const start = performance.now();

    const timer = setTimeout(() => {
      // Pyodide worker is persistent; a hung run means we must rebuild it
      killWorker();
      resolve({
        stdout: [],
        error: 'Execution timed out after ' + timeoutMs + 'ms (infinite loop?). Python engine restarted.',
        durationMs: timeoutMs,
      });
    }, timeoutMs);

    const handler = (e: MessageEvent) => {
      if (e.data.ready !== undefined || e.data.booting !== undefined) return; // boot signals
      clearTimeout(timer);
      w.removeEventListener('message', handler);
      resolve({
        stdout: e.data.logs,
        error: e.data.ok ? null : e.data.error,
        durationMs: Math.round(performance.now() - start),
      });
    };

    w.addEventListener('message', handler);
    w.postMessage({ code });
  });
}
