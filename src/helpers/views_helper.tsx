import { Col, Row, type FormInstance } from 'antd';
import DetailView from '../components/fields/DetailView';
import FormInput from '../components/fields/FormInput';
import MetadataService from '../services/MetadataService';

export function getListLayoutColumns(config: any) {
  const cols: any = [];

  config?.layouts?.list?.forEach((field: string) => {
    const metadatas = config.metadatas?.[field]?.list || {};
    // const fieldType = config.attributes?.[field]?.type;

    cols.push({
      title: metadatas.label || field,
      dataIndex: field,
      key: field,
      search: metadatas.searchable || false,
      ellipsis: true,
      sorter: metadatas.sortable || false,
    });
  });

  return cols;
}

export function getEditLayoutColumns(config: any) {
  const cols: any = [];

  config?.layouts?.edit?.forEach((line: any[]) => {
    line.forEach((item: any) => {
      const fieldOptions = MetadataService.getCollectionFieldLayoutConfig(
        config,
        'edit',
        item.name
      );

      // check relation
      if (
        fieldOptions.type === 'relation' &&
        fieldOptions.relation === 'oneToMany'
      ) {
        return;
      }

      cols.push({
        title: fieldOptions.label || item.name,
        dataIndex: item.name,
        valueType: undefined,
        render: (_text: any, record: any) => (
          <DetailView item={fieldOptions} data={record} />
        ),
      });
    });
  });

  return cols;
}

export function renderEditLayoutRows(
  config: any,
  record: any,
  form: FormInstance
) {
  return config.layouts.edit.map((line: any[], lineIndex: number) => (
    <Row
      key={`line-${lineIndex}`}
      gutter={[16, 16]}
      className='mb-4'
      style={{ width: '100%' }}
    >
      {line.map((item: any) => {
        const fieldOptions = MetadataService.getCollectionFieldLayoutConfig(
          config,
          'edit',
          item.name
        );
        return (
          <Col key={item.name} xs={24} sm={12} md={12} lg={12}>
            <FormInput form={form} item={fieldOptions} data={record} />
          </Col>
        );
      })}
    </Row>
  ));
}

export function getEditLayoutPanels(config: any) {
  const panelFields: any[] = [];
  config.layouts.edit.forEach((line: any[]) => {
    line.forEach((item: any) => {
      const fieldOptions = MetadataService.getCollectionFieldLayoutConfig(
        config,
        'edit',
        item.name
      );

      const contentType = MetadataService.getContentTypeByUid(
        fieldOptions.target
      );
      const module = contentType?.collectionName;

      if (
        fieldOptions.type === 'relation' &&
        fieldOptions.relation === 'oneToMany'
      ) {
        panelFields.push({
          name: item.name,
          label: fieldOptions.label || item.name,
          type: fieldOptions.relation,
          module,
          field: config.fields?.[item.name] || {},
        });
      }
    });
  });

  return panelFields;
}

export function capitalizeFirstLetter(str: string) {
  if (str.length === 0) {
    return ''; // Handle empty strings
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
