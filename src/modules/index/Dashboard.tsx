import { EditOutlined, ForkOutlined, PlusOutlined } from '@ant-design/icons';
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
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>('');
  const [openAddItem, setOpenAddItem] = useState(false);
  const [resetAddItemForm, setResetAddItemForm] = useState(false);
  const [editDashboardId, setEditDashboardId] = useState<string>('');

  const loadDashboards = () => {
    ApiService.getClient()
      .collection('dashboards')
      .find()
      .then((res) => {
        if (res.data.length > 0) {
          setDashboards(res.data);
          if (!selectedDashboardId) {
            const selected = res.data.find((d: any) => d.is_default === true);
            setSelectedDashboardId(selected?.documentId || '');
          }
        } else {
          setSelectedDashboardId('');
        }
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
          <Space.Compact>
            <Select
              value={selectedDashboardId}
              options={dashboards.map((dashboard) => ({
                value: dashboard.documentId,
                label: dashboard.name,
              }))}
              onChange={(value) => setSelectedDashboardId(value)}
              className='w-64'
            />
            <Button
              variant='solid'
              color='orange'
              icon={<EditOutlined />}
              onClick={() => {
                setEditDashboardId(selectedDashboardId);
                setOpenAddDashboardModal(true);
              }}
            />
            <Button
              variant='solid'
              color='green'
              icon={<PlusOutlined />}
              onClick={() => {
                setEditDashboardId('');
                setOpenAddDashboardModal(true);
              }}
            />
          </Space.Compact>
          <Button
            variant='solid'
            color='blue'
            icon={<ForkOutlined />}
            onClick={() => {
              setResetAddItemForm(true);
              setOpenAddItem(true);
            }}
          />
        </Space>
      }
    >
      {selectedDashboardId && (
        <div className='w-full'>
          <DashboardViews
            dashboardId={selectedDashboardId}
            openAddItem={openAddItem}
            setOpenAddItem={setOpenAddItem}
            resetAddItemForm={resetAddItemForm}
            setResetAddItemForm={setResetAddItemForm}
          />
        </div>
      )}

      <AddDashboardModal
        open={openAddDashboardModal}
        onOpenChange={setOpenAddDashboardModal}
        id={editDashboardId}
        onFinish={(newDashboard) => {
          if (newDashboard) {
            setSelectedDashboardId(newDashboard.documentId);
          }
          loadDashboards();
        }}
      />
    </PageContainer>
  );
}
