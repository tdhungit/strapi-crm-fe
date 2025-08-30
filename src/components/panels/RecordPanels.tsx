import OneToManyPanel from './OneToManyPanel';

export default function RecordPanels({
  panels,
  record,
}: {
  panels: any[];
  record: any;
}) {
  return (
    <>
      {panels.map((panel) => (
        <div
          key={`panel-${panel.name}`}
          className='w-full bg-white mt-4 p-4 rounded-lg'
        >
          {panel.type === 'oneToMany' && (
            <OneToManyPanel
              label={panel.label}
              record={record}
              relateModule={panel.module}
              field={panel.field}
            />
          )}
        </div>
      ))}
    </>
  );
}
