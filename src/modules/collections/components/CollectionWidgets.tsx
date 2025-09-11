import { SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';
import { getWidget } from '../widgets';

export default function CollectionWidgets({ module }: { module: string }) {
  const [widgets, setWidgets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConfigWidgets = async () => {
    try {
      const setting = await ApiService.request('get', '/settings/user', {
        name: 'widgets',
      });
      return setting?.widgets?.[module] || [];
    } catch (error) {
      console.error('Failed to fetch widget config:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadWidgets = async () => {
      setLoading(true);
      const configuredWidgets = await fetchConfigWidgets();
      setWidgets(configuredWidgets);
      setLoading(false);
    };

    if (module) {
      loadWidgets();
    }
  }, [module]);

  if (loading) {
    return <div className='p-4'>Loading widgets...</div>;
  }

  if (widgets.length === 0) {
    return (
      <div className='p-4 text-center'>
        <div className='text-gray-500 mb-3'>No widgets configured</div>
        <Button
          type='dashed'
          icon={<SettingOutlined />}
          href='/settings/module-widgets'
          size='small'
        >
          Configure Widgets
        </Button>
      </div>
    );
  }

  return (
    <div className='pl-2'>
      {widgets.map((widgetName) => {
        const WidgetComponent = getWidget(module, widgetName);

        if (!WidgetComponent) {
          return (
            <div key={widgetName} className='p-2 border border-red-200 rounded'>
              <span className='text-red-500'>
                Widget "{widgetName}" not found
              </span>
            </div>
          );
        }

        return (
          <div key={widgetName} className='widget-container'>
            <WidgetComponent module={module} />
          </div>
        );
      })}
    </div>
  );
}
