import type { PanelConfigType } from '../../types/layouts';
import ManyToManyPanel from './ManyToManyPanel';
import OneToManyPanel from './OneToManyPanel';

export default function RecordPanel({
  panel,
  record,
  panelConfig,
}: {
  panel: any;
  record: any;
  panelConfig?: PanelConfigType;
}) {
  switch (panel.type) {
    case 'oneToMany':
      return (
        <OneToManyPanel
          module={panel.parentModule}
          record={record}
          relateModule={panel.module}
          field={panel.field}
          panelConfig={panelConfig}
        />
      );
    case 'manyToMany':
      return (
        <ManyToManyPanel
          module={panel.parentModule}
          record={record}
          relateModule={panel.module}
          field={panel.field}
          panelConfig={panelConfig}
        />
      );
    default:
      return null;
  }
}
