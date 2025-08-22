import { Route } from 'react-router-dom';
import MenuSettings from './MenuSettings';
import Settings from './Settings';

export default function SettingRoutes() {
  return (
    <>
      <Route path='/settings' element={<Settings />} />
      <Route path='/settings/menus' element={<MenuSettings />} />
    </>
  );
}
