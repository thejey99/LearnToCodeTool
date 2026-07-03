import { useEffect, useRef, useState } from 'react';
import Editor from './Editor';
import Terminal, { TerminalHandle } from './Terminal';
import { runJS } from '../runners/jsRunner';
import { runTS } from '../runners/tsRunner';
import { runPython, warmupPython } from '../runners/pythonRunner';
import type { Lesson, RunResult } from '../types';

interface LessonViewProps {
  lesson: Lesson;
  onComplete: (lessonId: string) => void;
  isCompleted: boolean;
}

const LANG_LABEL: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
};

export default function LessonView({
  lesson,
  onComplete,
  isCompleted,
}: LessonViewProps) {
  const [code, setCode] = useState(lesson.starterCode);
  const [running, setRunning] = useState(false);
  const [passed, setPassed] = useState(isCompleted);
  const termRef = useRef<TerminalHandle>(null);

  // Reset editor when switching lessons
  useEffect(() => {
    setCode(lesson.starterCode);
    setPassed(isCompleted);
    termRef.current?.clear();
    if (lesson.language === 'python') warmupPython();
  }, [lesson.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function execute(): Promise<RunResult> {
    switch (lesson.language) {
      case 'python':
        return runPython(code);
      case 'typescript':
        return runTS(code);
      default:
        return runJS(code);
    }
  }

  function validate(result: RunResult): boolean {
    if (result.error) return false;
    if (!lesson.expectedOutput) return true; // free-play lesson
    const actual = result.stdout.map((l) => l.trimEnd());
    const expected = lesson.expectedOutput.map((l) => l.trimEnd());
    if (actual.length !== expected.length) return false;
    return expected.every((line, i) => actual[i] === line);
  }

  async function handleRun() {
    const term = termRef.current;
    if (!term || running) return;

    setRunning(true);
    term.clear();
    term.writeInfo('$ run ' + LANG_LABEL[lesson.language].toLowerCase());
    if (lesson.language === 'python') {
      term.writeInfo('(first Python run may take a few seconds to boot)');
    }

    const result = await execute();

    for (const line of result.stdout) term.writeLine(line);
    if (result.error) term.writeError(result.error);
    term.writeInfo('— finished in ' + result.durationMs + 'ms —');

    if (validate(result)) {
      if (!passed) {
        setPassed(true);
        onComplete(lesson.id);
      }
      if (lesson.expectedOutput) {
        term.writeSuccess('✔ Output matches — lesson complete!');
      }
    } else if (lesson.expectedOutput && !result.error) {
      term.writeError('✘ Output does not match the expected result yet.');
    }

    setRunning(false);
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1fr) 2fr',
        gap: 12,
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Instructions panel */}
      <div
        style={{
          overflowY: 'auto',
          background: '#161b22',
          borderRadius: 8,
          padding: 16,
          color: '#c9d1d9',
        }}
      >
        <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>
          {LANG_LABEL[lesson.language]}
          {passed && <span style={{ color: '#3fb950' }}> · ✔ completed</span>}
        </div>
        <h2 style={{ margin: '0 0 12px', fontSize: 18 }}>{lesson.title}</h2>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: 14 }}>
          {lesson.instructions}
        </div>
        {lesson.expectedOutput && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>
              Expected output:
            </div>
            <pre
              style={{
                background: '#0d1117',
                padding: 10,
                borderRadius: 6,
                fontSize: 13,
                overflowX: 'auto',
              }}
            >
              {lesson.expectedOutput.join('\n')}
            </pre>
          </div>
        )}
      </div>

      {/* Editor + terminal column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          minHeight: 0,
        }}
      >
        <div
          style={{
            flex: '1 1 55%',
            minHeight: 0,
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid #30363d',
          }}
        >
          <Editor
            language={lesson.language}
            value={code}
            onChange={setCode}
          />
        </div>

        <button
          onClick={handleRun}
          disabled={running}
          style={{
            alignSelf: 'flex-start',
            padding: '8px 24px',
            borderRadius: 6,
            border: 'none',
            background: running ? '#30363d' : '#238636',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: running ? 'default' : 'pointer',
          }}
        >
          {running ? 'Running…' : '▶ Run'}
        </button>

        <div style={{ flex: '1 1 40%', minHeight: 0 }}>
          <Terminal ref={termRef} />
        </div>
      </div>
    </div>
  );
}
