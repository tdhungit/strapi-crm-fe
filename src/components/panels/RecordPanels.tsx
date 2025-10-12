import { Collapse } from 'antd';
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
  const collapseItems = panels.map((panel) => {
    let panelConfig: PanelConfigType | undefined;
    if (panelConfigs && panelConfigs.length > 0) {
      panelConfig = panelConfigs?.find((config) => config.name === panel.name);
    }
    return {
      key: `panel-${panel.name}`,
      label: panel.label ? panel.label.toUpperCase() : panel.name.toUpperCase(),
      children: (
        <>
          <RecordPanel
            panel={panel}
            record={record}
            panelConfig={panelConfig}
          />
        </>
      ),
    };
  });

  return (
    <div className='mt-4'>
      <Collapse items={collapseItems} />
    </div>
  );
}
