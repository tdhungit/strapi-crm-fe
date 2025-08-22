import { UnorderedListOutlined } from '@ant-design/icons';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Col, List, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import MenuService from '../../services/MenuService';

function SortableItem({ menu, listType }: { menu: any; listType: 'available' | 'hidden' }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: menu.key,
    data: {
      type: listType,
      menu,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <List.Item {...listeners}>
        <List.Item.Meta title={<strong>{menu.label}</strong>} description={menu.key} />
        <div>
          <UnorderedListOutlined />
        </div>
      </List.Item>
    </div>
  );
}

function DropZone({
  listType,
  children,
}: {
  listType: 'available' | 'hidden';
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${listType}-dropzone`,
    data: {
      type: listType,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] ${isOver ? 'bg-blue-50 border-2 border-blue-300' : ''}`}
    >
      {children}
    </div>
  );
}

export default function MenuSettings() {
  const [items, setItems] = useState<any[]>([]);
  const [hiddenItems, setHiddenItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shouldSave, setShouldSave] = useState(false);

  useEffect(() => {
    MenuService.getAvailableMenuItems().then((menus) => {
      // Add weight property if it doesn't exist, based on current order
      const menusWithWeight = menus.map((menu: any, index: number) => ({
        ...menu,
        weight: menu.weight || index + 1,
      }));
      setItems(menusWithWeight);
      setLoading(false);
    });

    MenuService.getHiddenMenuItems().then((hiddenItems) => {
      setHiddenItems(hiddenItems);
    });
  }, []);

  // Save weights when items change and shouldSave is true
  useEffect(() => {
    if (shouldSave && items.length > 0) {
      saveMenuWeights(items);
      setShouldSave(false);
    }
  }, [items, shouldSave]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle dropping on drop zones
    if (overId === 'available-dropzone' || overId === 'hidden-dropzone') {
      const targetListType = overId === 'available-dropzone' ? 'available' : 'hidden';

      if (activeData?.type !== targetListType) {
        if (activeData?.type === 'available' && targetListType === 'hidden') {
          // Move from available to hidden
          const itemToMove = items.find((item) => item.key === activeId);
          if (itemToMove) {
            setItems((items) => items.filter((item) => item.key !== activeId));
            setHiddenItems((hiddenItems) => [...hiddenItems, itemToMove]);
            setShouldSave(true);
          }
        } else if (activeData?.type === 'hidden' && targetListType === 'available') {
          // Move from hidden to available
          const itemToMove = hiddenItems.find((item) => item.key === activeId);
          if (itemToMove) {
            setHiddenItems((hiddenItems) => hiddenItems.filter((item) => item.key !== activeId));
            setItems((items) => {
              const newItems = [...items, { ...itemToMove, weight: items.length + 1 }];
              return newItems;
            });
            setShouldSave(true);
          }
        }
      }
      return;
    }

    // If dragging within the same list
    if (activeData?.type === overData?.type) {
      if (activeId !== overId) {
        if (activeData.type === 'available') {
          setItems((items) => {
            const oldIndex = items.findIndex((item) => item.key === activeId);
            const newIndex = items.findIndex((item) => item.key === overId);
            const reorderedItems = arrayMove(items, oldIndex, newIndex);

            // Update weight property based on new position
            const updatedItems = reorderedItems.map((item, index) => ({
              ...item,
              weight: index + 1,
            }));

            return updatedItems;
          });
          setShouldSave(true);
        } else {
          setHiddenItems((hiddenItems) => {
            const oldIndex = hiddenItems.findIndex((item) => item.key === activeId);
            const newIndex = hiddenItems.findIndex((item) => item.key === overId);
            return arrayMove(hiddenItems, oldIndex, newIndex);
          });
        }
      }
    } else {
      // Moving between lists
      if (activeData?.type === 'available' && overData?.type === 'hidden') {
        // Move from available to hidden
        const itemToMove = items.find((item) => item.key === activeId);
        if (itemToMove) {
          setItems((items) => items.filter((item) => item.key !== activeId));
          setHiddenItems((hiddenItems) => [...hiddenItems, itemToMove]);
          setShouldSave(true);
        }
      } else if (activeData?.type === 'hidden' && overData?.type === 'available') {
        // Move from hidden to available
        const itemToMove = hiddenItems.find((item) => item.key === activeId);
        if (itemToMove) {
          setHiddenItems((hiddenItems) => hiddenItems.filter((item) => item.key !== activeId));
          setItems((items) => {
            const newItems = [...items, { ...itemToMove, weight: items.length + 1 }];
            return newItems;
          });
          setShouldSave(true);
        }
      }
    }
  };

  const saveMenuWeights = async (itemsWithWeights: any[]) => {
    try {
      // You can implement this method in MenuService
      await MenuService.updateMenuWeights(itemsWithWeights);
    } catch (error) {
      console.error('Failed to save menu weights:', error);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-2'>Menu Settings</h1>
      <p className='text-gray-600'>Configure your menu settings here.</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Row gutter={16} className='mt-4'>
          <Col span={12}>
            <DropZone listType='available'>
              <SortableContext
                items={items?.map((item) => item.key) || []}
                strategy={verticalListSortingStrategy}
              >
                <List
                  dataSource={items || []}
                  renderItem={(menu) => <SortableItem menu={menu} listType='available' />}
                  locale={{ emptyText: 'No available menu items.' }}
                  bordered
                  size='small'
                  header={<div className='text-sm font-bold'>Available Menu Items</div>}
                  className='bg-white'
                />
              </SortableContext>
            </DropZone>
          </Col>
          <Col span={12}>
            <DropZone listType='hidden'>
              <SortableContext
                items={hiddenItems?.map((item) => item.key) || []}
                strategy={verticalListSortingStrategy}
              >
                <List
                  dataSource={hiddenItems || []}
                  renderItem={(menu) => <SortableItem menu={menu} listType='hidden' />}
                  locale={{ emptyText: 'No hidden menu items.' }}
                  bordered
                  size='small'
                  header={<div className='text-sm font-bold'>Hidden Menu Items</div>}
                  className='bg-white'
                />
              </SortableContext>
            </DropZone>
          </Col>
        </Row>
      </DndContext>
    </div>
  );
}
