import type { RunResult } from '../types';
import { runPythonSource } from './pythonRunner';

const ERROR_MARKER = '__CODELAB_SQL_ERROR__';

/**
 * SQL runs on a real database. There is no SQL engine in the browser, but
 * Python ships one — sqlite3 is in its standard library — so the Python WASM
 * interpreter that already powers the Python track doubles as a database
 * server here. Each run gets a fresh in-memory database seeded from the
 * lesson's schema, so a botched UPDATE never poisons the next attempt.
 */
export async function runSQL(sql: string, setup = ''): Promise<RunResult> {
  const program = `
import sqlite3

__con = sqlite3.connect(":memory:")
__setup = ${JSON.stringify(setup)}
__sql = ${JSON.stringify(sql)}

if __setup.strip():
    __con.executescript(__setup)

def __split(text):
    """Split on semicolons that are not inside a quoted literal."""
    out, cur, quote = [], "", None
    for ch in text:
        if quote:
            cur += ch
            if ch == quote:
                quote = None
        elif ch in ("'", '"'):
            quote = ch
            cur += ch
        elif ch == ";":
            out.append(cur)
            cur = ""
        else:
            cur += ch
    out.append(cur)
    return [s.strip() for s in out if s.strip() and not s.strip().startswith("--")]

def __cell(v):
    if v is None:
        return "NULL"
    if isinstance(v, float):
        s = ("%.4f" % v).rstrip("0").rstrip(".")
        return s if s else "0"
    return str(v)

try:
    for __stmt in __split(__sql):
        __cur = __con.execute(__stmt)
        if __cur.description:
            print(" | ".join(d[0] for d in __cur.description))
            for __row in __cur.fetchall():
                print(" | ".join(__cell(v) for v in __row))
    __con.commit()
except Exception as __e:
    print("${ERROR_MARKER}" + type(__e).__name__ + ": " + str(__e))
`;

  const raw = await runPythonSource(program);

  const stdout: string[] = [];
  let error = raw.error;
  for (const line of raw.stdout) {
    const at = line.indexOf(ERROR_MARKER);
    if (at === -1) {
      stdout.push(line);
    } else {
      error = line.slice(at + ERROR_MARKER.length);
    }
  }

  return { stdout, error, durationMs: raw.durationMs };
}
