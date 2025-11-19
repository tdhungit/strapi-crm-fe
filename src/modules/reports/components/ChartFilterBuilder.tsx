import type { ImmutableTree } from '@react-awesome-query-builder/antd';
import type { Config } from '@react-awesome-query-builder/core';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import MetadataService from '../../../services/MetadataService';
import {
  exportQuery,
  loadTreeFromJson,
  toStrapiFilters,
} from '../utils/queryExport';
import QueryBuilder from './QueryBuilder';

interface ValueType {
  jsonTree?: any;
  filters?: any;
  xAxis?: string;
  yAxis?: string;
  metricOperation?: string;
}

export default function ChartFilterBuilder({
  chartType,
  module,
  value,
  onChange,
}: {
  chartType: string;
  module: string;
  value?: ValueType;
  onChange?: (value: ValueType) => void;
}) {
  const [tree, setTree] = useState<ImmutableTree | undefined>(undefined);
  // const [config, setConfig] = useState<Config | undefined>(undefined);
  const [selectFields, setSelectFields] = useState<any[]>([]);

  const handleChange = (tree: ImmutableTree, config: Config) => {
    setTree(tree);
    // setConfig(config);
    const exported = exportQuery(tree, config);
    const filters = toStrapiFilters(tree, config);
    onChange?.({
      ...(value || {}),
      jsonTree: exported.jsonTree,
      filters,
      xAxis: value?.xAxis,
      yAxis: value?.yAxis,
      metricOperation: value?.metricOperation,
    });
  };

  const handleValueChange = (key: string, val: any) => {
    const newValue = { ...value, [key]: val };
    onChange?.(newValue as ValueType);
  };

  useEffect(() => {
    if (value?.jsonTree) {
      const loadTreeObj = loadTreeFromJson(value.jsonTree);
      setTree(loadTreeObj);
    }
  }, [value]);

  useEffect(() => {
    if (!module) return;
    const fields = MetadataService.getContentTypeFieldOptions(module);
    setSelectFields(fields);
  }, [module]);

  return (
    <div>
      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700'>
          Builder
        </label>
        <QueryBuilder
          module={module}
          value={tree}
          onChange={(tree: ImmutableTree, config: Config) => {
            handleChange(tree, config);
          }}
        />
      </div>

      {['line', 'bar', 'pie'].includes(chartType) && (
        <div className='mt-4 space-y-4'>
          <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              X Axis Fields
            </label>
            <Select
              options={selectFields}
              placeholder='Select fields'
              onChange={(value) => handleValueChange('xAxis', value)}
              value={value?.xAxis}
              className='w-full'
            />
          </div>
          <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Y Axis Fields
            </label>
            <Select
              options={selectFields}
              placeholder='Select fields'
              onChange={(value) => handleValueChange('yAxis', value)}
              value={value?.yAxis}
              className='w-full'
            />
          </div>
          <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Metric Operation
            </label>
            <Select
              options={[
                { value: 'count', label: 'Count' },
                { value: 'sum', label: 'Sum' },
                { value: 'avg', label: 'Average' },
                { value: 'max', label: 'Max' },
                { value: 'min', label: 'Min' },
              ]}
              placeholder='Select fields'
              onChange={(value) => handleValueChange('metricOperation', value)}
              value={value?.metricOperation}
              className='w-full'
            />
          </div>
        </div>
      )}
    </div>
  );
}
