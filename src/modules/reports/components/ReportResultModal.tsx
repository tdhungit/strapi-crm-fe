import type { Config, ImmutableTree } from '@react-awesome-query-builder/antd';
import { Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { convertFieldsToTableColumns } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import { exportQuery, toStrapiFilters } from './../utils/queryExport';

export default function ReportResultModal({
  open,
  onOpenChange,
  module,
  tree,
  config,
  selectedFields,
  onFinish,
}: {
  module: string;
  tree: ImmutableTree;
  config: Config;
  selectedFields: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish?: (query: any, filters: any, jsonTree: any) => void;
}) {
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<any>(null);
  const [jsonTree, setJsonTree] = useState<any>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

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

  useEffect(() => {
    if (!open || !tree || !config) return;

    generateReport(tree, config);
  }, [open, tree, config]);

  const columns = convertFieldsToTableColumns(module, selectedFields);

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={() => {
        onOpenChange(false);
        onFinish?.(query, filters, jsonTree);
      }}
      width={1100}
    >
      {generating ? (
        <div>Generating report...</div>
      ) : result ? (
        <div className='w-full'>
          <Table
            columns={columns}
            dataSource={result.data}
            pagination={{
              pageSize: result.meta.pagination.pageSize,
              total: result.meta.pagination.total,
              current: result.meta.pagination.page,
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
