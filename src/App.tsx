import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { watchAuth, signIn, signOut, isAllowed, REMOTE_ENABLED } from './firebase';
import {
  loadProgress,
  saveProgress,
  emptyProgress,
  emptyLessonState,
  levelFor,
  touchStreak,
} from './store/progress';
import {
  SEED_LESSONS,
  LESSON_BY_ID,
  LESSONS_BY_TRACK,
  nextLesson,
  isLessonUnlocked,
  TRACKS,
} from './lessons/seed';
import LessonList from './components/LessonList';
import LessonView from './components/LessonView';
import Dashboard from './components/Dashboard';
import Playground from './components/Playground';
import { T } from './lib/theme';
import type { Lesson, TrackId, UserProgress } from './types';

type AuthState = 'loading' | 'signedOut' | 'denied' | 'ready';
type View = 'dashboard' | 'lesson' | 'playground';

const EXPLORE_KEY = 'codelab.explore';
const SAVE_DEBOUNCE_MS = 800;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [activeTrack, setActiveTrack] = useState<TrackId>('foundations');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [explore, setExplore] = useState(
    () => localStorage.getItem(EXPLORE_KEY) === 'true'
  );

  const saveTimer = useRef<number | undefined>(undefined);
  const uid = user?.uid ?? 'local';

  // ── Auth ─────────────────────────────────────────────────
  useEffect(() => {
    // Without Firebase configured the app runs locally against localStorage,
    // which keeps it usable straight after a clone.
    if (!REMOTE_ENABLED) {
      loadProgress('local').then((p) => {
        setProgress(p);
        setAuthState('ready');
      });
      return;
    }

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
      const resume = p.lastLessonId ? LESSON_BY_ID.get(p.lastLessonId) : undefined;
      if (resume) setActiveTrack(resume.track);
      setAuthState('ready');
    });
  }, []);

  // ── Persistence ──────────────────────────────────────────
  const persist = useCallback(
    (next: UserProgress, immediate = false) => {
      setProgress(next);
      window.clearTimeout(saveTimer.current);
      if (immediate) {
        saveProgress(uid, next);
      } else {
        saveTimer.current = window.setTimeout(
          () => saveProgress(uid, next),
          SAVE_DEBOUNCE_MS
        );
      }
    },
    [uid]
  );

  useEffect(() => () => window.clearTimeout(saveTimer.current), []);

  const completedIds = useMemo(
    () => new Set(progress?.completedLessonIds ?? []),
    [progress]
  );

  function stateFor(lessonId: string) {
    return progress?.lessons[lessonId] ?? emptyLessonState();
  }

  function patchLesson(
    lessonId: string,
    changes: Partial<ReturnType<typeof emptyLessonState>>,
    immediate = false
  ) {
    if (!progress) return;
    const current = progress.lessons[lessonId] ?? emptyLessonState();
    persist(
      {
        ...progress,
        lessons: { ...progress.lessons, [lessonId]: { ...current, ...changes } },
      },
      immediate
    );
  }

  // ── Lesson events ────────────────────────────────────────

  function openLesson(lesson: Lesson) {
    setActiveLesson(lesson);
    setActiveTrack(lesson.track);
    setView('lesson');
    if (progress) {
      persist({ ...progress, lastLessonId: lesson.id }, true);
    }
    if (window.innerWidth < 900) setSidebarOpen(false);
  }

  function handleComplete(lesson: Lesson, meta?: { quizScore?: number }) {
    if (!progress || progress.completedLessonIds.includes(lesson.id)) return;

    const current = progress.lessons[lesson.id] ?? emptyLessonState();
    const withStreak = touchStreak(progress);

    persist(
      {
        ...withStreak,
        completedLessonIds: [...withStreak.completedLessonIds, lesson.id],
        xp: withStreak.xp + lesson.xp,
        lessons: {
          ...withStreak.lessons,
          [lesson.id]: {
            ...current,
            completedAt: Date.now(),
            quizScore: meta?.quizScore ?? current.quizScore,
          },
        },
      },
      true
    );
  }

  const handleAttempt = (lessonId: string) =>
    patchLesson(lessonId, { attempts: stateFor(lessonId).attempts + 1 }, true);

  const handleSaveCode = (lessonId: string, code: string) =>
    patchLesson(lessonId, { savedCode: code });

  const handleUseHint = (lessonId: string, count: number) =>
    patchLesson(lessonId, { hintsUsed: count }, true);

  const handleViewSolution = (lessonId: string) =>
    patchLesson(lessonId, { solutionViewed: true }, true);

  /** Wipes progress locally and, when configured, in Firestore too. */
  function handleReset() {
    persist(emptyProgress(), true);
    setActiveLesson(null);
    setActiveTrack('foundations');
    setView('dashboard');
  }

  function toggleExplore() {
    const next = !explore;
    setExplore(next);
    localStorage.setItem(EXPLORE_KEY, String(next));
  }

  function handleContinue() {
    const target =
      (progress?.lastLessonId && !completedIds.has(progress.lastLessonId)
        ? LESSON_BY_ID.get(progress.lastLessonId)
        : undefined) ?? nextLesson(completedIds, explore) ?? SEED_LESSONS[0];
    if (target) openLesson(target);
  }

  function goToNextLesson() {
    if (!activeLesson) return;
    const inTrack = LESSONS_BY_TRACK[activeLesson.track] ?? [];
    const index = inTrack.findIndex((l) => l.id === activeLesson.id);
    const candidate = inTrack[index + 1];
    if (candidate && isLessonUnlocked(candidate, completedIds, explore)) {
      openLesson(candidate);
      return;
    }
    const anywhere = nextLesson(completedIds, explore);
    if (anywhere) openLesson(anywhere);
    else setView('dashboard');
  }

  // ── Gates ────────────────────────────────────────────────

  if (authState === 'loading') return <Centered>Loading…</Centered>;

  if (authState === 'signedOut') {
    return (
      <Centered>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Code Lab</h1>
        <p style={{ color: T.textDim, fontSize: 14, marginBottom: 20, maxWidth: 420, textAlign: 'center' }}>
          {SEED_LESSONS.length} lessons across {TRACKS.length} tracks, from your first
          line of code to interview preparation.
        </p>
        <button onClick={signIn} style={primaryButton}>
          Sign in with Google
        </button>
      </Centered>
    );
  }

  if (authState === 'denied') {
    return (
      <Centered>
        <p>This account does not have access.</p>
        <button onClick={signOut} style={primaryButton}>
          Sign out
        </button>
      </Centered>
    );
  }

  if (!progress) return <Centered>Loading progress…</Centered>;

  const doneCount = completedIds.size;
  const showSidebar = view === 'lesson' && sidebarOpen;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: T.bg,
        color: T.text,
        fontFamily: T.sans,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          borderBottom: `1px solid ${T.borderSoft}`,
          flexShrink: 0,
        }}
      >
        {view === 'lesson' && (
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            style={iconButton}
            aria-label="Toggle lesson list"
          >
            ☰
          </button>
        )}

        <button
          onClick={() => setView('dashboard')}
          style={{ ...iconButton, border: 'none', fontWeight: 700, fontSize: 15 }}
        >
          Code Lab
        </button>

        <span style={{ fontSize: 12, color: T.textDim }}>
          {doneCount}/{SEED_LESSONS.length}
        </span>
        <span style={{ fontSize: 12, color: T.purple }}>
          Lv {levelFor(progress.xp)} · {progress.xp} XP
        </span>
        {progress.streak.current > 0 && (
          <span style={{ fontSize: 12, color: T.amber }}>
            🔥 {progress.streak.current}
          </span>
        )}

        <div style={{ flex: 1 }} />

        {view === 'lesson' && (
          <button onClick={goToNextLesson} style={iconButton}>
            Next lesson →
          </button>
        )}

        {REMOTE_ENABLED ? (
          <>
            <span style={{ fontSize: 12, color: T.textDim }}>{user?.email}</span>
            <button onClick={signOut} style={iconButton}>
              Sign out
            </button>
          </>
        ) : (
          <span style={{ fontSize: 11.5, color: T.textFaint }} title="Set the Firebase env vars to sync across devices">
            local progress
          </span>
        )}
      </header>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {showSidebar && (
          <aside
            style={{
              width: 280,
              flexShrink: 0,
              borderRight: `1px solid ${T.borderSoft}`,
              padding: 8,
              overflowY: 'auto',
              ...(window.innerWidth < 900
                ? {
                    position: 'absolute' as const,
                    top: 49,
                    left: 0,
                    bottom: 0,
                    zIndex: 10,
                    background: T.bg,
                    boxShadow: '4px 0 12px rgba(0,0,0,0.5)',
                  }
                : {}),
            }}
          >
            <LessonList
              trackId={activeTrack}
              completedIds={completedIds}
              activeLessonId={activeLesson?.id ?? null}
              explore={explore}
              onSelect={openLesson}
              onBack={() => setView('dashboard')}
            />
          </aside>
        )}

        <main style={{ flex: 1, minWidth: 0, padding: 12, minHeight: 0 }}>
          {view === 'dashboard' && (
            <Dashboard
              progress={progress}
              completedIds={completedIds}
              explore={explore}
              onToggleExplore={toggleExplore}
              onOpenTrack={(trackId) => {
                setActiveTrack(trackId);
                const lessons = LESSONS_BY_TRACK[trackId] ?? [];
                const target =
                  lessons.find((l) => !completedIds.has(l.id)) ?? lessons[0];
                if (target) openLesson(target);
              }}
              onContinue={handleContinue}
              onOpenPlayground={() => setView('playground')}
              onReset={handleReset}
            />
          )}

          {view === 'playground' && <Playground onBack={() => setView('dashboard')} />}

          {view === 'lesson' &&
            (activeLesson ? (
              <LessonView
                key={activeLesson.id}
                lesson={activeLesson}
                state={stateFor(activeLesson.id)}
                isCompleted={completedIds.has(activeLesson.id)}
                onComplete={handleComplete}
                onAttempt={handleAttempt}
                onSaveCode={handleSaveCode}
                onUseHint={handleUseHint}
                onViewSolution={handleViewSolution}
              />
            ) : (
              <Centered>Pick a lesson to begin.</Centered>
            ))}
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
        background: T.bg,
        color: T.text,
        fontFamily: T.sans,
        gap: 8,
      }}
    >
      {children}
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: 6,
  border: 'none',
  background: '#238636',
  color: '#fff',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
};

const iconButton: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 6,
  border: `1px solid ${T.border}`,
  background: 'transparent',
  color: T.text,
  fontSize: 13,
  cursor: 'pointer',
};
