import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

export interface TerminalHandle {
  writeLine: (text: string) => void;
  writeError: (text: string) => void;
  writeSuccess: (text: string) => void;
  writeInfo: (text: string) => void;
  clear: () => void;
}

const Terminal = forwardRef<TerminalHandle>(function Terminal(_props, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new XTerm({
      convertEol: true,
      cursorBlink: false,
      disableStdin: true,
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
      theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#0d1117',
      },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    fit.fit();
    term.writeln('\x1b[90m— output will appear here —\x1b[0m');

    termRef.current = term;
    fitRef.current = fit;

    const onResize = () => fit.fit();
    window.addEventListener('resize', onResize);
    const observer = new ResizeObserver(() => fit.fit());
    observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      term.dispose();
      termRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    writeLine: (t) => termRef.current?.writeln(t),
    writeError: (t) => termRef.current?.writeln('\x1b[31m' + t + '\x1b[0m'),
    writeSuccess: (t) => termRef.current?.writeln('\x1b[32m' + t + '\x1b[0m'),
    writeInfo: (t) => termRef.current?.writeln('\x1b[90m' + t + '\x1b[0m'),
    clear: () => termRef.current?.clear(),
  }));

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        width: '100%',
        background: '#0d1117',
        borderRadius: 8,
        padding: 8,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    />
  );
});

export default Terminal;
