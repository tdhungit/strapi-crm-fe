import { useRequest } from 'ahooks';
import { Alert, Collapse, Empty, Pagination, Timeline, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import PageLoading from '../../../components/PageLoading';
import ApiService from '../../../services/ApiService';

const { Text } = Typography;

interface AuditLog {
  id: number;
  action: string;
  entityId: string;
  entityType: string;
  data?: any;
  assigned_user?: {
    id: number;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CollectionRecordLog({
  collection,
  id,
}: {
  collection: string;
  id: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: response,
    loading,
    error,
  } = useRequest(
    async () => {
      if (!collection || !id)
        return {
          results: [],
          pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 },
        };
      const apiResponse = await ApiService.request(
        'get',
        `/audit-logs/${collection}/${id}`,
        {
          page: currentPage,
          pageSize: pageSize,
        }
      );
      return apiResponse;
    },
    {
      refreshDeps: [collection, id, currentPage, pageSize],
    }
  );

  const logs = response?.results || [];
  const pagination = response?.pagination || {
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when page size changes
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <Alert
        message='Error loading audit logs'
        description={error.message || 'Failed to fetch audit logs'}
        type='error'
        showIcon
      />
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Empty
        description='No audit logs found'
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'beforeCreate':
        return 'green';
      case 'beforeUpdate':
        return 'blue';
      case 'beforeDelete':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatAction = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
  };

  const timelineItems = logs.map((log: AuditLog) => ({
    key: log.id,
    color: getActionColor(log.action),
    children: (
      <div className='space-y-2'>
        <div className='flex justify-between items-start'>
          <div>
            <Text strong className='text-base'>
              {formatAction(log.action)} Record
            </Text>
            {log.assigned_user && (
              <div className='mt-1'>
                <Text type='secondary' className='text-sm'>
                  by {log.assigned_user.username || log.assigned_user.email}
                </Text>
              </div>
            )}
          </div>
          <Text type='secondary' className='text-xs'>
            {dayjs(log.createdAt).format('MMM DD, YYYY HH:mm:ss')}
          </Text>
        </div>

        {log.data && Object.keys(log.data).length > 0 && (
          <div className='mt-2'>
            <Collapse
              size='small'
              ghost
              items={[
                {
                  key: 'changes',
                  label: (
                    <Text type='secondary' className='text-xs font-medium'>
                      Changes ({Object.keys(log.data).length} fields)
                    </Text>
                  ),
                  children: (
                    <div className='bg-gray-50 p-3 rounded-md'>
                      {Object.entries(log.data).map(([key, value]) => (
                        <div key={key} className='text-xs mb-1'>
                          <Text code>{key}</Text>: {JSON.stringify(value)}
                        </div>
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>
    ),
  }));

  return (
    <div className='p-4'>
      <h4 className='text-lg font-semibold mb-4'>Audit Log</h4>
      <Timeline mode='left' items={timelineItems} className='mt-4' />

      {pagination.total > 0 && (
        <div className='mt-6 flex justify-center'>
          <Pagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} audit logs`
            }
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            pageSizeOptions={['5', '10', '20', '50']}
            size='small'
          />
        </div>
      )}
    </div>
  );
}
