import { EditOutlined } from '@ant-design/icons';
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';
import { getWidget } from '../../collections/widgets';
import AddDashboardItemModal from './AddDashboardItemModal';
import DashboardItemFilterBuilder from './DashboardItemFilterBuilder';
import DashboardItemQueryView from './DashboardItemQueryView';

export default function DashboardViews({
  dashboardId,
  openAddItem,
  setOpenAddItem,
  resetAddItemForm,
  setResetAddItemForm,
}: {
  dashboardId: string;
  openAddItem: boolean;
  setOpenAddItem: (open: boolean) => void;
  resetAddItemForm?: boolean;
  setResetAddItemForm?: (reset: boolean) => void;
}) {
  const [dashboard, setDashboard] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isChangeWeight, setIsChangeWeight] = useState(false);

  const loadDashboard = useCallback(() => {
    ApiService.getClient()
      .collection('dashboards')
      .findOne(dashboardId, {
        populate: {
          dashboard_items: {
            sort: 'weight:asc',
          },
        },
      })
      .then((res) => {
        setDashboard(res.data);
        // Sort items by order field if it exists
        const sortedItems = (res.data.dashboard_items || []).sort(
          (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
        );
        setItems(sortedItems);
      });
  }, [dashboardId]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      return newItems;
    });
    setIsChangeWeight(true);
  }, []);

  const saveItemOrder = useCallback(async () => {
    try {
      // Save the new order to the backend
      const updatePromises = items.map((item, index) => {
        return ApiService.getClient()
          .collection('dashboard-items')
          .update(item.documentId, { weight: index });
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Failed to save item order:', error);
    }
  }, [items]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      moveItem(result.source.index, result.destination.index);
    },
    [moveItem]
  );

  // Save order when items change
  useEffect(() => {
    if (isChangeWeight === true && items.length > 0 && dashboard.id) {
      setIsChangeWeight(false);
      saveItemOrder();
    }
  }, [isChangeWeight]);

  useEffect(() => {
    if (dashboardId) {
      loadDashboard();
    }
  }, [dashboardId, loadDashboard]);

  const handleItemFinish = useCallback(() => {
    loadDashboard();
  }, [loadDashboard]);

  const WidgetComponent = (props: any) => {
    const { item } = props;

    if (item?.type === 'Query') {
      return <DashboardItemQueryView item={item} />;
    }

    if (item?.type === 'Builder') {
      return <DashboardItemFilterBuilder item={item} />;
    }

    if (!item?.widget || !item?.metadata?.module) {
      return null;
    }

    const Widget = getWidget(item.metadata.module, item.widget);
    return <Widget module={item.metadata.module} {...props} />;
  };

  useEffect(() => {
    if (resetAddItemForm) {
      setSelectedItem(null);
      setResetAddItemForm?.(false);
    }
  }, [resetAddItemForm]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='dashboard-items' direction='horizontal'>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 16,
              marginTop: 0,
            }}
          >
            {items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      marginBottom: 0,
                      backgroundColor: '#fff',
                      borderRadius: 8,
                      boxShadow: snapshot.isDragging
                        ? '0 8px 16px rgba(0,0,0,0.2)'
                        : '0 2px 8px rgba(0,0,0,0.1)',
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                        paddingBottom: 8,
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: 16 }}>{item.title}</h3>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setOpenAddItem(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#1890ff',
                        }}
                      >
                        <EditOutlined />
                      </button>
                    </div>
                    <WidgetComponent
                      item={item}
                      height={item.height || 300}
                      title={item.title}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <AddDashboardItemModal
        open={openAddItem}
        onOpenChange={setOpenAddItem}
        dashboard={dashboard}
        onFinish={handleItemFinish}
        item={selectedItem}
      />
    </DragDropContext>
  );
}
