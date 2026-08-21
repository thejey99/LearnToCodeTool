import { useMemo, useRef, useState } from 'react';
import { Markdown } from '../lib/markdown';
import { T, LANG_LABEL } from '../lib/theme';
import { shuffledChoices } from '../review/bank';
import { matchesExpected } from '../review/scheduler';
import { LESSON_BY_ID } from '../lessons/seed';
import { TRACK_BY_ID } from '../lessons/tracks';
import type { ReviewItem } from '../types';

interface ReviewProps {
  items: ReviewItem[];
  onAnswer: (item: ReviewItem, wasCorrect: boolean) => void;
  onFinish: () => void;
  onOpenLesson: (lessonId: string) => void;
}

interface Outcome {
  item: ReviewItem;
  correct: boolean;
}

/**
 * One review session.
 *
 * The rule throughout: you commit to an answer before you see whether it was
 * right. Every affordance that would let you peek — revealing the answer,
 * skipping ahead, going back to change one — is deliberately absent, because
 * the moment of effortful retrieval is the entire mechanism.
 */
export default function Review({ items, onAnswer, onFinish, onOpenLesson }: ReviewProps) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [answered, setAnswered] = useState<null | { correct: boolean; chosen?: number }>(null);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const item = items[index];
  const finished = index >= items.length;

  // Fixed per item, so the choices do not reshuffle underneath a click.
  const shuffled = useMemo(
    () => (item && item.kind === 'mcq' ? shuffledChoices(item, index * 2654435761 + 1) : null),
    [item, index]
  );

  if (items.length === 0) {
    return (
      <Centered>
        <h2 style={{ margin: 0, fontSize: 20 }}>Nothing to review yet</h2>
        <p style={{ color: T.textDim, fontSize: 14, maxWidth: 420, textAlign: 'center' }}>
          Review draws only on lessons you have finished, so it fills up as you go.
          Complete a lesson or two and come back.
        </p>
        <button onClick={onFinish} style={primaryButton}>
          Back to tracks
        </button>
      </Centered>
    );
  }

  if (finished) {
    const right = outcomes.filter((o) => o.correct).length;
    const missed = outcomes.filter((o) => !o.correct);

    return (
      <div style={{ height: '100%', overflowY: 'auto', padding: '4px 4px 40px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, marginBottom: 4 }}>
            {right} of {outcomes.length} correct
          </h2>
          <p style={{ color: T.textDim, fontSize: 13.5, marginTop: 0 }}>
            {missed.length === 0
              ? 'All of these move further out in the schedule. The next review will be a while away.'
              : 'What you got right moves further out. What you missed comes straight back — that is the point, not a penalty.'}
          </p>

          {missed.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={sectionLabel}>COMING BACK NEXT SESSION</div>
              {missed.map((outcome) => {
                const lesson = LESSON_BY_ID.get(outcome.item.lessonId);
                return (
                  <button
                    key={outcome.item.id}
                    onClick={() => onOpenLesson(outcome.item.lessonId)}
                    style={missedRowStyle}
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>
                      {outcome.item.kind === 'predict'
                        ? 'Predict the output'
                        : outcome.item.prompt.slice(0, 80)}
                    </span>
                    <span style={{ color: T.textFaint, fontSize: 11.5 }}>
                      {lesson ? `revisit ${lesson.title} →` : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <button onClick={onFinish} style={{ ...primaryButton, marginTop: 24 }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  const lesson = LESSON_BY_ID.get(item.lessonId);
  const track = lesson ? TRACK_BY_ID[lesson.track] : null;

  function submit(wasCorrect: boolean, chosen?: number) {
    if (answered) return;
    setAnswered({ correct: wasCorrect, chosen });
    setOutcomes((prev) => [...prev, { item, correct: wasCorrect }]);
    onAnswer(item, wasCorrect);
  }

  function next() {
    setAnswered(null);
    setTyped('');
    setIndex((i) => i + 1);
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '4px 4px 40px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Progress through the session */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: T.borderSoft,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(index / items.length) * 100}%`,
                height: '100%',
                background: T.purple,
                transition: 'width 200ms',
              }}
            />
          </div>
          <span style={{ fontSize: 11.5, color: T.textFaint, whiteSpace: 'nowrap' }}>
            {index + 1} / {items.length}
          </span>
        </div>

        {track && (
          <div style={{ fontSize: 11.5, color: T.textDim, marginBottom: 10 }}>
            <span style={{ color: track.color }}>
              {track.icon} {track.title}
            </span>
            {lesson && <span> · {lesson.title}</span>}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <Markdown source={item.prompt} />
        </div>

        {item.kind === 'predict' && (
          <>
            <div style={{ fontSize: 11, color: T.textFaint, marginBottom: 4 }}>
              {LANG_LABEL[item.language ?? 'javascript']}
            </div>
            <Markdown source={'```' + (item.language ?? 'javascript') + '\n' + item.code + '\n```'} />

            <textarea
              ref={inputRef}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !answered) {
                  e.preventDefault();
                  submit(matchesExpected(typed, item.expected ?? []));
                }
              }}
              disabled={!!answered}
              placeholder={'One line per line of output…'}
              rows={Math.max(3, (item.expected?.length ?? 1) + 1)}
              spellCheck={false}
              style={{
                width: '100%',
                marginTop: 10,
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${
                  answered ? (answered.correct ? T.green : T.red) : T.border
                }`,
                background: T.bg,
                color: T.text,
                fontFamily: T.mono,
                fontSize: 13.5,
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            {!answered && (
              <button
                onClick={() => submit(matchesExpected(typed, item.expected ?? []))}
                style={{ ...primaryButton, marginTop: 10 }}
              >
                Check answer
              </button>
            )}
          </>
        )}

        {item.kind === 'mcq' && shuffled && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {shuffled.choices.map((choice, ci) => {
              const isAnswer = ci === shuffled.answerIndex;
              const isChosen = answered?.chosen === ci;

              let background: string = 'transparent';
              let border: string = T.border;
              if (answered && isAnswer) {
                background = T.greenSoft;
                border = T.green;
              } else if (answered && isChosen) {
                background = T.redSoft;
                border = T.red;
              }

              return (
                <button
                  key={ci}
                  onClick={() => submit(isAnswer, ci)}
                  disabled={!!answered}
                  style={{
                    textAlign: 'left',
                    padding: '10px 13px',
                    borderRadius: 6,
                    border: `1px solid ${border}`,
                    background,
                    color: T.text,
                    fontSize: 14,
                    cursor: answered ? 'default' : 'pointer',
                    display: 'flex',
                    gap: 9,
                  }}
                >
                  <span style={{ color: T.textFaint, minWidth: 14 }}>
                    {answered && isAnswer ? '✔' : answered && isChosen ? '✘' : String.fromCharCode(65 + ci)}
                  </span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>
        )}

        {answered && (
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: answered.correct ? T.green : T.amber,
                marginBottom: 8,
              }}
            >
              {answered.correct
                ? '✔ Correct — the gap before you see this again just got longer'
                : '✘ Not quite — this one comes back in your next session'}
            </div>

            {item.kind === 'predict' && !answered.correct && (
              <div style={{ marginBottom: 10 }}>
                <div style={sectionLabel}>EXPECTED</div>
                <pre style={outputStyle}>{(item.expected ?? []).join('\n')}</pre>
              </div>
            )}

            <div
              style={{
                padding: '11px 14px',
                borderRadius: 8,
                background: T.panelAlt,
                borderLeft: `3px solid ${answered.correct ? T.green : T.amber}`,
                fontSize: 13.5,
                lineHeight: 1.65,
              }}
            >
              {item.explanation}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <button onClick={next} style={primaryButton} autoFocus>
                {index + 1 === items.length ? 'See results' : 'Next'}
              </button>
              {lesson && (
                <button onClick={() => onOpenLesson(lesson.id)} style={ghostButton}>
                  Reread {lesson.title}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      {children}
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 0.6,
  color: T.textFaint,
  marginBottom: 5,
};

const outputStyle: React.CSSProperties = {
  background: T.bg,
  border: `1px solid ${T.borderSoft}`,
  borderRadius: 6,
  padding: 10,
  fontFamily: T.mono,
  fontSize: 13,
  margin: 0,
  overflowX: 'auto',
};

const missedRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  textAlign: 'left',
  padding: '9px 12px',
  marginBottom: 6,
  borderRadius: 6,
  border: `1px solid ${T.borderSoft}`,
  background: T.panel,
  color: T.text,
  fontSize: 13,
  cursor: 'pointer',
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
