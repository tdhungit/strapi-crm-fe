import { useEffect, useState } from 'react';
import EnumerationView from './enumeration/EnumerationView';
import RelationView from './relation/RelationView';
import RichTextView from './richtext/RichtextView';

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
        case 'richtext':
          setDisplayValue(<RichTextView value={value} />);
          break;
        case 'enumeration':
          setDisplayValue(
            <EnumerationView type={item.options} value={value} />
          );
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
