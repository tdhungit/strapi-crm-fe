import { useParams } from 'react-router-dom';
import CollectionDetailComponent from './components/CollectionDetailComponent';

export default function CollectionDetail() {
  const { name: module, id } = useParams();

  return (
    <>{module && id && <CollectionDetailComponent module={module} id={id} />}</>
  );
}
