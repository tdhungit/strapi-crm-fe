import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, List } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FirebaseService from '../../services/FirebaseService';
import SupabaseService from '../../services/SupabaseService';
import type { RootState } from '../../stores';

interface NotificationSubscriptionType {
  unsubscribe: () => void;
  markRead: (key: string) => Promise<void>;
  markAllRead: (allMessages?: any[]) => Promise<void>;
}

export default function UserNotification({ user }: { user: any }) {
  const { notification } = App.useApp();

  const settings = useSelector((state: RootState) => state?.app).settings;

  const [messages, setMessages] = useState<any[]>([]);
  const [subscription, setSubscription] =
    useState<NotificationSubscriptionType | null>(null);

  const firebaseNotificationListener =
    async (): Promise<NotificationSubscriptionType> => {
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
            update(ref(db, `/notifications/${user.id}/${key}`), {
              pushed: true,
            });
          }
        }
      });

      return {
        unsubscribe: () => {
          unsubscribe();
        },
        markRead: async (key: string) => {
          await update(ref(db, `/notifications/${user.id}/${key}`), {
            read: true,
          });
        },
        markAllRead: async (allMessages?: any[]) => {
          const noReadMessages = allMessages || messages;
          for await (const message of noReadMessages) {
            await update(ref(db, `/notifications/${user.id}/${message.key}`), {
              read: true,
            });
          }
          setMessages([]);
        },
      };
    };

  const supabaseNotificationListener =
    async (): Promise<NotificationSubscriptionType> => {
      const supabase = await SupabaseService.getApp();

      const res = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false);

      const noReadMessages = res.data || [];
      setMessages(noReadMessages);

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
        markRead: async (key: string) => {
          await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', key);
        },
        markAllRead: async () => {
          for await (const message of noReadMessages) {
            await supabase
              .from('notifications')
              .update({ read: true })
              .eq('id', message.key || message.id);
          }
        },
      };
    };

  const notificationListener =
    async (): Promise<NotificationSubscriptionType> => {
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

    let unsubscribeFn: NotificationSubscriptionType | null = null;
    let canceled = false;

    notificationListener()
      .then((listener) => {
        if (canceled) {
          // Component đã unmount, cleanup ngay lập tức nếu có thể
          if (listener.unsubscribe) listener.unsubscribe();
          return;
        }
        unsubscribeFn = listener;
        setSubscription(listener);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      canceled = true;
      if (unsubscribeFn && unsubscribeFn.unsubscribe) {
        unsubscribeFn.unsubscribe();
      }
    };
  }, [user?.id, settings?.notificationService]);

  return (
    <>
      <Dropdown
        popupRender={(originNode) => (
          <div className='w-[300px] bg-white rounded-md border-gray-400 shadow-md'>
            <div className='flex justify-between items-center'>
              <div className='font-semibold text-xl px-4 pt-2'>
                Notifications
              </div>
              <div>
                <Button
                  type='text'
                  onClick={() => {
                    subscription?.markAllRead(messages).then(() => {
                      setMessages([]);
                    });
                  }}
                  disabled={messages.length === 0}
                >
                  Mark all as read
                </Button>
              </div>
            </div>
            <List
              dataSource={messages}
              renderItem={(item) => (
                <List.Item style={{ padding: 16 }}>
                  <List.Item.Meta
                    avatar={<BellOutlined />}
                    title={item.title}
                    description={item.body}
                  />
                  <Button
                    type='text'
                    icon={<CloseOutlined />}
                    onClick={() =>
                      subscription?.markRead(item.key || item.id).then(() => {
                        setMessages((prev) => {
                          const pos = prev.findIndex(
                            (message) =>
                              message.key === item.key || message.id === item.id
                          );
                          if (pos >= 0) prev.splice(pos, 1);
                          return [...prev];
                        });
                      })
                    }
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
