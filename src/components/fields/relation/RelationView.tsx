import { useEffect, useState } from 'react';
import MetadataService from '../../../services/MetadataService';

export default function RelationView({ item, data }: { item: any; data: any }) {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [href, setHref] = useState<string>('');

  useEffect(() => {
    if (item?.target) {
      const contentType = MetadataService.getContentTypeByUid(item.target);
      const mainField = contentType.settings?.mainField || 'name';
      const value = data[item.name];
      setDisplayValue(value[mainField]);

      const model = MetadataService.getContentTypeByUid(item.target);
      if (model?.collectionName === 'up_users') {
        setHref(`/users/detail/${value.id}`);
      } else {
        setHref(`/collections/${model.collectionName}/detail/${value.id}`);
      }
    }
  }, [item, data]);

  return <a href={href}>{displayValue}</a>;
}
