import OneToManyPanel from './OneToManyPanel';

export default function RecordPanel({
  panel,
  record,
}: {
  panel: any;
  record: any;
}) {
  switch (panel.type) {
    case 'oneToMany':
      return (
        <OneToManyPanel
          module={panel.parentModule}
          record={record}
          relateModule={panel.module}
          field={panel.field}
        />
      );
    default:
      return null;
  }
}
