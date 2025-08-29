import { DatePicker, Form, Input, InputNumber, type FormInstance } from 'antd';
import RelationInput from './relation/RelationInput';

export default function FormInput({
  item,
  form,
  data,
}: {
  item: any;
  form: FormInstance;
  data: any;
}) {
  const label = item.label || item.name;
  const placeholder = item.placeholder || `Enter ${item.label || item.name}`;
  const rules = item.required
    ? [{ required: true, message: `${item.label || item.name} is required` }]
    : [];

  let input = <Input placeholder={placeholder} size='middle' />;

  switch (item.type) {
    case 'date':
      input = <DatePicker />;
      break;
    case 'number':
      input = <InputNumber />;
      break;
    case 'relation':
      input = <RelationInput form={form} item={item} data={data} />;
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
