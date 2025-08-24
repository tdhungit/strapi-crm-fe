import { Spin } from 'antd';

export default function PageLoading() {
  return (
    <div className='text-center w-full h-full flex justify-center items-center'>
      <Spin size='large' />
    </div>
  );
}
