import { Column } from '@ant-design/charts';
import { useRequest } from 'ahooks';
import { Card, Select, Spin } from 'antd';
import { useState } from 'react';
import ApiService from '../../../../services/ApiService';

type ChartType = 'day' | 'week' | 'month';

interface ChartData {
  group: string;
  total: number;
}

interface ApiResponse {
  type: ChartType;
  data: ChartData[];
}

interface Props {
  module: string;
  [key: string]: any;
}

export default function ChartCreatedAt(props: Props) {
  const { module } = props;

  const [chartType, setChartType] = useState<ChartType>('day');

  const { data, loading } = useRequest(
    async () => {
      const res = await ApiService.request(
        'get',
        `/widgets/${module}/count-records-by-created?type=${chartType}`
      );
      return res as ApiResponse;
    },
    {
      refreshDeps: [chartType, module],
    }
  );

  const chartConfig = {
    data: data?.data || [],
    xField: 'group',
    yField: 'total',
    animate: false,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: '#1890ff',
    meta: {
      group: {
        alias:
          chartType === 'day'
            ? 'Date'
            : chartType === 'week'
            ? 'Week'
            : 'Month',
      },
      total: {
        alias: 'Records Created',
      },
    },
    label: {
      position: 'top' as const,
      style: {
        fill: '#666',
        fontSize: 12,
      },
    },
    tooltip: {
      showTitle: true,
      showMarkers: false,
    },
  };

  return (
    <Card title={props.title || 'Records Created'} size='small'>
      <div className='mb-4 flex justify-end'>
        <Select
          value={chartType}
          onChange={setChartType}
          style={{ width: '100%' }}
          options={[
            { label: 'By Day', value: 'day' },
            { label: 'By Week', value: 'week' },
            { label: 'By Month', value: 'month' },
          ]}
        />
      </div>
      <Spin spinning={loading}>
        <div style={{ height: props.height || 300 }}>
          {data?.data && data.data.length > 0 ? (
            <Column {...chartConfig} />
          ) : (
            <div className='flex items-center justify-center h-full text-gray-500'>
              No data available
            </div>
          )}
        </div>
      </Spin>
    </Card>
  );
}
