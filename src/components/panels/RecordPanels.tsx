import { Collapse } from 'antd';
import RecordPanel from './RecordPanel';

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
        <RecordPanel panel={panel} record={record} />
      </>
    ),
  }));

  return (
    <div className='mt-4'>
      <Collapse items={collapseItems} />
    </div>
  );
}
