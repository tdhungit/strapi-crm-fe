import { useParams } from 'react-router-dom';
import CollectionFormComponent from './components/CollectionFormComponent';

export default function CollectionForm() {
  const { name: module, id } = useParams();

  return <>{module && <CollectionFormComponent module={module} id={id} />}</>;
}
