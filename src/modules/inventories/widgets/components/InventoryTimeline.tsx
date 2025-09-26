import { Timeline, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { datetimeDisplay } from '../../../../helpers/views_helper';
import ApiService from '../../../../services/ApiService';

export default function InventoryTimeline() {
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    ApiService.getClient()
      .collection('timelines')
      .find({
        filters: {
          model: 'inventories',
        },
        populate: ['user'],
        sort: 'createdAt:desc',
        pagination: {
          limit: 100,
        },
      })
      .then((res: any) => {
        const items: any[] = [];
        res.data.forEach((tl: any) => {
          items.push({
            children: (
              <div>
                <Typography.Title level={5}>{tl.title}</Typography.Title>
                <div>
                  <Typography.Text className='text-xs italic !text-gray-500'>
                    {datetimeDisplay(tl.createdAt)}
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text>{tl.description}</Typography.Text>
                </div>
                <div>
                  <Typography.Text className='text-xs italic !text-gray-500'>
                    By: {tl.user?.username || 'System'}
                  </Typography.Text>
                </div>
              </div>
            ),
          });
        });
        setTimeline(items);
      });
  }, []);

  return (
    <div
      className='w-full bg-white rounded-md p-4 overflow-y-auto'
      style={{ height: '600px' }}
    >
      <Timeline items={timeline} />
    </div>
  );
}
