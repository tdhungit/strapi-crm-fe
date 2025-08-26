import { App as AntdApp } from 'antd';
import AppRoutes from './Route';

function App() {
  return (
    <AntdApp>
      <div className='StrapiCrmContainer'>
        <AppRoutes />
      </div>
    </AntdApp>
  );
}

export default App;
