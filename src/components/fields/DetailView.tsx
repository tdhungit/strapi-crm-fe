import { useEffect, useState } from 'react';
import AddressView from './address/AddressView';
import BooleanView from './boolean/BooleanView';
import EnumerationView from './enumeration/EnumerationView';
import MediaView from './media/MediaView';
import PasswordView from './password/PasswordView';
import RankingView from './ranking/RankingView';
import RelationView from './relation/RelationView';
import RichTextView from './richtext/RichtextView';

export default function DetailView({ item, data }: { item: any; data: any }) {
  const [displayValue, setDisplayValue] = useState<any>('');

  useEffect(() => {
    if (data[item.name]) {
      const value = data[item.name];
      let type = item.type || 'string';

      if (item.customField) {
        type = item.customField;
      }

      switch (type) {
        case 'relation':
          setDisplayValue(<RelationView item={item} data={data} />);
          break;

        case 'richtext':
          setDisplayValue(<RichTextView value={value} />);
          break;

        case 'enumeration':
          setDisplayValue(
            <EnumerationView type={item.options || item} value={value} />
          );
          break;

        case 'component':
          switch (item.component) {
            case 'common.address':
              setDisplayValue(<AddressView value={value} />);
              break;
            default:
              break;
          }
          break;

        case 'plugin::crm-fields.ranking':
          setDisplayValue(<RankingView value={value} />);
          break;

        case 'media':
          setDisplayValue(<MediaView value={value} />);
          break;

        case 'boolean':
          setDisplayValue(<BooleanView value={value ? true : false} />);
          break;

        case 'password':
          setDisplayValue(<PasswordView />);
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
