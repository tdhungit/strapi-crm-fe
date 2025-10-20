import { ForkOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import type { RootState } from '../../stores';
import AddDashboardModal from './components/AddDashboardModal';
import DashboardViews from './components/DashboardViews';

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [openAddDashboardModal, setOpenAddDashboardModal] = useState(false);
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<any>();
  const [openAddItem, setOpenAddItem] = useState(false);

  const loadDashboards = () => {
    ApiService.getClient()
      .collection('dashboards')
      .find()
      .then((res) => {
        if (res.data.length > 0) {
          setDashboards(res.data);
          loadDashboard(res.data[0].documentId);
        }
      });
  };

  const loadDashboard = (dashboardId: string) => {
    ApiService.getClient()
      .collection('dashboards')
      .findOne(dashboardId, {
        populate: ['dashboard_items'],
      })
      .then((res) => {
        setSelectedDashboard(res.data);
      });
  };

  useEffect(() => {
    loadDashboards();
  }, []);

  return (
    <PageContainer
      header={{
        title: <div>Welcome {user?.username}!</div>,
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
          itemRender: breadcrumbItemRender,
        },
      }}
      extra={
        <Space>
          <Select
            value={selectedDashboard?.documentId || ''}
            options={dashboards.map((dashboard) => ({
              value: dashboard.documentId,
              label: dashboard.name,
            }))}
            onChange={(value) => loadDashboard(value)}
            className='w-32'
          />
          <Button
            type='primary'
            icon={<PlusOutlined />}
            size='small'
            onClick={() => setOpenAddDashboardModal(true)}
          />
          <Button
            variant='solid'
            color='green'
            icon={<ForkOutlined />}
            size='small'
            onClick={() => setOpenAddItem(true)}
          />
        </Space>
      }
    >
      {selectedDashboard && (
        <div className='mt-4'>
          <DashboardViews
            dashboard={selectedDashboard}
            openAddItem={openAddItem}
            setOpenAddItem={setOpenAddItem}
          />
        </div>
      )}

      <AddDashboardModal
        open={openAddDashboardModal}
        onOpenChange={setOpenAddDashboardModal}
        onFinish={() => {}}
      />
    </PageContainer>
  );
}
