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

export default function DashboardViews({
  dashboardId,
  openAddItem,
  setOpenAddItem,
}: {
  dashboardId: string;
  openAddItem: boolean;
  setOpenAddItem: (open: boolean) => void;
}) {
  const [dashboard, setDashboard] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);

  const loadDashboard = useCallback(() => {
    ApiService.getClient()
      .collection('dashboards')
      .findOne(dashboardId, {
        populate: ['dashboard_items'],
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
  }, []);

  const saveItemOrder = useCallback(async () => {
    try {
      // Save the new order to the backend
      const updatePromises = items.map((item, index) => {
        return ApiService.getClient()
          .collection('dashboard-items')
          .update(item.id, { order: index });
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
    if (items.length > 0 && dashboard.id) {
      saveItemOrder();
    }
  }, [items, dashboard.id, saveItemOrder]);

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
    if (!item?.widget || !item?.metadata?.module) {
      return null;
    }

    const Widget = getWidget(item.metadata.module, item.widget);
    return <Widget module={item.metadata.module} {...props} />;
  };

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
              gap: 24,
              marginTop: 16,
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
                      marginBottom: 24,
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
                        onClick={() => setOpenAddItem(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 18,
                          color: '#1890ff',
                        }}
                      >
                        ✏️
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
      />
    </DragDropContext>
  );
}
