import { DatePicker, Form, Input, InputNumber } from 'antd';

export default function FormInput({ item }: { item: any }) {
  const label = item.label || item.name;
  const placeholder = item.placeholder || `Enter ${item.label || item.name}`;
  const rules = item.required
    ? [{ required: true, message: `${item.label || item.name} is required` }]
    : [];

  let input = <Input placeholder={placeholder} size='large' />;

  switch (item.type) {
    case 'date':
      input = <DatePicker />;
      break;
    case 'number':
      input = <InputNumber />;
      break;
    case 'string':
    default:
      break;
  }

  return (
    <Form.Item name={item.name} label={label} rules={rules}>
      {input}
    </Form.Item>
  );
}
