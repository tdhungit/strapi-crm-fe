import { useEffect, useState } from 'react';
import DebounceSelect from '../components/DebounceSelect';
import ApiService from '../services/ApiService';
import MetadataService from '../services/MetadataService';

export default function RelationInput({ item }: { item: any }) {
  const [contentType, setContentType] = useState<any>(null);

  useEffect(() => {
    if (item?.options?.target) {
      setContentType(MetadataService.getContentTypeByUid(item.options.target));
    }
  }, [item]);

  const fetchOptions = async (search: string): Promise<any[]> => {
    return ApiService.request('get', `/${contentType.pluralName}?_q=${search}`).then((res) => {
      const results = Array.isArray(res) ? res : res.data ? res.data : [];
      const keyLabel = contentType.settings?.mainField || 'name';
      return results.map((item: any) => ({
        label: item[keyLabel],
        value: item.id,
      }));
    });
  };

  return <DebounceSelect fetchOptions={fetchOptions} />;
}
