import { useMemo, useState } from 'react';
import type { Lesson, TrackId } from '../types';
import {
  LESSONS_BY_TRACK,
  modulesOf,
  isLessonUnlocked,
  searchLessons,
} from '../lessons/seed';
import { TRACK_BY_ID } from '../lessons/tracks';
import { T, LANG_BADGE } from '../lib/theme';

interface LessonListProps {
  trackId: TrackId;
  completedIds: Set<string>;
  activeLessonId: string | null;
  explore: boolean;
  onSelect: (lesson: Lesson) => void;
  onBack: () => void;
}

const KIND_ICON: Record<string, string> = {
  tests: '🧪',
  web: '🖥️',
  react: '⚛️',
  sql: '🗄️',
  quiz: '❓',
  reading: '📖',
  console: '›',
};

export default function LessonList({
  trackId,
  completedIds,
  activeLessonId,
  explore,
  onSelect,
  onBack,
}: LessonListProps) {
  const [query, setQuery] = useState('');
  const track = TRACK_BY_ID[trackId];
  const lessons = LESSONS_BY_TRACK[trackId] ?? [];
  const modules = useMemo(() => modulesOf(trackId), [trackId]);

  const results = query.trim() ? searchLessons(query) : null;
  const doneCount = lessons.filter((l) => completedIds.has(l.id)).length;

  function renderRow(lesson: Lesson, label: string) {
    const unlocked = isLessonUnlocked(lesson, completedIds, explore);
    const done = completedIds.has(lesson.id);
    const active = lesson.id === activeLessonId;
    const badge = LANG_BADGE[lesson.language] ?? LANG_BADGE.javascript;

    return (
      <button
        key={lesson.id}
        onClick={() => unlocked && onSelect(lesson)}
        disabled={!unlocked}
        title={unlocked ? lesson.title : 'Finish the previous lesson first'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '8px 10px',
          borderRadius: 6,
          border: 'none',
          textAlign: 'left',
          fontSize: 12.5,
          cursor: unlocked ? 'pointer' : 'not-allowed',
          background: active ? T.accentSoft : 'transparent',
          color: unlocked ? (done ? T.textDim : T.text) : '#484f58',
          borderLeft: active ? `2px solid ${T.accent}` : '2px solid transparent',
        }}
      >
        <span
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            padding: '2px 4px',
            borderRadius: 3,
            background: unlocked ? badge.color + '22' : T.borderSoft,
            color: unlocked ? badge.color : '#484f58',
            minWidth: 22,
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          {badge.label}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
        <span style={{ fontSize: 11, flexShrink: 0, opacity: 0.75 }}>
          {done ? '✔' : unlocked ? KIND_ICON[lesson.kind] ?? '' : '🔒'}
        </span>
      </button>
    );
  }

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      <button onClick={onBack} style={backButtonStyle}>
        ← All tracks
      </button>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search all lessons…"
        style={{
          margin: '8px 6px 10px',
          padding: '7px 10px',
          borderRadius: 6,
          border: `1px solid ${T.border}`,
          background: T.bg,
          color: T.text,
          fontSize: 12.5,
          outline: 'none',
        }}
      />

      {results ? (
        <div style={{ padding: '0 4px' }}>
          <div style={sectionLabel}>
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </div>
          {results.map((lesson) =>
            renderRow(lesson, `${TRACK_BY_ID[lesson.track].title} · ${lesson.title}`)
          )}
        </div>
      ) : (
        <div style={{ padding: '0 4px' }}>
          <div style={{ padding: '0 6px 10px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: track.color }}>
              {track.icon} {track.title}
            </div>
            <div style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>
              {doneCount}/{lessons.length} complete
            </div>
            <div
              style={{
                marginTop: 6,
                height: 3,
                borderRadius: 2,
                background: T.borderSoft,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${lessons.length ? (doneCount / lessons.length) * 100 : 0}%`,
                  height: '100%',
                  background: track.color,
                }}
              />
            </div>
          </div>

          {modules.map((module) => (
            <div key={module.name} style={{ marginBottom: 8 }}>
              <div style={sectionLabel}>{module.name}</div>
              {module.lessons.map((lesson) =>
                renderRow(lesson, `${lessons.indexOf(lesson) + 1}. ${lesson.title}`)
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

const sectionLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 0.6,
  textTransform: 'uppercase',
  color: T.textFaint,
  padding: '8px 10px 4px',
};

const backButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: T.textDim,
  fontSize: 12.5,
  textAlign: 'left',
  padding: '6px 10px',
  cursor: 'pointer',
};
