import { Collapse, theme } from 'antd';
import { camelToTitle } from '../../helpers/views_helper';
import type { PanelConfigType } from '../../types/layouts';
import RecordPanel from './RecordPanel';

export default function RecordPanels({
  panels,
  record,
  panelConfigs,
}: {
  panels: any[];
  record: any;
  panelConfigs?: PanelConfigType[];
}) {
  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 16,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  const collapseItems = panels.map((panel) => {
    let panelConfig: PanelConfigType | undefined;
    if (panelConfigs && panelConfigs.length > 0) {
      panelConfig = panelConfigs?.find((config) => config.name === panel.name);
    }

    let label = panel.label || panel.name;
    label = camelToTitle(label);

    return {
      key: `panel-${panel.name}`,
      label: label,
      children: (
        <>
          <RecordPanel
            panel={panel}
            record={record}
            panelConfig={panelConfig}
          />
        </>
      ),
      style: panelStyle,
    };
  });

  return (
    <div className='mt-4'>
      <Collapse
        items={collapseItems}
        bordered={false}
        style={{ background: 'none' }}
      />
    </div>
  );
}
