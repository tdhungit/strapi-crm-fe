import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageError from '../../components/PageError';
import { availableCollections } from '../../config/collections';
import CollectionFormComponent from './components/CollectionFormComponent';

export default function CollectionForm() {
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
      {module && isAvailable && (
        <CollectionFormComponent module={module} id={id} />
      )}
      {(!module || !isAvailable) && (
        <PageError message='Collection not found' />
      )}
    </>
  );
}
