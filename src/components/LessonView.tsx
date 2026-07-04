import { useEffect, useRef, useState } from 'react';
import Editor from './Editor';
import Terminal, { TerminalHandle } from './Terminal';
import WebPreview, { WebPreviewHandle } from './WebPreview';
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

type MobileTab = 'lesson' | 'code' | 'output';

function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function LessonView({
  lesson,
  onComplete,
  isCompleted,
}: LessonViewProps) {
  const [code, setCode] = useState(lesson.starterCode);
  const [running, setRunning] = useState(false);
  const [passed, setPassed] = useState(isCompleted);
  const [tab, setTab] = useState<MobileTab>('lesson');
  const [webMsg, setWebMsg] = useState<string | null>(null);
  const termRef = useRef<TerminalHandle>(null);
  const webRef = useRef<WebPreviewHandle>(null);
  const isMobile = useIsMobile();
  const isWeb = lesson.kind === 'web';

  useEffect(() => {
    setCode(lesson.starterCode);
    setPassed(isCompleted);
    setTab('lesson');
    setWebMsg(null);
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
    if (!lesson.expectedOutput) return true;
    const actual = result.stdout.map((l) => l.trimEnd());
    const expected = lesson.expectedOutput.map((l) => l.trimEnd());
    if (actual.length !== expected.length) return false;
    return expected.every((line, i) => actual[i] === line);
  }

  async function handleRun() {
    if (running) return;
    setRunning(true);
    if (isMobile) setTab('output');

    if (isWeb) {
      setWebMsg(null);
      const ok = await webRef.current?.run(code, lesson.webCheck);
      if (lesson.webCheck) {
        if (ok) {
          setWebMsg('✔ Checks passed — assignment complete!');
          if (!passed) {
            setPassed(true);
            onComplete(lesson.id);
          }
        } else {
          setWebMsg('✘ Not quite yet — the check did not pass. Re-read the task and try again.');
        }
      } else {
        if (!passed) {
          setPassed(true);
          onComplete(lesson.id);
        }
      }
      setRunning(false);
      return;
    }

    const term = termRef.current;
    if (!term) {
      setRunning(false);
      return;
    }
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

  const instructionsPanel = (
    <div
      style={{
        overflowY: 'auto',
        background: '#161b22',
        borderRadius: 8,
        padding: 16,
        color: '#c9d1d9',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>
        {LANG_LABEL[lesson.language]}
        {isWeb && ' · Web project'}
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
      {isMobile && (
        <button
          onClick={() => setTab('code')}
          style={{ ...runBtnStyle(false), marginTop: 16 }}
        >
          Start coding →
        </button>
      )}
    </div>
  );

  const editorPanel = (
    <div
      style={{
        height: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #30363d',
      }}
    >
      <Editor language={lesson.language} value={code} onChange={setCode} />
    </div>
  );

  const runButton = (
    <button onClick={handleRun} disabled={running} style={runBtnStyle(running)}>
      {running ? 'Running…' : isWeb ? '▶ Run & Preview' : '▶ Run'}
    </button>
  );

  // Output pane: iframe for web lessons, terminal otherwise.
  // Both stay mounted on mobile tab switches (hidden, not unmounted).
  const outputPanel = (visible: boolean) => (
    <div
      style={{
        height: '100%',
        minHeight: 0,
        display: visible ? 'flex' : 'none',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {isWeb ? (
        <>
          <div style={{ flex: 1, minHeight: 0 }}>
            <WebPreview ref={webRef} />
          </div>
          {webMsg && (
            <div
              style={{
                flexShrink: 0,
                fontSize: 13,
                padding: '6px 10px',
                borderRadius: 6,
                background: '#161b22',
                color: webMsg.startsWith('✔') ? '#3fb950' : '#f85149',
              }}
            >
              {webMsg}
            </div>
          )}
        </>
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <Terminal ref={termRef} />
        </div>
      )}
    </div>
  );

  if (!isMobile) {
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
        {instructionsPanel}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minHeight: 0,
          }}
        >
          <div style={{ flex: '1 1 55%', minHeight: 0 }}>{editorPanel}</div>
          <div style={{ alignSelf: 'flex-start', width: 200 }}>{runButton}</div>
          <div style={{ flex: '1 1 40%', minHeight: 0 }}>
            {outputPanel(true)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {(['lesson', 'code', 'output'] as MobileTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 6,
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'capitalize',
              cursor: 'pointer',
              background: tab === t ? '#1f6feb' : '#21262d',
              color: tab === t ? '#fff' : '#8b949e',
            }}
          >
            {t === 'output' && isWeb ? 'preview' : t}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        {tab === 'lesson' && instructionsPanel}
        {tab === 'code' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              gap: 8,
            }}
          >
            <div style={{ flex: 1, minHeight: 0 }}>{editorPanel}</div>
            <div style={{ flexShrink: 0 }}>{runButton}</div>
          </div>
        )}
        {outputPanel(tab === 'output')}
      </div>
    </div>
  );
}

function runBtnStyle(running: boolean): React.CSSProperties {
  return {
    padding: '10px 24px',
    borderRadius: 6,
    border: 'none',
    background: running ? '#30363d' : '#238636',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    cursor: running ? 'default' : 'pointer',
    width: '100%',
  };
}
