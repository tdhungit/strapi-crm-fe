import { BellOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, List } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FirebaseService from '../../services/FirebaseService';
import SupabaseService from '../../services/SupabaseService';
import type { RootState } from '../../stores';

export default function UserNotification({ user }: { user: any }) {
  const { notification } = App.useApp();

  const settings = useSelector((state: RootState) => state?.app).settings;

  const [messages, setMessages] = useState<any[]>([]);

  const firebaseNotificationListener = async () => {
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

  const supabaseNotificationListener = async () => {
    const supabase = await SupabaseService.getApp();

    await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('read', false)
      .then((res: any) => {
        setMessages(res.data);
      });

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const notificationRes: any = payload.new;
          const notificationId = notificationRes.id;

          if (!notificationRes.read) {
            const pos = messages.findIndex(
              (item) => item.id === notificationId
            );
            if (pos < 0) {
              setMessages((prev) => [
                ...prev,
                { key: notificationId, ...notificationRes },
              ]);
            }
          }

          notification.open({
            message: notificationRes.title,
            description: notificationRes.body,
          });

          // Mark as pushed
          supabase
            .from('notifications')
            .update({ pushed: true })
            .eq('id', notificationId)
            .then();
        }
      )
      .subscribe((status) => console.log('CHANNEL STATUS:', status));

    return {
      unsubscribe: () => {
        supabase.removeChannel(subscription);
      },
    };
  };

  const notificationListener = async () => {
    let unsubscribe: any;
    if (settings?.notificationService === 'firebase') {
      unsubscribe = await firebaseNotificationListener();
    } else if (settings?.notificationService === 'supabase') {
      unsubscribe = await supabaseNotificationListener();
    }
    return unsubscribe;
  };

  useEffect(() => {
    if (!user?.id || !settings?.notificationService) return;

    let unsubscribe: any;
    notificationListener()
      .then((listener) => {
        console.log('listener', settings.notificationService, user.id);
        unsubscribe = listener;
      })
      .catch((err) => {
        console.error(err);
      });

    // cleanup listener khi component unmount
    if (unsubscribe) {
      if (settings?.notificationService === 'firebase') {
        return () => unsubscribe();
      } else if (settings?.notificationService === 'supabase') {
        return () => unsubscribe.unsubscribe();
      }
    }
  }, [user?.id, settings?.notificationService]);

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
