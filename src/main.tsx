import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      locale={enUS}
      theme={{
        token: {
          borderRadius: 4,
          colorPrimary: '#004d00',
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>
);
