import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Props {
  value?: any;
  onChange?: any;
}

export default function RichtextInput(props: Props) {
  const [value, setValue] = useState(props.value);

  const onChange = (value: string) => {
    setValue(value);
    props.onChange(value);
  };

  return <ReactQuill theme='snow' value={value} onChange={onChange} />;
}
