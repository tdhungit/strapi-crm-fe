import { PageContainer } from '@ant-design/pro-components';

export default function Settings() {
  return (
    <PageContainer
      header={{
        title: 'Settings',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: 'Settings',
              href: '/settings',
            },
          ],
        },
      }}
    >
      <h1>Settings</h1>
    </PageContainer>
  );
}
