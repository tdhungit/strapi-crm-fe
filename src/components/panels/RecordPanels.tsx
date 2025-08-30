import { Collapse } from 'antd';
import OneToManyPanel from './OneToManyPanel';

export default function RecordPanels({
  panels,
  record,
}: {
  panels: any[];
  record: any;
}) {
  const collapseItems = panels.map((panel) => ({
    key: `panel-${panel.name}`,
    label: panel.label ? panel.label.toUpperCase() : panel.name.toUpperCase(),
    children: (
      <>
        {panel.type === 'oneToMany' && (
          <OneToManyPanel
            module={panel.parentModule}
            record={record}
            relateModule={panel.module}
            field={panel.field}
          />
        )}
      </>
    ),
  }));

  return (
    <div className='mt-4'>
      <Collapse
        items={collapseItems}
        defaultActiveKey={panels.map((panel) => `panel-${panel.name}`)}
      />
    </div>
  );
}
