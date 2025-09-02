import { DatePicker, Form, Input, InputNumber, type FormInstance } from 'antd';
import AssignUserInput from './assign-user/AssignUserInput';
import RelationInput from './relation/RelationInput';
import RichtextInput from './richtext/RichtextInput';

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
    case 'richtext':
      input = <RichtextInput />;
      break;
    case 'relation':
      if (item.name === 'assigned_user') {
        input = <AssignUserInput form={form} item={item} data={data} />;
      } else {
        input = <RelationInput form={form} item={item} data={data} />;
      }
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
