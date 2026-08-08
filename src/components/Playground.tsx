import { useEffect, useRef, useState } from 'react';
import Editor from './Editor';
import Terminal, { TerminalHandle } from './Terminal';
import { runScratch, warmupPython } from '../runners';
import { T, LANG_LABEL } from '../lib/theme';
import type { Language } from '../types';

const STORAGE_KEY = 'codelab.playground';

const STARTERS: Record<Language, string> = {
  javascript: `// Scratch space. Nothing here is graded.
const nums = [5, 3, 8, 1];

console.log(nums.filter((n) => n > 2).map((n) => n * 10));
`,
  typescript: `interface Room {
  num: number;
  rate: number;
}

const rooms: Room[] = [
  { num: 101, rate: 120 },
  { num: 201, rate: 220 },
];

console.log(rooms.map((r) => \`\${r.num}: $\${r.rate}\`));
`,
  python: `rooms = [
    {"num": 101, "rate": 120},
    {"num": 201, "rate": 220},
]

for room in rooms:
    print(f"Room {room['num']}: \${room['rate']}")
`,
  sql: `-- A scratch database. Create your own tables and query them.
CREATE TABLE demo (id INTEGER PRIMARY KEY, name TEXT, score INTEGER);

INSERT INTO demo (name, score) VALUES ('Ada', 10), ('Alan', 7), ('Grace', 12);

SELECT name, score FROM demo ORDER BY score DESC;
`,
};

/**
 * A no-stakes sandbox. Lessons are graded and prescriptive; this is where you
 * try the thing you just half-understood, which is a large part of how anyone
 * actually learns to program.
 */
export default function Playground({ onBack }: { onBack: () => void }) {
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(STARTERS.javascript);
  const [running, setRunning] = useState(false);
  const termRef = useRef<TerminalHandle>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (saved?.language && saved?.code) {
        setLanguage(saved.language);
        setCode(saved.code);
      }
    } catch {
      /* nothing saved */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ language, code }));
    } catch {
      /* private mode */
    }
  }, [language, code]);

  function switchLanguage(next: Language) {
    setLanguage(next);
    setCode(STARTERS[next]);
    if (next === 'python' || next === 'sql') warmupPython();
  }

  async function run() {
    if (running) return;
    setRunning(true);
    const term = termRef.current;
    term?.clear();
    term?.writeInfo('$ run ' + LANG_LABEL[language].toLowerCase());

    try {
      const result = await runScratch(language, code);
      for (const line of result.stdout) term?.writeLine(line);
      if (result.error) term?.writeError(result.error);
      term?.writeInfo('— finished in ' + result.durationMs + 'ms —');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={onBack} style={ghostButton}>
          ← Back
        </button>

        {(Object.keys(STARTERS) as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => switchLanguage(lang)}
            style={{
              ...ghostButton,
              background: language === lang ? T.accentSoft : 'transparent',
              borderColor: language === lang ? T.accent : T.border,
              color: language === lang ? T.accent : T.text,
            }}
          >
            {LANG_LABEL[lang]}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button onClick={run} disabled={running} style={runButton(running)}>
          {running ? 'Running…' : '▶ Run'}
        </button>
      </div>

      <div style={{ flex: '1 1 60%', minHeight: 0, borderRadius: 8, overflow: 'hidden', border: `1px solid ${T.border}` }}>
        <Editor language={language} value={code} onChange={setCode} onRun={run} />
      </div>

      <div style={{ flex: '1 1 40%', minHeight: 0 }}>
        <Terminal ref={termRef} />
      </div>
    </div>
  );
}

const ghostButton: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: 6,
  border: `1px solid ${T.border}`,
  background: 'transparent',
  color: T.text,
  fontSize: 13,
  cursor: 'pointer',
};

function runButton(running: boolean): React.CSSProperties {
  return {
    padding: '8px 20px',
    borderRadius: 6,
    border: 'none',
    background: running ? T.borderSoft : '#238636',
    color: '#fff',
    fontWeight: 600,
    fontSize: 13.5,
    cursor: running ? 'default' : 'pointer',
  };
}
