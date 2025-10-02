import { Input, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import { toSlug } from '../../../helpers/utils';

export default function SlugInput({
  value: defaultValue,
  onChange,
  form,
  triggerField,
}: {
  value?: string;
  onChange?: (value: string) => void;
  form: FormInstance;
  triggerField: string;
}) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const triggerFieldValue: any = form.getFieldInstance(triggerField);
    triggerFieldValue?.nativeElement?.addEventListener('change', (e: any) => {
      const slug = toSlug(e.target.value);
      setValue(slug);
      onChange?.(slug);
    });
  }, [form]);

  return (
    <Input
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onChange?.(e.target.value);
      }}
    />
  );
}
