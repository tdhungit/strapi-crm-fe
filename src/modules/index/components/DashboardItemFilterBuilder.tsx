import { Bar, Column, Line, Pie } from '@ant-design/charts';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';

export default function DashboardItemFilterBuilder({ item }: { item: any }) {
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('table');
  const [queryData, setQueryData] = useState<any>(null);

  useEffect(() => {
    if (!item.metadata?.filters && !item.metadata?.metadata?.filters) {
      return;
    }

    setLoading(true);
    ApiService.request('get', `/dashboard-item/${item.id}/query-data`).then(
      (res) => {
        const type = item.metadata?.chartType || 'table';
        setChartType(type);
        setQueryData(res);
        setLoading(false);
      }
    );
  }, []);

  const renderTable = () => {
    if (queryData?.data && queryData?.data.length === 0) {
      return <div className='px-7 py-4 text-center'>No data</div>;
    }

    const columns: any[] = [];
    const row: any = queryData?.data[0];

    Object.keys(row || {}).forEach((key) => {
      columns.push({
        title: key,
        dataIndex: key,
        key: key,
      });
    });

    return <Table columns={columns} dataSource={queryData?.data || []} />;
  };

  const renderChart = () => {
    const chartConfig: any = {
      data: queryData?.data || [],
    };

    chartConfig.xField =
      item.metadata?.xAxis ||
      item.metadata?.metadata?.xAxis ||
      queryData?.meta?.fields?.[0]?.name;

    const metricOperation =
      item.metadata?.metricOperation ||
      item.metadata?.metadata?.metricOperation ||
      '';
    chartConfig.yField =
      (metricOperation ? `${metricOperation}_` : '') +
      (item.metadata?.yAxis ||
        item.metadata?.metadata?.yAxis ||
        queryData?.meta?.fields?.[1]?.name ||
        queryData?.meta?.fields?.[0]?.name);

    switch (chartType) {
      case 'bar':
        return <Bar {...chartConfig} />;
      case 'line':
        return <Line {...chartConfig} />;
      case 'pie':
        chartConfig.angleField =
          item.metadata?.xField ||
          item.metadata?.metadata?.xField ||
          queryData?.meta?.fields?.[0]?.name;
        return <Pie {...chartConfig} />;
      default:
        return <Column {...chartConfig} />;
    }
  };

  if (loading) {
    return <div className='px-7 py-4'>Loading...</div>;
  }

  return (
    <div className='px-7 py-4'>
      {chartType === 'table' ? renderTable() : renderChart()}
    </div>
  );
}
