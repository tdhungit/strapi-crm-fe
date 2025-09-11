import { useParams } from 'react-router-dom';
import CollectionListComponent from './components/CollectionListComponent';

export default function CollectionList() {
  // Get the 'name' parameter from the route
  const { name: module } = useParams();

  return <>{module && <CollectionListComponent module={module} />}</>;
}
