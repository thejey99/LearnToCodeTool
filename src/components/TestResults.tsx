import type { TestResult } from '../types';
import { T } from '../lib/theme';

interface TestResultsProps {
  results: TestResult[];
  /** A thrown error before any test ran — usually a syntax or reference error. */
  error: string | null;
}

/**
 * The graded panel for 'tests' lessons. Failures show the assertion message,
 * because "Expected 6 but got 5" teaches something and "failed" does not.
 */
export default function TestResults({ results, error }: TestResultsProps) {
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const allPassed = total > 0 && passed === total;

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: T.panel,
        borderRadius: 8,
        border: `1px solid ${allPassed ? T.green : total > 0 || error ? T.red : T.border}`,
        padding: 12,
        boxSizing: 'border-box',
      }}
    >
      {error && (
        <div
          style={{
            background: T.redSoft,
            border: `1px solid ${T.red}`,
            borderRadius: 6,
            padding: 10,
            marginBottom: 10,
            fontFamily: T.mono,
            fontSize: 12.5,
            color: '#ffa198',
            whiteSpace: 'pre-wrap',
          }}
        >
          {error}
        </div>
      )}

      {total === 0 && !error && (
        <div style={{ color: T.textDim, fontSize: 13 }}>
          No tests ran yet. Press Run to check your work.
        </div>
      )}

      {total > 0 && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              fontSize: 13,
              fontWeight: 600,
              color: allPassed ? T.green : T.red,
            }}
          >
            <span>{allPassed ? '✔' : '✘'}</span>
            <span>
              {passed} of {total} tests passing
            </span>
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
                  width: `${(passed / total) * 100}%`,
                  height: '100%',
                  background: allPassed ? T.green : T.accent,
                  transition: 'width 200ms',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {results.map((result, i) => (
              <div
                key={i}
                style={{
                  padding: '7px 10px',
                  borderRadius: 6,
                  background: result.passed ? 'transparent' : T.redSoft,
                  border: `1px solid ${result.passed ? T.borderSoft : T.red + '55'}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    fontSize: 13,
                    color: result.passed ? T.textDim : '#e6edf3',
                  }}
                >
                  <span style={{ color: result.passed ? T.green : T.red }}>
                    {result.passed ? '✔' : '✘'}
                  </span>
                  <span>{result.name}</span>
                </div>
                {!result.passed && result.message && (
                  <div
                    style={{
                      marginTop: 5,
                      marginLeft: 20,
                      fontFamily: T.mono,
                      fontSize: 12,
                      color: '#ffa198',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {result.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
