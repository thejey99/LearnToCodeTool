/** Design tokens. Kept in one place so panels stop drifting apart. */
export const T = {
  bg: '#0d1117',
  panel: '#161b22',
  panelAlt: '#11161d',
  border: '#30363d',
  borderSoft: '#21262d',
  text: '#c9d1d9',
  textDim: '#8b949e',
  textFaint: '#6e7681',
  accent: '#1f6feb',
  accentSoft: '#1f6feb22',
  green: '#3fb950',
  greenSoft: '#3fb95022',
  red: '#f85149',
  redSoft: '#f8514922',
  amber: '#d29922',
  amberSoft: '#d2992222',
  purple: '#a371f7',
  mono: "'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, monospace",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
} as const;

export const DIFFICULTY_LABEL: Record<number, string> = {
  1: 'Intro',
  2: 'Easy',
  3: 'Medium',
  4: 'Hard',
  5: 'Challenge',
};

export const DIFFICULTY_COLOR: Record<number, string> = {
  1: T.textDim,
  2: T.green,
  3: T.accent,
  4: T.amber,
  5: T.red,
};

export const LANG_BADGE: Record<string, { label: string; color: string }> = {
  javascript: { label: 'JS', color: '#f1e05a' },
  typescript: { label: 'TS', color: '#3178c6' },
  python: { label: 'PY', color: '#3572A5' },
  sql: { label: 'SQL', color: '#e38c00' },
};

export const LANG_LABEL: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  sql: 'SQL',
};
