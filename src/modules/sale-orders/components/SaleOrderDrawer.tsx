import { Drawer, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';
import type { CollectionDrawerProps } from '../../collections/components/CollectionDetailDrawer';
import SaleOrderInformation from './SaleOrderInformation';
import SaleOrderTimeline from './SaleOrderTimeline';

export default function SaleOrderDrawer({
  open,
  onOpenChange,
  id,
  width,
}: CollectionDrawerProps) {
  const [record, setRecord] = useState<any>({});

  useEffect(() => {
    if (id) {
      ApiService.getClient()
        .collection('sale-orders')
        .findOne(id, {
          populate: [
            'account',
            'contact',
            'assigned_user',
            'sale_order_details.product_variant',
          ],
        })
        .then((res: any) => {
          setRecord(res.data);
        });
    }
  }, [id]);

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width={width || 800}
      title={record.name}
    >
      <Tabs
        defaultActiveKey='information'
        items={[
          {
            key: 'information',
            label: 'Information',
            children: record && <SaleOrderInformation record={record} />,
          },
          {
            key: 'timeline',
            label: 'Timeline',
            children: record && <SaleOrderTimeline record={record} />,
          },
        ]}
      />
    </Drawer>
  );
}
