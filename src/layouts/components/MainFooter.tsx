import { Layout } from 'antd';

const { Footer } = Layout;

export default function MainFooter() {
  return (
    <>
      <Footer className='bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] h-[48px] flex items-center justify-center p-0 mt-auto'>
        <div className='w-full h-[48px] flex justify-between items-center transition-all duration-200'>
          <div className='flex items-center ml-[-10px]'>
            <div className='flex flex-col gap-1'>
              <span className='text-gray-600 text-sm md:text-xs sm:text-xs font-medium leading-tight tracking-tight'>
                Strapi CRM ©2025.
              </span>
              <span className='text-green-600 text-xs md:text-[10px] sm:text-[10px] font-medium tracking-wide'>
                Powered by Jacky
              </span>
            </div>
          </div>
          <div className='flex items-center'>
            <span className='bg-gradient-to-r from-green-500 to-green-700 text-white px-2 py-1 md:px-1.5 md:py-0.5 sm:px-1.5 sm:py-0.5 rounded-xl text-xs md:text-[9px] sm:text-[9px] font-semibold uppercase tracking-wider shadow-[0_1px_4px_rgba(0,204,102,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_2px_8px_rgba(0,204,102,0.4)] relative overflow-hidden'>
              v1.0.0
            </span>
          </div>
        </div>
      </Footer>
    </>
  );
}
