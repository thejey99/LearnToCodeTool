import { useEffect, useRef, useState } from 'react';
import Editor from './Editor';
import Terminal, { TerminalHandle } from './Terminal';
import WebPreview, { WebPreviewHandle } from './WebPreview';
import TestResults from './TestResults';
import Hints from './Hints';
import Quiz from './Quiz';
import { runLesson, warmupPython } from '../runners';
import { buildReactDocument } from '../runners/reactRunner';
import { Markdown } from '../lib/markdown';
import { T, DIFFICULTY_COLOR, DIFFICULTY_LABEL, LANG_LABEL } from '../lib/theme';
import { TRACK_BY_ID } from '../lessons/tracks';
import type { Lesson, LessonState, RunResult, TestResult } from '../types';

interface LessonViewProps {
  lesson: Lesson;
  state: LessonState;
  isCompleted: boolean;
  onComplete: (lesson: Lesson, meta?: { quizScore?: number }) => void;
  onAttempt: (lessonId: string) => void;
  onSaveCode: (lessonId: string, code: string) => void;
  onUseHint: (lessonId: string, count: number) => void;
  onViewSolution: (lessonId: string) => void;
}

type MobileTab = 'lesson' | 'code' | 'output';

function useIsMobile(breakpoint = 900): boolean {
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
  state,
  isCompleted,
  onComplete,
  onAttempt,
  onSaveCode,
  onUseHint,
  onViewSolution,
}: LessonViewProps) {
  const [code, setCode] = useState(state.savedCode ?? lesson.starterCode);
  const [running, setRunning] = useState(false);
  const [passed, setPassed] = useState(isCompleted);
  const [tab, setTab] = useState<MobileTab>('lesson');
  const [webMsg, setWebMsg] = useState<string | null>(null);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [runError, setRunError] = useState<string | null>(null);
  const termRef = useRef<TerminalHandle>(null);
  const webRef = useRef<WebPreviewHandle>(null);
  const isMobile = useIsMobile();

  const isWeb = lesson.kind === 'web';
  const isReact = lesson.kind === 'react';
  const isPreview = isWeb || isReact;
  const isTests = lesson.kind === 'tests';
  const isQuiz = lesson.kind === 'quiz';
  const isReading = lesson.kind === 'reading';
  const isCodeLesson = !isQuiz && !isReading;

  useEffect(() => {
    setCode(state.savedCode ?? lesson.starterCode);
    setPassed(isCompleted);
    setTab('lesson');
    setWebMsg(null);
    setTests([]);
    setRunError(null);
    termRef.current?.clear();
    if (lesson.language === 'python' || lesson.language === 'sql') warmupPython();
    // Deliberately keyed on the lesson only: re-running on every state change
    // would throw away what the learner is typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  function updateCode(next: string) {
    setCode(next);
    onSaveCode(lesson.id, next);
  }

  function markComplete(meta?: { quizScore?: number }) {
    if (passed) return;
    setPassed(true);
    onComplete(lesson, meta);
  }

  function validateStdout(result: RunResult): boolean {
    if (result.error) return false;
    if (!lesson.expectedOutput) return true;
    const actual = result.stdout.map((l) => l.trimEnd());
    const expected = lesson.expectedOutput.map((l) => l.trimEnd());
    if (actual.length !== expected.length) return false;
    return expected.every((line, i) => actual[i] === line);
  }

  async function handleRun() {
    if (running || !isCodeLesson) return;
    setRunning(true);
    onAttempt(lesson.id);
    if (isMobile) setTab('output');

    try {
      if (isPreview) {
        setWebMsg(null);

        let document = code;
        if (isReact) {
          const built = await buildReactDocument(code);
          if (built.error || built.html === null) {
            setWebMsg('✘ ' + built.error);
            return;
          }
          document = built.html;
        }

        const ok = await webRef.current?.run(document, lesson.webCheck);
        if (!lesson.webCheck) {
          markComplete();
        } else if (ok) {
          setWebMsg('✔ Checks passed — assignment complete.');
          markComplete();
        } else {
          setWebMsg(
            '✘ The check did not pass yet. Re-read the task, and remember the page must work after a fresh load.'
          );
        }
        return;
      }

      const result = await runLesson(lesson, code);

      if (isTests) {
        setTests(result.tests ?? []);
        setRunError(result.error);
        for (const line of result.stdout) termRef.current?.writeLine(line);
        const all =
          (result.tests?.length ?? 0) > 0 && result.tests!.every((t) => t.passed);
        if (all) markComplete();
        return;
      }

      // console + sql
      const term = termRef.current;
      if (!term) return;
      term.clear();
      term.writeInfo('$ run ' + LANG_LABEL[lesson.language].toLowerCase());
      if (lesson.language === 'python' || lesson.language === 'sql') {
        term.writeInfo('(the first run boots the engine; later runs are instant)');
      }

      for (const line of result.stdout) term.writeLine(line);
      if (result.error) term.writeError(result.error);
      term.writeInfo('— finished in ' + result.durationMs + 'ms —');

      if (validateStdout(result)) {
        markComplete();
        if (lesson.expectedOutput) term.writeSuccess('✔ Output matches — lesson complete.');
      } else if (lesson.expectedOutput && !result.error) {
        term.writeError('✘ Output does not match the expected result yet.');
      }
    } finally {
      setRunning(false);
    }
  }

  // ── Panels ─────────────────────────────────────────────────

  const track = TRACK_BY_ID[lesson.track];

  const header = (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
          fontSize: 11.5,
          color: T.textDim,
          marginBottom: 6,
        }}
      >
        <span style={{ color: track.color }}>
          {track.icon} {track.title}
        </span>
        <span>·</span>
        <span>{lesson.module}</span>
        <span
          style={{
            color: DIFFICULTY_COLOR[lesson.difficulty],
            border: `1px solid ${DIFFICULTY_COLOR[lesson.difficulty]}55`,
            borderRadius: 4,
            padding: '1px 6px',
          }}
        >
          {DIFFICULTY_LABEL[lesson.difficulty]}
        </span>
        <span>~{lesson.minutes} min</span>
        {isTests && <span style={{ color: T.green }}>· test-graded</span>}
        {passed && <span style={{ color: T.green }}>· ✔ completed</span>}
      </div>
      <h2 style={{ margin: 0, fontSize: 20, color: '#e6edf3' }}>{lesson.title}</h2>
    </div>
  );

  const instructionsPanel = (
    <div
      style={{
        overflowY: 'auto',
        background: T.panel,
        borderRadius: 8,
        padding: 18,
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {header}
      <Markdown source={lesson.instructions} />

      {lesson.expectedOutput && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: T.textDim, marginBottom: 4, fontWeight: 700 }}>
            EXPECTED OUTPUT
          </div>
          <pre
            style={{
              background: T.bg,
              padding: 10,
              borderRadius: 6,
              fontSize: 12.5,
              overflowX: 'auto',
              fontFamily: T.mono,
              border: `1px solid ${T.borderSoft}`,
            }}
          >
            {lesson.expectedOutput.join('\n')}
          </pre>
        </div>
      )}

      {isCodeLesson && (
        <Hints
          hints={lesson.hints ?? []}
          solution={lesson.solution}
          language={lesson.language === 'sql' ? 'sql' : lesson.language}
          attempts={state.attempts}
          hintsUsed={state.hintsUsed}
          solutionViewed={state.solutionViewed}
          onUseHint={(count) => onUseHint(lesson.id, count)}
          onViewSolution={() => onViewSolution(lesson.id)}
        />
      )}

      {isReading && (
        <button
          onClick={() => markComplete()}
          disabled={passed}
          style={{
            ...runButtonStyle(false),
            marginTop: 20,
            width: 'auto',
            background: passed ? T.borderSoft : '#238636',
          }}
        >
          {passed ? '✔ Marked as read' : 'Mark as read'}
        </button>
      )}

      {isQuiz && lesson.quiz && (
        <div style={{ marginTop: 20 }}>
          <Quiz
            questions={lesson.quiz}
            onFinish={(score) => markComplete({ quizScore: score })}
          />
        </div>
      )}

      {isMobile && isCodeLesson && (
        <button onClick={() => setTab('code')} style={{ ...runButtonStyle(false), marginTop: 20 }}>
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
        border: `1px solid ${T.border}`,
      }}
    >
      <Editor
        language={lesson.language}
        value={code}
        onChange={updateCode}
        onRun={handleRun}
        jsx={isReact}
      />
    </div>
  );

  const controls = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <button onClick={handleRun} disabled={running} style={runButtonStyle(running)}>
        {running ? 'Running…' : isPreview ? '▶ Run & Preview' : '▶ Run'}
      </button>
      <button
        onClick={() => updateCode(lesson.starterCode)}
        style={ghostButtonStyle}
        title="Restore the starter code"
      >
        ↺ Reset
      </button>
      <span style={{ fontSize: 11.5, color: T.textFaint }}>
        {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter to run
      </span>
      {state.attempts > 0 && (
        <span style={{ fontSize: 11.5, color: T.textFaint }}>
          · {state.attempts} {state.attempts === 1 ? 'attempt' : 'attempts'}
        </span>
      )}
    </div>
  );

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
      {isPreview ? (
        <>
          <div style={{ flex: 1, minHeight: 0 }}>
            <WebPreview ref={webRef} />
          </div>
          {webMsg && (
            <div
              style={{
                flexShrink: 0,
                fontSize: 13,
                padding: '7px 10px',
                borderRadius: 6,
                background: T.panel,
                color: webMsg.startsWith('✔') ? T.green : T.red,
              }}
            >
              {webMsg}
            </div>
          )}
        </>
      ) : isTests ? (
        <div style={{ flex: 1, minHeight: 0 }}>
          <TestResults results={tests} error={runError} />
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <Terminal ref={termRef} />
        </div>
      )}
    </div>
  );

  // ── Layout ─────────────────────────────────────────────────

  if (!isCodeLesson) {
    return (
      <div style={{ height: '100%', minHeight: 0, maxWidth: 860, margin: '0 auto' }}>
        {instructionsPanel}
      </div>
    );
  }

  if (!isMobile) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 5fr) 7fr',
          gap: 12,
          height: '100%',
          minHeight: 0,
        }}
      >
        {instructionsPanel}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <div style={{ flex: '1 1 55%', minHeight: 0 }}>{editorPanel}</div>
          <div style={{ flexShrink: 0 }}>{controls}</div>
          <div style={{ flex: '1 1 45%', minHeight: 0 }}>{outputPanel(true)}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 8 }}>
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
              background: tab === t ? T.accent : T.borderSoft,
              color: tab === t ? '#fff' : T.textDim,
            }}
          >
            {t === 'output' ? (isPreview ? 'preview' : isTests ? 'tests' : 'output') : t}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        {tab === 'lesson' && instructionsPanel}
        {tab === 'code' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
            <div style={{ flex: 1, minHeight: 0 }}>{editorPanel}</div>
            <div style={{ flexShrink: 0 }}>{controls}</div>
          </div>
        )}
        {outputPanel(tab === 'output')}
      </div>
    </div>
  );
}

function runButtonStyle(running: boolean): React.CSSProperties {
  return {
    padding: '9px 22px',
    borderRadius: 6,
    border: 'none',
    background: running ? T.borderSoft : '#238636',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    cursor: running ? 'default' : 'pointer',
  };
}

const ghostButtonStyle: React.CSSProperties = {
  padding: '9px 14px',
  borderRadius: 6,
  border: `1px solid ${T.border}`,
  background: 'transparent',
  color: T.text,
  fontSize: 13,
  cursor: 'pointer',
};
