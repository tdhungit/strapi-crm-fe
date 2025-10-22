import { useEffect } from 'react';

export default function MainLogo({ appSettings, user, collapsed }: any) {
  const userRole = user.role?.name || '';

  useEffect(() => {
    console.log('userRole', userRole);
  }, [userRole]);

  return (
    <>
      <div className='m-0 p-0 bg-transparent'>
        <a
          href='/home'
          className='block no-underline transition-all duration-300 ease-in-out h-16 hover:translate-y-[-1px] hover:shadow-[0_4px_15px_rgba(0,255,128,0.1)]'
        >
          <div
            className={`flex items-center transition-all duration-300 ease-in-out relative overflow-hidden h-16 ${
              collapsed
                ? 'justify-center px-1.5 py-4 bg-transparent border-none backdrop-blur-none hover:bg-green-500/5 hover:rounded-lg'
                : 'gap-3 px-4 py-3 bg-gradient-to-r from-green-900/10 to-green-800/10 border border-green-500/20 backdrop-blur-sm hover:shadow-[0_8px_25px_rgba(0,255,128,0.15)]'
            }`}
          >
            <div
              className={`flex-shrink-0 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 ${
                collapsed
                  ? 'w-8 h-8 p-1 shadow-[0_2px_8px_rgba(0,255,128,0.2)] hover:shadow-[0_4px_12px_rgba(0,255,128,0.3)]'
                  : 'w-10 h-10 p-1.5 shadow-[0_4px_15px_rgba(0,255,128,0.3)] hover:shadow-[0_6px_20px_rgba(0,255,128,0.4)]'
              }`}
            >
              <img
                src={
                  (appSettings?.logo?.menuLogo?.url &&
                    `${import.meta.env.VITE_STRAPI_URL}${
                      appSettings.logo.menuLogo.url
                    }`) ||
                  '/logo.svg'
                }
                alt={appSettings?.uiConfig?.pageTitle || 'Strapi CRM'}
                className='w-full h-full object-contain rounded-md brightness-110 contrast-110'
              />
            </div>

            {!collapsed && (
              <div className='flex flex-col gap-0.5 flex-1 min-w-0'>
                <strong className='text-lg font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent leading-tight tracking-tight m-0 -ml-[0.025em] shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
                  {appSettings?.uiConfig?.pageTitle || 'Strapi CRM'}
                </strong>
                <div className='text-[11px] font-medium text-white/70 leading-none tracking-[0.02em] uppercase opacity-80 transition-opacity duration-300 hover:opacity-100 hover:text-white/90'>
                  A Open Source CRM System
                </div>
              </div>
            )}
          </div>
        </a>
      </div>
    </>
  );
}
