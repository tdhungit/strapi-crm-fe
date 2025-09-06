import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';
import MetadataService from '../../../services/MetadataService';
import DebounceSelect from '../../DebounceSelect';

export default function RelationInput(props: {
  value?: any;
  item: any;
  data: any;
  onChange?: (value: any) => void;
  disable?: boolean;
}) {
  const { item, data, onChange, disable, value: defaultValue } = props;

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
      const newValue = {
        label: data[item.name][keyLabel],
        value: data[item.name].id,
      };
      setValue(newValue);
      if (defaultValue !== newValue.value) {
        onChange?.(newValue);
      }
    }
  }, [item, keyLabel, data]);

  const fetchOptions = async (search: string): Promise<any[]> => {
    return ApiService.request(
      'get',
      `/${contentType.pluralName}?_q=${search}`
    ).then((res) => {
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
        setValue(selected);
        onChange?.(selected);
      }}
      disabled={disable}
    />
  );
}
