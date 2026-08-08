import { useState } from 'react';
import { Markdown } from '../lib/markdown';
import { T } from '../lib/theme';

interface HintsProps {
  hints: string[];
  solution?: string;
  language: string;
  attempts: number;
  hintsUsed: number;
  solutionViewed: boolean;
  onUseHint: (count: number) => void;
  onViewSolution: () => void;
}

/** The solution stays shut until there has been real effort behind it. */
const ATTEMPTS_BEFORE_SOLUTION = 3;

export default function Hints({
  hints,
  solution,
  language,
  attempts,
  hintsUsed,
  solutionViewed,
  onUseHint,
  onViewSolution,
}: HintsProps) {
  const [revealed, setRevealed] = useState(hintsUsed);
  const [showSolution, setShowSolution] = useState(solutionViewed);

  const hasMoreHints = revealed < hints.length;
  const allHintsUsed = revealed >= hints.length;
  const solutionUnlocked =
    showSolution || (allHintsUsed && attempts >= ATTEMPTS_BEFORE_SOLUTION);

  function revealNext() {
    const next = revealed + 1;
    setRevealed(next);
    onUseHint(next);
  }

  function reveal() {
    setShowSolution(true);
    onViewSolution();
  }

  if (hints.length === 0 && !solution) return null;

  return (
    <div style={{ marginTop: 20, borderTop: `1px solid ${T.borderSoft}`, paddingTop: 16 }}>
      {revealed > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {hints.slice(0, revealed).map((hint, i) => (
            <div
              key={i}
              style={{
                background: T.amberSoft,
                borderLeft: `3px solid ${T.amber}`,
                borderRadius: '0 6px 6px 0',
                padding: '8px 12px',
                fontSize: 13,
              }}
            >
              <div style={{ fontSize: 11, color: T.amber, fontWeight: 700, marginBottom: 2 }}>
                HINT {i + 1}
              </div>
              <Markdown source={hint} />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {hasMoreHints && (
          <button onClick={revealNext} style={ghostButton}>
            💡 {revealed === 0 ? 'Give me a hint' : `Next hint (${revealed}/${hints.length})`}
          </button>
        )}

        {solution && !showSolution && (
          <button
            onClick={solutionUnlocked ? reveal : undefined}
            disabled={!solutionUnlocked}
            title={
              solutionUnlocked
                ? 'Show a worked solution'
                : `Use every hint and make ${ATTEMPTS_BEFORE_SOLUTION} attempts first — struggling is where the learning happens`
            }
            style={{
              ...ghostButton,
              opacity: solutionUnlocked ? 1 : 0.45,
              cursor: solutionUnlocked ? 'pointer' : 'not-allowed',
            }}
          >
            {solutionUnlocked
              ? '📖 Show solution'
              : `🔒 Solution (${Math.min(attempts, ATTEMPTS_BEFORE_SOLUTION)}/${ATTEMPTS_BEFORE_SOLUTION} attempts)`}
          </button>
        )}
      </div>

      {showSolution && solution && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, color: T.textDim, fontWeight: 700, marginBottom: 4 }}>
            ONE WORKING SOLUTION
          </div>
          <div style={{ fontSize: 12.5, color: T.textFaint, marginBottom: 8 }}>
            Read it, close it, then write it yourself from memory. Copying it in does not
            transfer.
          </div>
          <Markdown source={'```' + language + '\n' + solution + '\n```'} />
        </div>
      )}
    </div>
  );
}

const ghostButton: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: 6,
  border: `1px solid ${T.border}`,
  background: 'transparent',
  color: T.text,
  fontSize: 13,
  cursor: 'pointer',
};
