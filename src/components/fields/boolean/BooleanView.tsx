import { Switch } from 'antd';

export default function BooleanView({ value }: { value?: boolean }) {
  return (
    <>
      <Switch defaultChecked={value ? true : false} disabled />
    </>
  );
}
