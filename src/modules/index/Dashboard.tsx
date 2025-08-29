import { PageContainer } from '@ant-design/pro-components';

export default function Dashboard() {
  return (
    <PageContainer
      header={{
        title: 'Dashboard',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: 'Dashboard',
            },
          ],
        },
      }}
    >
      <h1 className='text-3xl font-bold underline'>Hello world!</h1>
    </PageContainer>
  );
}
