import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../../services/ApiService';

export default function CollectionList() {
  // Get the 'name' parameter from the route
  const { name: module } = useParams();

  const [collections, setCollections] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (module) {
      console.log(`Module name: ${module}`);
      // You can call a function to fetch collections based on the module name
      fetchCollections(module);
    }
  }, [module]);

  const fetchCollections = async (module: string) => {
    const collections = await ApiService.getClient().collection(module).find();
    setCollections(collections.data || []);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>CollectionList {module}</h1>
      <Table
        dataSource={collections}
        columns={
          collections.length > 0
            ? Object.keys(collections[0]).map((key) => ({
                title: key,
                dataIndex: key,
                key,
              }))
            : []
        }
        rowKey={(record: any) => record.id || record.key || JSON.stringify(record)}
        pagination={false}
      />
    </div>
  );
}
