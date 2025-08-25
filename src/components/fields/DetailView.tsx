import { useEffect, useState } from 'react';
import RelationView from './relation/RelationView';

export default function DetailView({ item, data }: { item: any; data: any }) {
  const [displayValue, setDisplayValue] = useState<any>('');

  useEffect(() => {
    if (data[item.name]) {
      const value = data[item.name];
      const type = item.type || 'string';

      switch (type) {
        case 'relation':
          setDisplayValue(<RelationView item={item} data={data} />);
          break;
        case 'string':
        default:
          setDisplayValue(value);
          break;
      }
    }
  }, [item, data]);

  return <div>{displayValue}</div>;
}
