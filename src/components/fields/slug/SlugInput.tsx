import { Input, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';

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
    const triggerFieldValue: any = form.getFieldInstance(triggerField);
    triggerFieldValue?.nativeElement?.addEventListener('change', (e: any) => {
      const slug = e.target.value.replace(/[^a-z0-9]/gi, '-').toLowerCase();
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
