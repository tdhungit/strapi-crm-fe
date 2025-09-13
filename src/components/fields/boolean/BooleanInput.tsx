import { Switch } from 'antd';
import { useState } from 'react';

export default function BooleanInput({
  value: defaultValue,
  onChange,
}: {
  value?: boolean;
  onChange?: (value: boolean) => void;
}) {
  const [value, setValue] = useState(defaultValue ? true : false);

  const handleChange = (checked: boolean) => {
    setValue(checked);
    onChange?.(checked);
  };

  return (
    <Switch defaultChecked={value ? true : false} onChange={handleChange} />
  );
}
