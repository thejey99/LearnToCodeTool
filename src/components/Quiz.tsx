import { useState } from 'react';
import type { QuizQuestion } from '../types';
import { Markdown } from '../lib/markdown';
import { T } from '../lib/theme';

interface QuizProps {
  questions: QuizQuestion[];
  /** Called with the fraction correct once every question has been answered. */
  onFinish: (score: number) => void;
}

const PASS_MARK = 0.7;

export default function Quiz({ questions, onFinish }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter(
    (q) => answers[q.id] === q.answerIndex
  ).length;
  const allAnswered = answeredCount === questions.length;
  const score = questions.length ? correctCount / questions.length : 0;

  function choose(question: QuizQuestion, index: number) {
    if (answers[question.id] !== undefined) return; // one shot per question
    setAnswers((prev) => ({ ...prev, [question.id]: index }));
  }

  function finish() {
    setFinished(true);
    onFinish(score);
  }

  function retry() {
    setAnswers({});
    setFinished(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: T.textDim }}>
        {answeredCount} of {questions.length} answered
        {answeredCount > 0 && ` · ${correctCount} correct`}
      </div>

      {questions.map((question, qi) => {
        const chosen = answers[question.id];
        const answered = chosen !== undefined;

        return (
          <div
            key={question.id}
            style={{
              background: T.panel,
              border: `1px solid ${T.borderSoft}`,
              borderRadius: 8,
              padding: 14,
            }}
          >
            <div style={{ fontSize: 11, color: T.textFaint, marginBottom: 6 }}>
              QUESTION {qi + 1}
            </div>
            <div style={{ marginBottom: 10 }}>
              <Markdown source={question.prompt} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {question.choices.map((choice, ci) => {
                const isCorrect = ci === question.answerIndex;
                const isChosen = ci === chosen;

                let background: string = 'transparent';
                let border: string = T.border;
                if (answered && isCorrect) {
                  background = T.greenSoft;
                  border = T.green;
                } else if (answered && isChosen) {
                  background = T.redSoft;
                  border = T.red;
                }

                return (
                  <button
                    key={ci}
                    onClick={() => choose(question, ci)}
                    disabled={answered}
                    style={{
                      textAlign: 'left',
                      padding: '9px 12px',
                      borderRadius: 6,
                      border: `1px solid ${border}`,
                      background,
                      color: T.text,
                      fontSize: 13.5,
                      cursor: answered ? 'default' : 'pointer',
                      display: 'flex',
                      gap: 8,
                    }}
                  >
                    <span style={{ color: T.textFaint, minWidth: 14 }}>
                      {answered && isCorrect ? '✔' : answered && isChosen ? '✘' : String.fromCharCode(65 + ci)}
                    </span>
                    <span>{choice}</span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div
                style={{
                  marginTop: 10,
                  padding: '9px 12px',
                  borderRadius: 6,
                  background: T.panelAlt,
                  borderLeft: `3px solid ${chosen === question.answerIndex ? T.green : T.amber}`,
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: T.text,
                }}
              >
                {question.explanation}
              </div>
            )}
          </div>
        );
      })}

      {allAnswered && !finished && (
        <button onClick={finish} style={primaryButton}>
          Finish — {correctCount}/{questions.length} correct
        </button>
      )}

      {finished && (
        <div
          style={{
            padding: 14,
            borderRadius: 8,
            background: score >= PASS_MARK ? T.greenSoft : T.amberSoft,
            border: `1px solid ${score >= PASS_MARK ? T.green : T.amber}`,
            fontSize: 14,
          }}
        >
          {score >= PASS_MARK ? (
            <>
              <strong>{Math.round(score * 100)}% — checkpoint complete.</strong>
              <div style={{ marginTop: 4, color: T.textDim, fontSize: 13 }}>
                Re-read any explanation you got wrong; those are the ones that will come up.
              </div>
            </>
          ) : (
            <>
              <strong>{Math.round(score * 100)}% — worth another pass.</strong>
              <div style={{ marginTop: 4, color: T.textDim, fontSize: 13 }}>
                The checkpoint is marked complete either way, but read the explanations
                again before moving on.
              </div>
            </>
          )}
          <button onClick={retry} style={{ ...ghostButton, marginTop: 10 }}>
            Try again
          </button>
        </div>
      )}
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

const ghostButton: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: 6,
  border: `1px solid ${T.border}`,
  background: 'transparent',
  color: T.text,
  fontSize: 13,
  cursor: 'pointer',
};
