import { Select } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  type: any;
}

export default function EnumerationInput(props: Props) {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if (props.type.enum) {
      const options = props.type.enum.map((value: any) => ({
        value: value,
        label: value,
      }));
      setOptions(options);
    }
  }, [props.type.enum]);

  const onChange = (value: string) => {
    props.onChange?.(value);
  };

  return <Select onChange={onChange} value={value} options={options} />;
}
