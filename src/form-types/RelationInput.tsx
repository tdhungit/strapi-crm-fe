import type { FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import DebounceSelect from '../components/DebounceSelect';
import ApiService from '../services/ApiService';
import MetadataService from '../services/MetadataService';

export default function RelationInput({
  item,
  form,
  data,
}: {
  item: any;
  form: FormInstance;
  data: any;
}) {
  const [contentType, setContentType] = useState<any>(null);
  const [keyLabel, setKeyLabel] = useState<string>('name');
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    if (item?.options?.target) {
      const ct = MetadataService.getContentTypeByUid(item.options.target);
      setContentType(ct);
      const mainField = ct.settings?.mainField || 'name';
      setKeyLabel(mainField);
    }
  }, [item]);

  useEffect(() => {
    if (data[item.name] && keyLabel) {
      setValue({
        label: data[item.name][keyLabel],
        value: data[item.name].id,
      });
      form.setFieldValue(item.name, data[item.name].id);
    }
  }, [form, item, keyLabel, data]);

  const fetchOptions = async (search: string): Promise<any[]> => {
    return ApiService.request('get', `/${contentType.pluralName}?_q=${search}`).then((res) => {
      const results = Array.isArray(res) ? res : res.data ? res.data : [];
      return results.map((item: any) => ({
        label: item[keyLabel],
        value: item.id,
      }));
    });
  };

  return (
    <DebounceSelect
      value={value}
      fetchOptions={fetchOptions}
      onChange={(selected: any) => {
        form.setFieldValue(item.name, selected.value);
        setValue(selected);
      }}
    />
  );
}
