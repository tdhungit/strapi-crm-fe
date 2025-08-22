import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';

export default function IndexRoutes() {
  return (
    <>
      <Route path='/home' element={<Dashboard />} />
      {/* Add other routes here as needed */}
    </>
  );
}
