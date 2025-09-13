import { Pie } from '@ant-design/charts';
import { useRequest } from 'ahooks';
import { Card, Spin } from 'antd';
import ApiService from '../../../../services/ApiService';

interface StageData {
  stage: string;
  total: number;
}

interface StageStatistics {
  [key: string]: number;
}

export default function ChartStage({
  module,
}: {
  module: string;
  [key: string]: any;
}) {
  const { data, loading } = useRequest(
    async () => {
      const res = await ApiService.request(
        'get',
        `/opportunities/stage/statistics`
      );
      return res as StageStatistics;
    },
    {
      refreshDeps: [module],
    }
  );

  // Transform the data for the pie chart
  const chartData: StageData[] = data
    ? Object.entries(data).map(([stage, count]) => ({
        stage,
        total: count,
      }))
    : [];

  const chartConfig = {
    data: chartData,
    angleField: 'total',
    colorField: 'stage',
    radius: 0.8,
    label: false,
    legend: {
      position: 'bottom' as const,
      itemName: {
        style: {
          fontSize: 12,
        },
      },
    },
    tooltip: {
      title: (data: StageData) => `${data.stage}`,
      fields: ['stage', 'total'],
      formatter: (data: StageData) => ({
        name: data.stage,
        value: data.total,
      }),
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <Card title='Opportunities by Stage' size='small'>
      <Spin spinning={loading}>
        <div style={{ height: 300 }}>
          {chartData && chartData.length > 0 ? (
            <Pie {...chartConfig} />
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
