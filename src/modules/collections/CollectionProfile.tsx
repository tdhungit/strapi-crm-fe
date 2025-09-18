import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageError from '../../components/PageError';
import { availableCollections } from '../../config/collections';
import CollectionProfileComponent from './components/CollectionProfileComponent';

export default function CollectionProfile() {
  const { name: module, id } = useParams();

  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (module) {
      if (!availableCollections.includes(module)) {
        setIsAvailable(false);
      } else {
        setIsAvailable(true);
      }
    }
  }, [module]);

  return (
    <>
      {module && id && isAvailable && (
        <CollectionProfileComponent module={module} id={id} />
      )}
      {(!module || !id || !isAvailable) && (
        <PageError message='Collection not found' />
      )}
    </>
  );
}
