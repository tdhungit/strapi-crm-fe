import { DatePicker, Form, Input, InputNumber, type FormInstance } from 'antd';
import dayjs from 'dayjs';
import { camelToTitle } from '../../helpers/views_helper';
import type { FieldLayoutConfigType } from '../../types/layouts';
import AddressInput from './address/AddressInput';
import AssignUserInput from './assign-user/AssignUserInput';
import EnumerationInput from './enumeration/EnumerationInput';
import MediaInput from './media/MediaInput';
import RankingInput from './ranking/RankingInput';
import RelationInput from './relation/RelationInput';
import RichtextInput from './richtext/RichtextInput';

export default function FormInput({
  item,
  form,
  data,
  noLabel,
}: {
  item: FieldLayoutConfigType;
  form: FormInstance;
  data: any;
  noLabel?: boolean;
}) {
  const label = item.label || item.name;
  const placeholder = item.placeholder || `Enter ${item.label || item.name}`;
  const rules = item.required
    ? [{ required: true, message: `${item.label || item.name} is required` }]
    : [];
  const extra = <></>;

  let input = <Input placeholder={placeholder} size='middle' />;

  let itemType = item.type || 'string';
  if (item.customField) {
    itemType = item.customField;
  }

  switch (itemType) {
    case 'date':
      input = (
        <DatePicker
          size='middle'
          style={{ width: '100%' }}
          format='YYYY-MM-DD'
        />
      );
      break;

    case 'number':
      input = <InputNumber />;
      break;

    case 'enumeration':
      input = <EnumerationInput type={item.options} />;
      break;

    case 'richtext':
      input = <RichtextInput value={data[item.name]} />;
      break;

    case 'relation':
      if (item.name === 'assigned_user') {
        input = (
          <AssignUserInput
            initialValues={data[item.name]}
            item={item}
            data={data}
            onChange={(value: any) => {
              form.setFieldValue(item.name, value.value);
            }}
          />
        );
      } else {
        input = (
          <RelationInput
            initialValues={data[item.name]}
            item={item}
            data={data}
            onChange={(value: any) => {
              form.setFieldValue(item.name, value.value);
            }}
          />
        );
      }
      break;

    case 'component':
      switch (item.component) {
        case 'common.address':
          input = (
            <AddressInput
              initialValues={data[item.name]}
              onChange={(value: any) => {
                form.setFieldValue(item.name, {
                  country: value?.country,
                  state: value?.state,
                  city: value?.city,
                  zipcode: value?.zipcode,
                  address: value?.address,
                });
              }}
            />
          );
          break;
        default:
          break;
      }
      break;

    case 'plugin::crm-fields.ranking':
      input = <RankingInput value={data[item.name]} />;
      break;

    case 'media':
      input = (
        <MediaInput value={data[item.name]} options={item.options as any} />
      );
      // extra = <Form.Item name='documentId' hidden />;
      break;

    case 'string':
    default:
      break;
  }

  const getValueProps = (value: any) => {
    if (item.type === 'date' && value && typeof value === 'string') {
      return { value: dayjs(value) };
    }
    return { value };
  };

  const normalize = (value: any) => {
    if (item.type === 'date' && value && dayjs.isDayjs(value)) {
      return value.format('YYYY-MM-DD');
    }
    return value;
  };

  if (noLabel) {
    return input;
  }

  return (
    <>
      <Form.Item
        name={item.name}
        label={camelToTitle(label)}
        rules={rules}
        getValueProps={getValueProps}
        normalize={normalize}
      >
        {input}
      </Form.Item>
      {extra}
    </>
  );
}
