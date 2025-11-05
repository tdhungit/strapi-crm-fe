import { ProTable } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { getListLayoutColumns } from '../../../helpers/views_helper';
import MetadataService from '../../../services/MetadataService';

export default function CollectionListDataComponent({
  dataSource,
  collectionName,
}: {
  dataSource: any[];
  collectionName: string;
}) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    const dataSources = dataSource.map((item) => ({
      ...item.data,
    }));
    setData(dataSources);

    MetadataService.getCollectionConfigurations(collectionName).then((res) => {
      // get columns
      const cols = getListLayoutColumns(res);
      setColumns(cols);
    });
  }, [collectionName, dataSource]);

  return (
    <ProTable
      columns={columns}
      dataSource={data}
      pagination={false}
      options={false}
      search={false}
    />
  );
}
