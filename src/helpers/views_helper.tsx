import DetailView from '../components/fields/DetailView';
import MetadataService from '../services/MetadataService';

export function getEditLayoutColumns(config: any) {
  const cols: any = [];

  config.layouts.edit.forEach((line: any[]) => {
    line.forEach((item: any) => {
      const fieldOptions = MetadataService.getCollectionFieldLayoutConfig(
        config,
        'edit',
        item.name
      );

      // check relation
      if (fieldOptions.type === 'relation' && fieldOptions.relation === 'oneToMany') {
        return;
      }

      cols.push({
        title: fieldOptions.label || item.name,
        dataIndex: item.name,
        valueType: undefined,
        render: (_text: any, record: any) => <DetailView item={fieldOptions} data={record} />,
      });
    });
  });

  return cols;
}
