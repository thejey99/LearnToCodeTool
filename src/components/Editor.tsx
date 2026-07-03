import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import type { Language } from '../types';

interface EditorProps {
  language: Language;
  value: string;
  onChange: (code: string) => void;
}

function extensionsFor(language: Language) {
  switch (language) {
    case 'python':
      return [python()];
    case 'typescript':
      return [javascript({ typescript: true })];
    case 'javascript':
    default:
      return [javascript()];
  }
}

export default function Editor({ language, value, onChange }: EditorProps) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensionsFor(language)}
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
