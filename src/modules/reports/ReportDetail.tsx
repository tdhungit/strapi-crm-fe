import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  breadcrumbItemRender,
  convertFieldsToTableColumns,
  convertRawFieldsToTableColumns,
} from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';

export default function ReportDetail() {
  const { id } = useParams();

  const [report, setReport] = useState<any>(null);
  const [columns, setColumns] = useState<any>([]);

  useEffect(() => {
    ApiService.getClient()
      .collection('reports')
      .findOne(id as string)
      .then((res) => {
        setReport(res.data);
        if (res.data.metadata?.queryType !== 'query') {
          setColumns(
            convertFieldsToTableColumns(
              res.data.metadata.module,
              res.data.metadata.selectedFields
            )
          );
        } else {
          if (res.data.metadata?.fields) {
            setColumns(
              convertRawFieldsToTableColumns(res.data.metadata.fields)
            );
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <PageContainer
      header={{
        title: report?.name || 'Report Detail',
        breadcrumb: {
          itemRender: breadcrumbItemRender,
          items: [
            {
              path: '/',
              title: 'Home',
            },
            {
              path: '/collections/reports',
              title: 'Reports',
            },
            {
              title: report?.name || 'Report Detail',
            },
          ],
        },
      }}
    >
      {columns.length > 0 && (
        <ProTable
          columns={columns}
          request={async (params) => {
            const res = await ApiService.request(
              'get',
              `/reports/${report.id}/result`,
              {
                ...params,
              }
            );

            return {
              data: res.data,
              success: true,
              total: res.meta.pagination.total,
            };
          }}
          pagination={{
            defaultPageSize: report?.meta?.pagination?.pageSize || 20,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`,
          }}
          options={false}
          toolBarRender={false}
          search={false}
        />
      )}
    </PageContainer>
  );
}
