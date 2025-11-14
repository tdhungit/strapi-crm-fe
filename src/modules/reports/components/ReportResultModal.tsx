import type { Config, ImmutableTree } from '@react-awesome-query-builder/antd';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
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
  onFinish?: (query: any, filters: any) => void;
}) {
  const [query, setQuery] = useState<any>(null);
  const [filters, setFilters] = useState<any>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const generateReport = (treeObj: ImmutableTree, configObj: Config) => {
    const exported = exportQuery(treeObj, configObj);
    const strapiFilters = toStrapiFilters(treeObj, configObj);

    // console.log({ exported, strapiFilters });

    setGenerating(true);
    ApiService.request('post', '/reports/extra/generate', {
      module,
      tree: treeObj,
      query: exported.sql,
      filters: strapiFilters,
      selectedFields,
    })
      .then((res) => {
        setQuery(exported);
        setFilters(strapiFilters);
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

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={() => {
        onOpenChange(false);
        onFinish?.(query, filters);
      }}
    >
      {generating ? (
        <div>Generating report...</div>
      ) : result ? (
        <div>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : (
        <div>No result</div>
      )}
    </Modal>
  );
}
