import { useEffect, useState } from 'react';
import MetadataService from '../../../services/MetadataService';

export default function RelationView({ item, data }: { item: any; data: any }) {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [documentId, setDocumentId] = useState<string>('');

  useEffect(() => {
    if (item?.options?.target) {
      const contentType = MetadataService.getContentTypeByUid(item.options.target);
      const mainField = contentType.settings?.mainField || 'name';
      const value = data[item.name];
      setDisplayValue(value[mainField]);
      setDocumentId(value.id);
    }
  }, [item, data]);

  return <a href={`/collections/${item.options.target}/detail/${documentId}`}>{displayValue}</a>;
}
