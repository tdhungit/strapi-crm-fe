import { Input } from 'antd';

export default function PasswordInput({
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  return <Input.Password onChange={(e) => onChange?.(e.target.value)} />;
}
