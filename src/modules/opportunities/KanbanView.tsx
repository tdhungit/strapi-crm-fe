import { DatabaseFilled, DollarOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, Badge, Button, Card, Empty, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';

const { Text } = Typography;

interface StageStatistics {
  [key: string]: number;
}

interface Opportunity {
  id: string;
  name: string;
  stage: string;
  amount?: number;
  account?: any;
  assigned_user?: any;
  createdAt: string;
  [key: string]: any;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  isDragging?: boolean;
}

function OpportunityCard({ opportunity, isDragging }: OpportunityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: opportunity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.8 : 1,
  };

  const accountName = opportunity?.account?.name || 'N/A';

  // Generate a color based on the opportunity name for visual variety
  const getCardColor = (name: string) => {
    const colors = [
      'border-l-blue-400',
      'border-l-purple-400',
      'border-l-green-400',
      'border-l-orange-400',
      'border-l-pink-400',
      'border-l-indigo-400',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        size='small'
        className={`mb-2 cursor-grab hover:shadow-md transition-all duration-200 border-l-3 ${getCardColor(
          opportunity.name
        )} bg-white`}
        styles={{
          body: {
            padding: 8,
          },
        }}
      >
        <div className='space-y-1.5'>
          <Text
            strong
            className='block text-xs text-gray-800 leading-tight line-clamp-2'
          >
            {opportunity.name}
          </Text>

          {accountName && (
            <div className='flex items-center space-x-1'>
              <Avatar
                size={16}
                className='bg-blue-500'
                style={{ fontSize: '9px', minWidth: '16px', marginRight: 2 }}
              >
                {accountName.charAt(0).toUpperCase()}
              </Avatar>
              <Text
                type='secondary'
                className='text-xs text-gray-600 truncate flex-1'
              >
                {accountName}
              </Text>
            </div>
          )}

          {opportunity.amount && (
            <div className='flex items-center space-x-1'>
              <DollarOutlined className='text-green-600 text-xs' />
              <Text className='text-xs font-medium text-green-700'>
                ${opportunity.amount.toLocaleString()}
              </Text>
            </div>
          )}

          {opportunity.assigned_user?.username && (
            <div className='flex items-center space-x-1'>
              <Avatar
                size={16}
                className='bg-blue-500'
                style={{ fontSize: '9px', minWidth: '16px', marginRight: 2 }}
              >
                {opportunity.assigned_user.username.charAt(0).toUpperCase()}
              </Avatar>
              <Text
                type='secondary'
                className='text-xs text-gray-600 truncate flex-1'
              >
                {opportunity.assigned_user.username}
              </Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

interface KanbanColumnProps {
  stage: string;
  count: number;
  opportunities: Opportunity[];
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

function KanbanColumn({
  stage,
  count,
  opportunities,
  loading,
  onLoadMore,
  hasMore,
}: KanbanColumnProps) {
  // Generate stage-specific colors
  const getStageColor = (stageName: string) => {
    const stageColors: { [key: string]: string } = {
      Prospecting: 'from-blue-500 to-blue-600',
      Qualification: 'from-purple-500 to-purple-600',
      Proposal: 'from-orange-500 to-orange-600',
      Negotiation: 'from-red-500 to-red-600',
      'Closed Won': 'from-green-500 to-green-600',
      'Needs Analysis': 'from-indigo-500 to-indigo-600',
    };
    return stageColors[stageName] || 'from-gray-500 to-gray-600';
  };

  const getBadgeColor = (stageName: string) => {
    const badgeColors: { [key: string]: string } = {
      Prospecting: '#3b82f6',
      Qualification: '#8b5cf6',
      Proposal: '#f97316',
      Negotiation: '#ef4444',
      'Closed Won': '#10b981',
      'Needs Analysis': '#6366f1',
    };
    return badgeColors[stageName] || '#6b7280';
  };

  return (
    <Card
      size='small'
      className='max-h-[800px] w-64 flex-shrink-0'
      title={
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div
              className={`w-2 h-6 rounded-full bg-gradient-to-b ${getStageColor(
                stage
              )}`}
            ></div>
            <div className='flex items-baseline space-x-2'>
              <span className='text-sm font-medium text-gray-800'>{stage}</span>
            </div>
          </div>
        </div>
      }
      extra={[
        <Badge
          key={`stage-${stage}-count`}
          count={count}
          size='small'
          style={{
            backgroundColor: getBadgeColor(stage),
            fontSize: '10px',
          }}
        />,
      ]}
      styles={{
        body: {
          padding: '8px',
          height: '740px',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <div className='flex flex-col h-full'>
        <SortableContext
          items={opportunities.map((op) => op.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className='space-y-1 flex-1 overflow-y-auto'
            style={{ scrollbarWidth: 'thin' }}
          >
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}

            {loading && (
              <div className='text-center py-4'>
                <Spin size='small' />
                <Text type='secondary' className='block mt-2 text-xs'>
                  Loading...
                </Text>
              </div>
            )}

            {opportunities.length === 0 && !loading && (
              <div className='text-center py-8'>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Text type='secondary' className='text-xs'>
                      No opportunities
                    </Text>
                  }
                />
              </div>
            )}
          </div>
        </SortableContext>

        {hasMore && !loading && (
          <div className='mt-2 pt-2 border-t border-gray-100'>
            <Button
              type='dashed'
              block
              onClick={onLoadMore}
              className='text-xs'
              size='small'
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function KanbanView() {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState<StageStatistics>({});
  const [opportunitiesByStage, setOpportunitiesByStage] = useState<{
    [key: string]: Opportunity[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [loadingStages, setLoadingStages] = useState<{
    [key: string]: boolean;
  }>({});
  const [pagination, setPagination] = useState<{
    [key: string]: { page: number; hasMore: boolean };
  }>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fetchStatistics = async () => {
    try {
      const res = await ApiService.request(
        'get',
        '/opportunities/stage/statistics'
      );
      setStatistics(res || {});
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      setStatistics({});
    }
  };

  const fetchData = async (
    stage: string,
    params: {
      pageSize: number;
      page: number;
      filters: { [key: string]: any };
    }
  ) => {
    const filters = params.filters || {};
    filters.stage = stage;

    try {
      const res = await ApiService.getClient()
        .collection('opportunities')
        .find({
          pagination: {
            pageSize: params.pageSize,
            page: params.page,
          },
          // sort: 'created_at desc',
          filters,
          populate: ['account', 'assigned_user'],
        });
      return res;
    } catch (error) {
      console.error(`Failed to fetch data for stage ${stage}:`, error);
      // Return empty data structure as fallback
      return {
        data: [],
        meta: {
          pagination: {
            pageSize: params.pageSize,
            page: params.page,
            total: 0,
            pageCount: 0,
          },
        },
      };
    }
  };

  const loadOpportunities = async (
    stage: string,
    page: number = 1,
    append: boolean = false
  ) => {
    setLoadingStages((prev) => ({ ...prev, [stage]: true }));

    const result = await fetchData(stage, {
      pageSize: 5,
      page,
      filters: {},
    });

    const newOpportunities = (result.data || []) as unknown as Opportunity[];

    setOpportunitiesByStage((prev) => ({
      ...prev,
      [stage]: append
        ? [...(prev[stage] || []), ...newOpportunities]
        : newOpportunities,
    }));

    const totalPages = result.meta?.pagination?.pageCount || 1;
    setPagination((prev) => ({
      ...prev,
      [stage]: {
        page,
        hasMore: page < totalPages,
      },
    }));

    setLoadingStages((prev) => ({ ...prev, [stage]: false }));
  };

  const handleLoadMore = (stage: string) => {
    const currentPage = pagination[stage]?.page || 1;
    loadOpportunities(stage, currentPage + 1, true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle stage change logic here
    console.log('Move opportunity', active, 'to stage', over);
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchStatistics();
      setLoading(false);
    };

    initializeData();
  }, []);

  useEffect(() => {
    // Load initial data for each stage
    Object.keys(statistics).forEach((stage) => {
      loadOpportunities(stage);
    });
  }, [statistics]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    );
  }

  const activeOpportunity = activeId
    ? Object.values(opportunitiesByStage)
        .flat()
        .find((op) => op.id === activeId)
    : null;

  return (
    <PageContainer
      header={{
        title: 'Opportunities',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: 'Opportunities List',
              href: `/collections/opportunities`,
            },
            {
              title: 'Kanban View',
            },
          ],
        },
      }}
      extra={[
        <Button
          key='opportunities-list'
          type='default'
          onClick={() => navigate('/collections/opportunities')}
        >
          <DatabaseFilled />
        </Button>,
      ]}
    >
      <div className='p-0'>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            className='flex space-x-3 overflow-x-auto pb-4'
            style={{ scrollbarWidth: 'thin' }}
          >
            {Object.entries(statistics).map(([stage, count]) => (
              <KanbanColumn
                key={stage}
                stage={stage}
                count={count}
                opportunities={opportunitiesByStage[stage] || []}
                loading={loadingStages[stage] || false}
                onLoadMore={() => handleLoadMore(stage)}
                hasMore={pagination[stage]?.hasMore || false}
              />
            ))}
          </div>

          <DragOverlay>
            {activeOpportunity && (
              <div className='rotate-3 scale-105'>
                <OpportunityCard opportunity={activeOpportunity} isDragging />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </PageContainer>
  );
}
