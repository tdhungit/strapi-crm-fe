import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageError from '../../components/PageError';
import { availableCollections } from '../../config/collections';
import CollectionListComponent from './components/CollectionListComponent';

export default function CollectionList() {
  // Get the 'name' parameter from the route
  const { name: module } = useParams();

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
      {module && isAvailable && <CollectionListComponent module={module} />}
      {(!module || !isAvailable) && (
        <PageError message='Collection not found' />
      )}
    </>
  );
}
