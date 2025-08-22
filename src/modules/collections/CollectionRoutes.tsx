import { Route } from 'react-router-dom';
import CollectionForm from './CollectionForm';
import CollectionList from './CollectionList';

export default function CollectionRoutes() {
  return (
    <>
      <Route path='/collections/:name' element={<CollectionList />} />
      <Route path='/collections/:name/create' element={<CollectionForm />} />
      <Route path='/collections/:name/:id' element={<CollectionForm />} />
    </>
  );
}
