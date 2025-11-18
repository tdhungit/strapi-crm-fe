import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css';
import Editor from 'react-simple-code-editor';

export default function SqlInput({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const highlight = (code: string) =>
    Prism.highlight(code, Prism.languages.sql, 'sql');

  return (
    <Editor
      value={value || ''}
      onValueChange={(value) => onChange?.(value)}
      highlight={highlight}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 14,
        border: '1px solid #ddd',
        borderRadius: 4,
        minHeight: 100,
        backgroundColor: '#fcfcfc',
      }}
    />
  );
}
