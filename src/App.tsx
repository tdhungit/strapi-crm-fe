import { App as AntdApp } from 'antd';
import AppRoutes from './Route';
import InboundCallListener from './components/telecom/InboundCallListener';

function App() {
  return (
    <AntdApp>
      <div className='StrapiCrmContainer'>
        <AppRoutes />
      </div>
      <InboundCallListener />
    </AntdApp>
  );
}

export default App;
