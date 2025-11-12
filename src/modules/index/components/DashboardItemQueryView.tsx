import { Bar, Column, Line, Pie } from '@ant-design/charts';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { camelToTitle } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';

export default function DashboardItemQueryView({ item }: { item: any }) {
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('table');
  const [queryData, setQueryData] = useState<any>(null);

  useEffect(() => {
    if (!item?.metadata?.query) {
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
  }, [item]);

  const renderTable = () => {
    const columns: any[] = [];
    queryData?.meta?.fields?.forEach((field: any) => {
      columns.push({
        title: camelToTitle(field.name),
        dataIndex: field.name,
        key: field.name,
      });
    });
    return <Table columns={columns} dataSource={queryData?.data || []} />;
  };

  const renderChart = () => {
    const chartConfig: any = {
      data: queryData?.data || [],
    };

    chartConfig.xField =
      item.metadata?.xField || queryData?.meta?.fields?.[0]?.name;
    chartConfig.yField =
      item.metadata?.yField ||
      queryData?.meta?.fields?.[1]?.name ||
      queryData?.meta?.fields?.[0]?.name;

    switch (chartType) {
      case 'bar':
        return <Bar {...chartConfig} />;
      case 'line':
        return <Line {...chartConfig} />;
      case 'pie':
        chartConfig.angleField =
          item.metadata?.xField || queryData?.meta?.fields?.[0]?.name;
        return <Pie {...chartConfig} />;
      default:
        return <Column {...chartConfig} />;
    }
  };

  if (item?.type !== 'Query') {
    return (
      <div className='text-orange-500 px-7 py-4'>
        Not support type {item?.type}
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='px-7 py-4'>
        {chartType === 'table' ? renderTable() : renderChart()}
      </div>
    </>
  );
}
