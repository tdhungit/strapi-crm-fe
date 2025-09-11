import { useParams } from 'react-router-dom';
import CollectionProfileComponent from './components/CollectionProfileComponent';

export default function CollectionProfile() {
  const { name: module, id } = useParams();

  return (
    <>
      {module && id && <CollectionProfileComponent module={module} id={id} />}
    </>
  );
}
