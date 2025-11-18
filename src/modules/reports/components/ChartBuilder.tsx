import { Select } from 'antd';
import MetadataService from '../../../services/MetadataService';
import ChartFilterBuilder from './ChartFilterBuilder';
import ChartQueryBuilder from './ChartQueryBuilder';

interface ValuesType {
  chartType?: string;
  module?: string;
  queryType?: string;
  query?: string;
}

export default function ChartBuilder({
  values,
  onChange,
}: {
  values: ValuesType;
  onChange: (values: ValuesType) => void;
}) {
  const moduleOptions = MetadataService.getAvailableContentTypeOptions();
  const chartTypes = [
    {
      label: 'Line',
      value: 'line',
    },
    {
      label: 'Bar',
      value: 'bar',
    },
    {
      label: 'Pie',
      value: 'pie',
    },
  ];

  return (
    <div className='w-full space-y-4'>
      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700'>
          Chart Type
        </label>
        <Select
          value={values.chartType}
          options={chartTypes}
          onChange={(chartType) => onChange({ ...values, chartType })}
          className='w-full'
        />
      </div>
      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700'>
          Module
        </label>
        <Select
          value={values.module}
          options={moduleOptions}
          onChange={(module) => onChange({ ...values, module })}
          className='w-full'
        />
      </div>

      {values.module && values.queryType === 'Query' && values.chartType && (
        <ChartQueryBuilder
          chartType={values.chartType}
          value={values.query || ''}
          onChange={(query) => onChange({ ...values, query })}
        />
      )}

      {values.module && values.queryType === 'Builder' && values.chartType && (
        <ChartFilterBuilder
          module={values.module}
          chartType={values.chartType}
        />
      )}
    </div>
  );
}
