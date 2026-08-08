import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { keymap } from '@codemirror/view';
import { Prec, type Extension } from '@codemirror/state';
import type { Language } from '../types';

interface EditorProps {
  language: Language;
  value: string;
  onChange: (code: string) => void;
  /** Cmd/Ctrl+Enter, the shortcut every real editor binds to "run". */
  onRun?: () => void;
}

function languageExtension(language: Language) {
  switch (language) {
    case 'python':
      return python();
    case 'sql':
      return sql();
    case 'typescript':
      return javascript({ typescript: true });
    case 'javascript':
    default:
      return javascript();
  }
}

export default function Editor({ language, value, onChange, onRun }: EditorProps) {
  const extensions: Extension[] = [languageExtension(language)];

  if (onRun) {
    // High precedence so it wins over CodeMirror's own Enter handling.
    extensions.push(
      Prec.highest(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              onRun();
              return true;
            },
          },
        ])
      )
    );
  }

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      theme="dark"
      height="100%"
      style={{ height: '100%', fontSize: 14 }}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: true,
        autocompletion: true,
        bracketMatching: true,
        closeBrackets: true,
        indentOnInput: true,
      }}
    />
  );
}
