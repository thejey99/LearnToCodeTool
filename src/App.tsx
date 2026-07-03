import { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { watchAuth, signIn, signOut, isAllowed } from './firebase';
import { loadProgress, saveProgress } from './store/progress';
import { SEED_LESSONS } from './lessons/seed';
import LessonList from './components/LessonList';
import LessonView from './components/LessonView';
import type { Lesson, UserProgress } from './types';

type AuthState = 'loading' | 'signedOut' | 'denied' | 'ready';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const lessons = useMemo(
    () => [...SEED_LESSONS].sort((a, b) => a.order - b.order),
    []
  );

  useEffect(() => {
    return watchAuth(async (u) => {
      setUser(u);
      if (!u) {
        setAuthState('signedOut');
        setProgress(null);
        setActiveLesson(null);
        return;
      }
      if (!isAllowed(u)) {
        setAuthState('denied');
        return;
      }
      const p = await loadProgress(u.uid);
      setProgress(p);
      const resume =
        lessons.find((l) => l.id === p.lastLessonId) ?? lessons[0] ?? null;
      setActiveLesson(resume);
      setAuthState('ready');
    });
  }, [lessons]);

  function handleSelect(lesson: Lesson) {
    setActiveLesson(lesson);
    if (user && progress) {
      const next = { ...progress, lastLessonId: lesson.id };
      setProgress(next);
      saveProgress(user.uid, next);
    }
    if (window.innerWidth < 768) setSidebarOpen(false);
  }

  function handleComplete(lessonId: string) {
    if (!user || !progress) return;
    if (progress.completedLessonIds.includes(lessonId)) return;
    const next = {
      ...progress,
      completedLessonIds: [...progress.completedLessonIds, lessonId],
    };
    setProgress(next);
    saveProgress(user.uid, next);
  }

  if (authState === 'loading') {
    return <Centered>Loading…</Centered>;
  }

  if (authState === 'signedOut') {
    return (
      <Centered>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>Code Lab</h1>
        <button onClick={signIn} style={btnStyle}>
          Sign in with Google
        </button>
      </Centered>
    );
  }

  if (authState === 'denied') {
    return (
      <Centered>
        <p>This account does not have access.</p>
        <button onClick={signOut} style={btnStyle}>
          Sign out
        </button>
      </Centered>
    );
  }

  const completedIds = progress?.completedLessonIds ?? [];
  const doneCount = completedIds.length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#0d1117',
        color: '#c9d1d9',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          borderBottom: '1px solid #21262d',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          style={{ ...iconBtnStyle }}
          aria-label="Toggle lesson list"
        >
          ☰
        </button>
        <strong style={{ fontSize: 15 }}>Code Lab</strong>
        <span style={{ fontSize: 12, color: '#8b949e' }}>
          {doneCount}/{lessons.length} complete
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: '#8b949e' }}>{user?.email}</span>
        <button onClick={signOut} style={iconBtnStyle}>
          Sign out
        </button>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {sidebarOpen && (
          <aside
            style={{
             width: 260,
             flexShrink: 0,
             borderRight: '1px solid #21262d',
             padding: 8,
             overflowY: 'auto',
             ...(window.innerWidth < 768
    ? {
        position: 'absolute' as const,
        top: 49,
        left: 0,
        bottom: 0,
        zIndex: 10,
        background: '#0d1117',
        boxShadow: '4px 0 12px rgba(0,0,0,0.5)',
      }
    : {}),
}}
          >
            <LessonList
              lessons={lessons}
              completedIds={completedIds}
              activeLessonId={activeLesson?.id ?? null}
              onSelect={handleSelect}
            />
          </aside>
        )}

        <main style={{ flex: 1, minWidth: 0, padding: 12 }}>
          {activeLesson ? (
            <LessonView
              key={activeLesson.id}
              lesson={activeLesson}
              onComplete={handleComplete}
              isCompleted={completedIds.includes(activeLesson.id)}
            />
          ) : (
            <Centered>Select a lesson to begin.</Centered>
          )}
        </main>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d1117',
        color: '#c9d1d9',
        gap: 8,
      }}
    >
      {children}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: 6,
  border: 'none',
  background: '#238636',
  color: '#fff',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
};

const iconBtnStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 6,
  border: '1px solid #30363d',
  background: 'transparent',
  color: '#c9d1d9',
  fontSize: 13,
  cursor: 'pointer',
};
