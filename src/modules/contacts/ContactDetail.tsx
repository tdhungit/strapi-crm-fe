import { useParams } from 'react-router-dom';
import PhoneView from '../../components/fields/phone/PhoneView';
import TagInput from '../../components/fields/tag/TagInput';
import CollectionDetailComponent from '../collections/components/CollectionDetailComponent';

export default function ContactDetail() {
  const { id } = useParams();

  const onLoadedColumns = (cols: any[]) => {
    const updateCols = cols.map((col) => {
      if (col.dataIndex === 'phone' || col.dataIndex === 'mobile') {
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
        return <TagInput module='contacts' recordId={record.id} />;
      },
    });

    return updateCols;
  };

  return (
    <CollectionDetailComponent
      module='contacts'
      id={id as string}
      onLoadedColumns={onLoadedColumns}
    />
  );
}
