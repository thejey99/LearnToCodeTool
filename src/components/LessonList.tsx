import type { Lesson } from '../types';

interface LessonListProps {
  lessons: Lesson[];
  completedIds: string[];
  activeLessonId: string | null;
  onSelect: (lesson: Lesson) => void;
}

const LANG_BADGE: Record<string, { label: string; color: string }> = {
  javascript: { label: 'JS', color: '#f1e05a' },
  typescript: { label: 'TS', color: '#3178c6' },
  python: { label: 'PY', color: '#3572A5' },
};

export default function LessonList({
  lessons,
  completedIds,
  activeLessonId,
  onSelect,
}: LessonListProps) {
  const sorted = [...lessons].sort((a, b) => a.order - b.order);

  // Sequential unlock: a lesson is unlocked if it's first or the previous is done
  function isUnlocked(index: number): boolean {
    if (index === 0) return true;
    return completedIds.includes(sorted[index - 1].id);
  }

  return (
    <nav
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        overflowY: 'auto',
      }}
    >
      {sorted.map((lesson, i) => {
        const unlocked = isUnlocked(i);
        const done = completedIds.includes(lesson.id);
        const active = lesson.id === activeLessonId;
        const badge = LANG_BADGE[lesson.language];

        return (
          <button
            key={lesson.id}
            onClick={() => unlocked && onSelect(lesson)}
            disabled={!unlocked}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              borderRadius: 6,
              border: 'none',
              textAlign: 'left',
              fontSize: 13,
              cursor: unlocked ? 'pointer' : 'not-allowed',
              background: active ? '#1f6feb33' : 'transparent',
              color: unlocked ? '#c9d1d9' : '#484f58',
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 5px',
                borderRadius: 4,
                background: unlocked ? badge.color + '22' : '#21262d',
                color: unlocked ? badge.color : '#484f58',
                minWidth: 22,
                textAlign: 'center',
              }}
            >
              {badge.label}
            </span>
            <span style={{ flex: 1 }}>
              {i + 1}. {lesson.title}
            </span>
            <span style={{ fontSize: 12 }}>
              {done ? '✔' : unlocked ? '' : '🔒'}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
