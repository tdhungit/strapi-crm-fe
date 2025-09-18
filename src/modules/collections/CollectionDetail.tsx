import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageError from '../../components/PageError';
import { availableCollections } from '../../config/collections';
import CollectionDetailComponent from './components/CollectionDetailComponent';

export default function CollectionDetail() {
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
        <CollectionDetailComponent module={module} id={id} />
      )}
      {(!module || !id || !isAvailable) && (
        <PageError message='Collection not found' />
      )}
    </>
  );
}
