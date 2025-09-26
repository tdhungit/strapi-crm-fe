import { Timeline, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { datetimeDisplay } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';

export default function SaleOrderTimeline({ record }: { record: any }) {
  const [timeline, setTimeline] = useState<any>([]);

  useEffect(() => {
    if (record) {
      ApiService.getClient()
        .collection('timelines')
        .find({
          filters: {
            model: 'sale-orders',
            record_id: record.id,
          },
          populate: ['user'],
          sort: 'createdAt:desc',
        })
        .then((res: any) => {
          const items: any[] = [];
          res.data.forEach((item: any) => {
            let color = 'blue';
            if (item.title === 'Completed') {
              color = 'green';
            } else if (item.title === 'Approved') {
              color = 'orange';
            } else if (item.title === 'Rejected') {
              color = 'red';
            }
            items.push({
              color,
              children: (
                <div className='w-full'>
                  <Typography.Title level={5}>{item.title}</Typography.Title>
                  <div>
                    <Typography.Text className='text-xs italic !text-gray-500'>
                      {datetimeDisplay(item.createdAt)}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text>{item.description}</Typography.Text>
                  </div>
                  <div>
                    <Typography.Text className='text-xs italic !text-gray-500'>
                      By: {item.user?.username || 'System'}
                    </Typography.Text>
                  </div>
                </div>
              ),
            });
          });

          items.push({
            color: 'blue',
            children: (
              <div className='w-full'>
                <Typography.Title level={5}>Created</Typography.Title>
                <div>
                  <Typography.Text className='text-xs italic text-gray-500'>
                    {datetimeDisplay(record.createdAt)}
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text className='text-xs italic !text-gray-500'>
                    By: {record.assigned_user?.username || 'System'}
                  </Typography.Text>
                </div>
              </div>
            ),
          });

          setTimeline(items);
        });
    }
  }, [record]);

  return <Timeline mode='left' items={timeline} />;
}
