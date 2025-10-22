import { BellOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, List } from 'antd';
import { useEffect, useState } from 'react';
import FirebaseService from '../../services/FirebaseService';

export default function UserNotification({ user }: { user: any }) {
  const { notification } = App.useApp();

  const [messages, setMessages] = useState<any[]>([]);

  const notificationListener = async () => {
    const { ref, db, onChildAdded, update, query, orderByChild, equalTo } =
      await FirebaseService.getApp();

    const unreadNotiQuery = query(
      ref(db, `/notifications/${user.id}`),
      orderByChild('read'),
      equalTo(false)
    );

    const unsubscribe = onChildAdded(unreadNotiQuery, (snapshot) => {
      const data = snapshot.val();
      const key = snapshot.key;
      if (data && data.title && data.body) {
        if (!data.read) {
          const pos = messages.findIndex((item) => item.key === key);
          if (pos < 0) {
            setMessages((prev) => [...prev, { key, ...data }]);
          }
        }

        if (!data.pushed) {
          notification.open({
            message: data.title,
            description: data.body,
          });
          // Mark as pushed
          update(ref(db, `/notifications/${user.id}/${key}`), { pushed: true });
        }
      }
    });

    return unsubscribe;
  };

  useEffect(() => {
    if (!user?.id) return;

    let unsubscribe: any;
    notificationListener()
      .then((listener) => {
        unsubscribe = listener;
      })
      .catch((err) => {
        console.error(err);
      });

    // cleanup listener khi component unmount
    if (unsubscribe) {
      return () => unsubscribe();
    }
  }, [user?.id]);

  return (
    <>
      <Dropdown
        popupRender={(originNode) => (
          <div className='w-[300px] bg-white rounded-md border-gray-400 shadow-md'>
            <div className='font-semibold text-xl px-4 pt-2'>Notifications</div>
            <List
              dataSource={messages}
              renderItem={(item) => (
                <List.Item style={{ padding: 16 }}>
                  <List.Item.Meta
                    avatar={<BellOutlined />}
                    title={item.title}
                    description={item.body}
                  />
                </List.Item>
              )}
            />
            {originNode}
          </div>
        )}
        trigger={['click']}
      >
        <Button
          type='text'
          icon={<BellOutlined style={{ color: 'black' }} />}
          style={{
            fontSize: '16px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            color: 'red',
          }}
        >
          {messages.length || 0}
        </Button>
      </Dropdown>
    </>
  );
}
