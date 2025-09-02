interface Props {
  value: string;
}

export default function RichTextView(props: Props) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: props.value }}
      style={{ whiteSpace: 'pre-wrap' }}
    />
  );
}
