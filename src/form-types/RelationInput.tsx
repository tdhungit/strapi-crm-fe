import { Select } from 'antd';
import { useEffect, useState } from 'react';
import ApiService from '../services/ApiService';
import MetadataService from '../services/MetadataService';

export default function RelationInput({ item }: { item: any }) {
  const [contentType, setContentType] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (item?.options?.target) {
      setContentType(MetadataService.getContentTypeByUid(item.options.target));
    }
  }, [item]);

  useEffect(() => {
    if (contentType) {
      ApiService.request('get', `/${contentType.pluralName}`).then((res) => {
        setOptions(res);
        setLoading(false);
      });
    }
  }, [contentType]);

  return <Select loading={loading} options={options} />;
}
