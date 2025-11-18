import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function SqlView({ sql }: { sql: string }) {
  return (
    <SyntaxHighlighter language='sql' style={docco}>
      {sql}
    </SyntaxHighlighter>
  );
}
