import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLoading from '../../components/PageLoading';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';

export default function CollectionList() {
  // Get the 'name' parameter from the route
  const { name: module } = useParams();

  const [config, setConfig] = useState<any>({});
  const [collections, setCollections] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [columns, setColumns] = useState<any>([]);

  useEffect(() => {
    if (module) {
      MetadataService.getCollectionConfigurations(module).then((res) => {
        setConfig(res);
      });

      fetchCollections(module);
    }
  }, [module]);

  useEffect(() => {
    if (config?.layouts?.list) {
      const cols: any = [];
      config.layouts.list.forEach((field: string) => {
        const metadatas = config.metadatas?.[field]?.list || {};
        cols.push({
          title: metadatas.label || field,
          dataIndex: field,
          key: field,
        });
      });
      setColumns(cols);
    }
  }, [config]);

  const fetchCollections = async (module: string) => {
    const collections = await ApiService.getClient().collection(module).find();
    setCollections(collections.data || []);
    setLoading(false);
  };

  if (loading || !config?.layouts) return <PageLoading />;

  return (
    <div>
      <h1 className='text-2xl mb-4 uppercase'>{module}</h1>
      <Table
        dataSource={collections}
        columns={columns}
        rowKey={(record: any) => record.id || record.key || JSON.stringify(record)}
        pagination={false}
      />
    </div>
  );
}
