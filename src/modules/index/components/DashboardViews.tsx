import { Flex } from 'antd';
import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';
import { getWidget } from '../../collections/widgets';
import AddDashboardItemModal from './AddDashboardItemModal';

export default function DashboardViews({
  dashboardId,
  openAddItem,
  setOpenAddItem,
}: {
  dashboardId: string;
  openAddItem: boolean;
  setOpenAddItem: (open: boolean) => void;
}) {
  const [dashboard, setDashboard] = useState<any>({});

  const loadDashboard = () => {
    ApiService.getClient()
      .collection('dashboards')
      .findOne(dashboardId, {
        populate: ['dashboard_items'],
      })
      .then((res) => {
        setDashboard(res.data);
      });
  };

  const WidgetComponent = (props: any) => {
    const { item } = props;
    if (!item?.widget || !item?.metadata?.module) {
      return null;
    }

    const Widget = getWidget(item.metadata.module, item.widget);
    return <Widget module={item.metadata.module} {...props} />;
  };

  useEffect(() => {
    if (dashboardId) {
      loadDashboard();
    }
  }, [dashboardId]);

  return (
    <>
      <Flex vertical gap={8}>
        {dashboard.dashboard_items?.map((item: any) => (
          <div key={item.id}>
            <WidgetComponent
              item={item}
              height={item.height || 300}
              title={item.title}
            />
          </div>
        ))}
      </Flex>

      <AddDashboardItemModal
        open={openAddItem}
        onOpenChange={setOpenAddItem}
        dashboard={dashboard}
        onFinish={() => {
          loadDashboard();
        }}
      />
    </>
  );
}
