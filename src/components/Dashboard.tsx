import type { TrackId, UserProgress } from '../types';
import { TRACKS } from '../lessons/tracks';
import {
  LESSONS_BY_TRACK,
  TOTAL_MINUTES,
  SEED_LESSONS,
  isTrackUnlocked,
  trackCompletion,
  TRACK_UNLOCK_RATIO,
} from '../lessons/seed';
import { levelFor, xpForLevel } from '../store/progress';
import { T } from '../lib/theme';

interface DashboardProps {
  progress: UserProgress;
  completedIds: Set<string>;
  explore: boolean;
  onToggleExplore: () => void;
  onOpenTrack: (trackId: TrackId) => void;
  onContinue: () => void;
  onOpenPlayground: () => void;
}

export default function Dashboard({
  progress,
  completedIds,
  explore,
  onToggleExplore,
  onOpenTrack,
  onContinue,
  onOpenPlayground,
}: DashboardProps) {
  const level = levelFor(progress.xp);
  const levelFloor = xpForLevel(level);
  const levelCeiling = xpForLevel(level + 1);
  const levelProgress =
    levelCeiling > levelFloor
      ? (progress.xp - levelFloor) / (levelCeiling - levelFloor)
      : 0;

  const done = completedIds.size;
  const total = SEED_LESSONS.length;

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '4px 4px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 10,
            marginBottom: 18,
          }}
        >
          <Stat label="Lessons complete" value={`${done} / ${total}`} />
          <Stat label="XP" value={String(progress.xp)} sub={`Level ${level}`} />
          <Stat
            label="Day streak"
            value={String(progress.streak.current)}
            sub={`best ${progress.streak.longest}`}
          />
          <Stat
            label="Curriculum length"
            value={`~${Math.round(TOTAL_MINUTES / 60)}h`}
            sub={`${TRACKS.length} tracks`}
          />
        </div>

        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: T.borderSoft,
            overflow: 'hidden',
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: `${Math.round(levelProgress * 100)}%`,
              height: '100%',
              background: T.purple,
            }}
          />
        </div>
        <div style={{ fontSize: 11.5, color: T.textFaint, marginBottom: 20 }}>
          {progress.xp - levelFloor} / {levelCeiling - levelFloor} XP to level {level + 1}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 26 }}>
          <button onClick={onContinue} style={primaryButton}>
            {done === 0 ? 'Start learning' : 'Continue where I left off'}
          </button>
          <button onClick={onOpenPlayground} style={ghostButton}>
            🧪 Playground
          </button>
          <button
            onClick={onToggleExplore}
            style={{
              ...ghostButton,
              borderColor: explore ? T.accent : T.border,
              color: explore ? T.accent : T.text,
            }}
            title="Ignore the lesson order and open anything"
          >
            {explore ? '🔓 Explore mode on' : '🔒 Guided order'}
          </button>
        </div>

        {/* Tracks */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: 12,
          }}
        >
          {TRACKS.map((track) => {
            const lessons = LESSONS_BY_TRACK[track.id] ?? [];
            const completion = trackCompletion(track.id, completedIds);
            const unlocked = explore || isTrackUnlocked(track.id, completedIds);
            const doneHere = lessons.filter((l) => completedIds.has(l.id)).length;

            return (
              <button
                key={track.id}
                onClick={() => unlocked && onOpenTrack(track.id)}
                disabled={!unlocked}
                style={{
                  textAlign: 'left',
                  background: T.panel,
                  border: `1px solid ${completion === 1 ? T.green : T.borderSoft}`,
                  borderRadius: 10,
                  padding: 16,
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  opacity: unlocked ? 1 : 0.5,
                  color: T.text,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 19 }}>{track.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#e6edf3', flex: 1 }}>
                    {track.title}
                  </span>
                  {completion === 1 && <span style={{ color: T.green }}>✔</span>}
                </div>

                <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.5 }}>
                  {track.blurb}
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 10.5 }}>
                  <span style={{ ...pill, borderColor: track.color + '55', color: track.color }}>
                    {track.level}
                  </span>
                  <span style={pill}>{lessons.length} lessons</span>
                  <span style={pill}>
                    ~{Math.round(lessons.reduce((s, l) => s + l.minutes, 0) / 60)}h
                  </span>
                </div>

                <div
                  style={{
                    height: 3,
                    borderRadius: 2,
                    background: T.borderSoft,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${completion * 100}%`,
                      height: '100%',
                      background: track.color,
                    }}
                  />
                </div>

                <div style={{ fontSize: 11, color: T.textFaint }}>
                  {unlocked
                    ? `${doneHere}/${lessons.length} complete`
                    : `Unlocks at ${Math.round(TRACK_UNLOCK_RATIO * 100)}% of ${track
                        .requires!.map((r) => TRACKS.find((t) => t.id === r)?.title)
                        .join(', ')}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div
      style={{
        background: T.panel,
        border: `1px solid ${T.borderSoft}`,
        borderRadius: 8,
        padding: '12px 14px',
      }}
    >
      <div style={{ fontSize: 10.5, color: T.textFaint, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#e6edf3', marginTop: 3 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: T.textDim }}>{sub}</div>}
    </div>
  );
}

const pill: React.CSSProperties = {
  border: `1px solid ${T.border}`,
  borderRadius: 4,
  padding: '1px 6px',
  color: T.textDim,
};

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

const ghostButton: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 6,
  border: `1px solid ${T.border}`,
  background: 'transparent',
  color: T.text,
  fontSize: 13.5,
  cursor: 'pointer',
};
