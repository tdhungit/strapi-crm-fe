import { useParams } from 'react-router-dom';
import PhoneView from '../../components/fields/phone/PhoneView';
import TagInput from '../../components/fields/tag/TagInput';
import CollectionDetailComponent from '../collections/components/CollectionDetailComponent';

export default function AccountDetail() {
  const { id } = useParams();

  return (
    <CollectionDetailComponent
      module='accounts'
      id={id as string}
      onLoadedColumns={(cols) => {
        const updateCols = cols.map((col: any) => {
          if (col.dataIndex === 'phone') {
            col.render = (text: string) => {
              return <PhoneView value={text} />;
            };
          }
          return col;
        });
        updateCols.push({
          dataIndex: 'tags',
          title: 'Tags',
          render: (_text: any, record: any) => {
            return <TagInput module='accounts' recordId={record.id} />;
          },
        });
        return updateCols;
      }}
    />
  );
}
