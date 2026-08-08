import React from 'react';
import { T } from './theme';

/**
 * A small Markdown renderer.
 *
 * It emits React elements rather than an HTML string, so lesson text can
 * never inject markup into the app — no dangerouslySetInnerHTML anywhere.
 * It covers the subset the curriculum actually uses: headings, fenced code,
 * lists, blockquotes, rules, and inline code/bold/italic/links.
 */

type Inline = React.ReactNode;

const INLINE_PATTERN =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\n]+\*)|(\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyPrefix: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-i${i++}`;

    if (token.startsWith('`')) {
      out.push(
        <code key={key} style={codeStyle}>
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**')) {
      out.push(
        <strong key={key} style={{ color: '#e6edf3' }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*')) {
      out.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      const split = token.indexOf('](');
      const label = token.slice(1, split);
      const href = token.slice(split + 2, -1);
      out.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: T.accent }}
        >
          {label}
        </a>
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

const codeStyle: React.CSSProperties = {
  background: '#0d1117',
  border: `1px solid ${T.borderSoft}`,
  borderRadius: 4,
  padding: '1px 5px',
  fontFamily: T.mono,
  fontSize: '0.9em',
  color: '#e6edf3',
};

export function Markdown({ source }: { source: string }) {
  const lines = source.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code
    if (line.trimStart().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        body.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push(
        <pre key={key++} style={preStyle}>
          {lang && <span style={langTagStyle}>{lang}</span>}
          <code style={{ fontFamily: T.mono }}>{body.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Horizontal rule
    if (/^\s*---+\s*$/.test(line)) {
      blocks.push(
        <hr
          key={key++}
          style={{ border: 0, borderTop: `1px solid ${T.borderSoft}`, margin: '18px 0' }}
        />
      );
      i++;
      continue;
    }

    // Heading
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const depth = heading[1].length;
      const sizes = [20, 17, 15, 14];
      blocks.push(
        <div
          key={key++}
          style={{
            fontSize: sizes[depth - 1],
            fontWeight: 700,
            color: '#e6edf3',
            margin: depth <= 2 ? '20px 0 8px' : '16px 0 6px',
            letterSpacing: depth === 1 ? -0.2 : 0,
          }}
        >
          {renderInline(heading[2], `h${key}`)}
        </div>
      );
      i++;
      continue;
    }

    // Blockquote / callout
    if (line.trimStart().startsWith('>')) {
      const body: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith('>')) {
        body.push(lines[i].trimStart().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote key={key++} style={quoteStyle}>
          {body.map((b, n) => (
            <div key={n}>{renderInline(b, `q${key}-${n}`)}</div>
          ))}
        </blockquote>
      );
      continue;
    }

    // Lists
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ''));
        i++;
      }
      const ListTag = ordered ? 'ol' : 'ul';
      blocks.push(
        <ListTag key={key++} style={{ margin: '8px 0', paddingLeft: 22, lineHeight: 1.65 }}>
          {items.map((item, n) => (
            <li key={n} style={{ marginBottom: 4 }}>
              {renderInline(item, `l${key}-${n}`)}
            </li>
          ))}
        </ListTag>
      );
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph: absorb until a blank line or the start of another block
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trimStart().startsWith('```') &&
      !lines[i].trimStart().startsWith('>') &&
      !/^(#{1,4})\s+/.test(lines[i]) &&
      !/^\s*([-*]|\d+\.)\s+/.test(lines[i]) &&
      !/^\s*---+\s*$/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key++} style={{ margin: '10px 0', lineHeight: 1.7 }}>
        {renderInline(para.join(' '), `p${key}`)}
      </p>
    );
  }

  return <div style={{ fontSize: 14, color: T.text }}>{blocks}</div>;
}

const preStyle: React.CSSProperties = {
  position: 'relative',
  background: '#0d1117',
  border: `1px solid ${T.borderSoft}`,
  borderRadius: 8,
  padding: '12px 14px',
  fontSize: 13,
  lineHeight: 1.6,
  overflowX: 'auto',
  margin: '12px 0',
};

const langTagStyle: React.CSSProperties = {
  position: 'absolute',
  top: 6,
  right: 10,
  fontSize: 10,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  color: T.textFaint,
  fontFamily: T.sans,
};

const quoteStyle: React.CSSProperties = {
  margin: '12px 0',
  padding: '10px 14px',
  borderLeft: `3px solid ${T.accent}`,
  background: T.accentSoft,
  borderRadius: '0 6px 6px 0',
  fontSize: 13.5,
  lineHeight: 1.65,
  color: T.text,
};
