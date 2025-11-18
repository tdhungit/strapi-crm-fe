import type { Config, ImmutableTree } from '@react-awesome-query-builder/antd';
import { Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import {
  convertFieldsToTableColumns,
  convertRawFieldsToTableColumns,
} from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import { exportQuery, toStrapiFilters } from './../utils/queryExport';

export default function ReportResultModal({
  open,
  onOpenChange,
  module,
  query: rawQuery,
  tree,
  config,
  selectedFields,
  onFinish,
}: {
  module: string;
  query?: string;
  tree?: ImmutableTree;
  config?: Config;
  selectedFields?: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish?: (query: any, filters: any, jsonTree: any, fields?: any[]) => void;
}) {
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<any>(null);
  const [jsonTree, setJsonTree] = useState<any>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [columns, setColumns] = useState<any>([]);
  const [fields, setFields] = useState<any>([]);

  const generateReport = (treeObj: ImmutableTree, configObj: Config) => {
    const exported = exportQuery(treeObj, configObj);
    const strapiFilters = toStrapiFilters(treeObj, configObj);

    // console.log({ exported, strapiFilters });

    setGenerating(true);
    ApiService.request('post', '/reports/extra/generate', {
      module,
      tree: exported.jsonTree,
      query: exported.sql,
      filters: strapiFilters,
      selectedFields,
    })
      .then((res) => {
        setQuery(exported.sql || '');
        setFilters(strapiFilters);
        setJsonTree(exported.jsonTree);
        setResult(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setGenerating(false);
      });
  };

  const generateRawQueryReport = (query: string) => {
    setGenerating(true);
    ApiService.request('post', '/reports/extra/generate', {
      module,
      query,
    })
      .then((res) => {
        setQuery(query);
        setResult(res);
        setColumns(convertRawFieldsToTableColumns(res.meta.fields));
        setFields(res.meta.fields);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setGenerating(false);
      });
  };

  useEffect(() => {
    if (!open || !tree || !config) return;

    generateReport(tree, config);
  }, [open, tree, config]);

  useEffect(() => {
    if (!open || !selectedFields || selectedFields.length === 0 || !filters)
      return;
    setColumns(convertFieldsToTableColumns(module, selectedFields));
  }, [open, selectedFields]);

  useEffect(() => {
    if (!open || !rawQuery) return;
    generateRawQueryReport(rawQuery);
  }, [open, rawQuery]);

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={() => {
        onOpenChange(false);
        onFinish?.(query, filters, jsonTree, fields);
      }}
      width={1100}
      maskClosable={false}
    >
      {generating ? (
        <div>Generating report...</div>
      ) : result ? (
        <div className='w-full overflow-y-auto'>
          <Table
            columns={columns}
            dataSource={result.data}
            pagination={{
              pageSize: result.meta.pagination?.pageSize || 10,
              total: result.meta.pagination?.total || 0,
              current: result.meta.pagination?.page || 1,
              disabled: true,
            }}
          />
        </div>
      ) : (
        <div>No result</div>
      )}
    </Modal>
  );
}
