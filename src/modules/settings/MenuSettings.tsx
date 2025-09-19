import { EditOutlined, HolderOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  closestCenter,
  DndContext,
  DragOverlay,
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
import { Button, Col, List, Row, Spin, Typography } from 'antd';
import { Card } from 'antd/lib';
import { useEffect, useState } from 'react';
import { defaultMenus } from '../../config/menus';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import MenuService from '../../services/MenuService';
import MenuModalForm from './components/MenuModalForm';

const { Text } = Typography;

function SortableItem({
  menu,
  listType,
  onEdit,
  isDragging = false,
}: {
  menu: any;
  listType: 'available' | 'hidden';
  onEdit: (menu: any) => void;
  isDragging?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: menu.key,
    data: {
      type: listType,
      menu,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isSortableDragging ? 0.5 : 1,
    zIndex: isSortableDragging ? 1000 : 'auto',
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(menu);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        ${isSortableDragging ? 'shadow-lg' : ''}
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <List.Item
        className={`
          transition-all duration-200 ease-in-out
          hover:bg-gray-50 
          ${isSortableDragging ? 'bg-blue-50 border-blue-300 shadow-md' : ''}
          border border-gray-200 rounded-md mb-2 px-3 py-2
        `}
        style={{
          cursor: isSortableDragging ? 'grabbing' : 'default',
        }}
      >
        <div className='flex items-center w-full'>
          <div
            {...listeners}
            className='flex items-center mr-3 p-1 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing'
            style={{ cursor: isSortableDragging ? 'grabbing' : 'grab' }}
          >
            <HolderOutlined className='text-gray-400' />
          </div>
          <div className='flex-1'>
            <List.Item.Meta
              title={
                <Text strong className='text-gray-800'>
                  {menu.label}
                </Text>
              }
              description={
                <Text type='secondary' className='text-xs'>
                  {menu.key}
                </Text>
              }
            />
          </div>
          <Button
            type='text'
            icon={<EditOutlined />}
            onClick={handleEditClick}
            className='ml-2 hover:bg-blue-50 hover:text-blue-600'
            size='small'
          />
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
      className={`
        min-h-[300px] p-4 rounded-lg transition-all duration-300 ease-in-out
        ${
          isOver
            ? 'bg-blue-50 border-2 border-dashed border-blue-400 shadow-inner'
            : 'bg-gray-50 border-2 border-dashed border-gray-200'
        }
      `}
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
  const [activeId, setActiveId] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleEditMenu = (menu: any) => {
    setEditingItem(menu);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingItem(null);
  };

  const handleModalSave = async (values: any) => {
    setModalLoading(true);
    try {
      // Update the item in the appropriate list
      if (editingItem) {
        const updatedItem = { ...editingItem, ...values };

        // Check if item is in available or hidden list
        const isInAvailable = items.some(
          (item) => item.key === editingItem.key
        );
        const isInHidden = hiddenItems.some(
          (item) => item.key === editingItem.key
        );

        if (isInAvailable) {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.key === editingItem.key ? updatedItem : item
            )
          );
          setShouldSave(true);
        } else if (isInHidden) {
          setHiddenItems((prevItems) =>
            prevItems.map((item) =>
              item.key === editingItem.key ? updatedItem : item
            )
          );
        }

        console.log('Menu item updated:', updatedItem);
      }
    } catch (error) {
      console.error('Failed to update menu item:', error);
    } finally {
      setModalLoading(false);
      setModalVisible(false);
      setEditingItem(null);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle dropping on drop zones
    if (overId === 'available-dropzone' || overId === 'hidden-dropzone') {
      const targetListType =
        overId === 'available-dropzone' ? 'available' : 'hidden';

      if (activeData?.type !== targetListType) {
        if (activeData?.type === 'available' && targetListType === 'hidden') {
          // Move from available to hidden
          const itemToMove = items.find((item) => item.key === activeId);
          if (itemToMove) {
            setItems((items) => items.filter((item) => item.key !== activeId));
            setHiddenItems((hiddenItems) => [...hiddenItems, itemToMove]);
            setShouldSave(true);
          }
        } else if (
          activeData?.type === 'hidden' &&
          targetListType === 'available'
        ) {
          // Move from hidden to available
          const itemToMove = hiddenItems.find((item) => item.key === activeId);
          if (itemToMove) {
            setHiddenItems((hiddenItems) =>
              hiddenItems.filter((item) => item.key !== activeId)
            );
            setItems((items) => {
              const newItems = [
                ...items,
                { ...itemToMove, weight: items.length + 1 },
              ];
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
            const oldIndex = hiddenItems.findIndex(
              (item) => item.key === activeId
            );
            const newIndex = hiddenItems.findIndex(
              (item) => item.key === overId
            );
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
      } else if (
        activeData?.type === 'hidden' &&
        overData?.type === 'available'
      ) {
        // Move from hidden to available
        const itemToMove = hiddenItems.find((item) => item.key === activeId);
        if (itemToMove) {
          setHiddenItems((hiddenItems) =>
            hiddenItems.filter((item) => item.key !== activeId)
          );
          setItems((items) => {
            const newItems = [
              ...items,
              { ...itemToMove, weight: items.length + 1 },
            ];
            return newItems;
          });
          setShouldSave(true);
        }
      }
    }
  };

  const saveMenuWeights = async (itemsWithWeights: any[]) => {
    try {
      // Fix
      const fixedItems: any[] = [];
      itemsWithWeights.forEach((item) => {
        const fixedItem = defaultMenus[item.collection] || {
          children: [
            {
              key: `/collections/${item.collection}`,
              label: `${item.label} List`,
            },
            {
              key: `/collections/${item.collection}/create`,
              label: `Create ${item.label}`,
            },
          ],
        };
        fixedItems.push({
          ...fixedItem,
          ...item,
        });
      });
      // console.log('Saving menu weights:', fixedItems);
      await MenuService.updateMenuWeights(fixedItems);
    } catch (error) {
      console.error('Failed to save menu weights:', error);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <PageContainer
      header={{
        title: 'Menu Settings',
        subTitle: 'Configure your menu settings here.',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: 'Settings',
              href: '/settings',
            },
            {
              title: 'Menu Settings',
              href: '/settings/menus',
            },
          ],
          itemRender: breadcrumbItemRender,
        },
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <Row gutter={24} className='mt-6'>
          <Col span={12}>
            <Card
              title={
                <div className='flex items-center'>
                  <div className='w-3 h-3 bg-green-500 rounded-full mr-2'></div>
                  <Text strong>Available Menu Items</Text>
                  <Text type='secondary' className='ml-2'>
                    ({items.length})
                  </Text>
                </div>
              }
              className='shadow-sm'
              bodyStyle={{ padding: '12px' }}
            >
              <DropZone listType='available'>
                <SortableContext
                  items={items?.map((item) => item.key) || []}
                  strategy={verticalListSortingStrategy}
                >
                  {items.length === 0 ? (
                    <div className='text-center py-8 text-gray-400'>
                      <Text type='secondary'>No available menu items</Text>
                      <br />
                      <Text type='secondary' className='text-xs'>
                        Drag items from hidden list to make them available
                      </Text>
                    </div>
                  ) : (
                    <div className='space-y-1'>
                      {items.map((menu) => (
                        <SortableItem
                          key={menu.key}
                          menu={menu}
                          listType='available'
                          onEdit={handleEditMenu}
                          isDragging={activeId === menu.key}
                        />
                      ))}
                    </div>
                  )}
                </SortableContext>
              </DropZone>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={
                <div className='flex items-center'>
                  <div className='w-3 h-3 bg-gray-400 rounded-full mr-2'></div>
                  <Text strong>Hidden Menu Items</Text>
                  <Text type='secondary' className='ml-2'>
                    ({hiddenItems.length})
                  </Text>
                </div>
              }
              className='shadow-sm'
              bodyStyle={{ padding: '12px' }}
            >
              <DropZone listType='hidden'>
                <SortableContext
                  items={hiddenItems?.map((item) => item.key) || []}
                  strategy={verticalListSortingStrategy}
                >
                  {hiddenItems.length === 0 ? (
                    <div className='text-center py-8 text-gray-400'>
                      <Text type='secondary'>No hidden menu items</Text>
                      <br />
                      <Text type='secondary' className='text-xs'>
                        Drag items from available list to hide them
                      </Text>
                    </div>
                  ) : (
                    <div className='space-y-1'>
                      {hiddenItems.map((menu) => (
                        <SortableItem
                          key={menu.key}
                          menu={menu}
                          listType='hidden'
                          onEdit={handleEditMenu}
                          isDragging={activeId === menu.key}
                        />
                      ))}
                    </div>
                  )}
                </SortableContext>
              </DropZone>
            </Card>
          </Col>
        </Row>

        <DragOverlay>
          {activeId ? (
            <div className='transform rotate-3 shadow-2xl'>
              <SortableItem
                menu={
                  [...items, ...hiddenItems].find(
                    (item) => item.key === activeId
                  ) || {}
                }
                listType='available'
                onEdit={() => {}}
                isDragging={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <MenuModalForm
        visible={modalVisible}
        menuItem={editingItem}
        onCancel={handleModalCancel}
        onSave={handleModalSave}
        loading={modalLoading}
      />
    </PageContainer>
  );
}
