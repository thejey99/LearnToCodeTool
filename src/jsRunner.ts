import type { RunResult } from '../types';

const WORKER_SRC = `
self.onmessage = (e) => {
  const logs = [];
  const fmt = (a) => {
    try {
      if (typeof a === 'object' && a !== null) return JSON.stringify(a);
      return String(a);
    } catch { return String(a); }
  };
  const push = (args) => logs.push(args.map(fmt).join(' '));
  console.log = (...a) => push(a);
  console.error = (...a) => push(a);
  console.warn = (...a) => push(a);
  console.info = (...a) => push(a);
  try {
    const fn = new Function(e.data.code);
    fn();
    self.postMessage({ ok: true, logs });
  } catch (err) {
    self.postMessage({
      ok: false,
      logs,
      error: (err && err.message) ? err.name + ': ' + err.message : String(err)
    });
  }
};
`;

export function runJS(code: string, timeoutMs = 5000): Promise<RunResult> {
  return new Promise((resolve) => {
    const blob = new Blob([WORKER_SRC], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    const start = performance.now();

    const timer = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve({
        stdout: [],
        error: 'Execution timed out after ' + timeoutMs + 'ms (infinite loop?)',
        durationMs: timeoutMs,
      });
    }, timeoutMs);

    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve({
        stdout: e.data.logs,
        error: e.data.ok ? null : e.data.error,
        durationMs: Math.round(performance.now() - start),
      });
    };

    worker.postMessage({ code });
  });
}
