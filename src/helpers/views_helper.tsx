import { Col, Row, type FormInstance } from 'antd';
import DetailView from '../components/fields/DetailView';
import FormInput from '../components/fields/FormInput';
import MetadataService from '../services/MetadataService';

export interface ListColumnViewOptions {
  render?: (text: any, record: any) => React.ReactNode;
}

export interface CollectionConfigType {
  collectionName: string;
  attributes: {
    [field: string]: any;
  };
  metadatas: {
    [field: string]: any;
  };
  layouts: {
    list: string[];
    edit: string[][];
  };
  settings: {
    bulkable: boolean;
    defaultSortBy: string;
    defaultSortOrder: string;
    filterable: boolean;
    mainField: string;
    pageSize: number;
    searchable: boolean;
  };
}

export function getListLayoutColumns(
  config: any,
  options?: {
    attributes?: {
      [field: string]: ListColumnViewOptions;
    };
    onClickMainField?: (record: any) => void;
  }
) {
  options = options || {};
  const cols: any = [];

  config?.layouts?.list?.forEach((field: string) => {
    const metadatas = config.metadatas?.[field]?.list || {};
    const title = metadatas.label
      ? camelToTitle(metadatas.label)
      : camelToTitle(field);

    const option = options.attributes?.[field] || {};
    let render;

    if (options.onClickMainField) {
      if (config.settings?.mainField) {
        if (field === config.settings?.mainField) {
          render = (text: string, record: any) => (
            <span
              className='cursor-pointer font-semibold'
              onClick={() => options.onClickMainField?.(record)}
            >
              {text}
            </span>
          );
        }
      }
    }

    if (option.render) {
      render = option.render;
    }

    if (!render) {
      const item = config.attributes?.[field] || {};
      render = (_text: any, record: any) => (
        <>
          <DetailView
            item={{
              ...item,
              name: field,
            }}
            data={record}
          />
        </>
      );
    }

    cols.push({
      title,
      dataIndex: field,
      key: field,
      search: metadatas.searchable || false,
      ellipsis: true,
      sorter: metadatas.sortable || false,
      render,
    });
  });

  return cols;
}

export function updateEditLayoutColumns(config: CollectionConfigType) {
  const cols: any[] = [];

  config?.layouts?.edit?.forEach((line: any[]) => {
    const lines: any[] = [];

    line.forEach((item: any) => {
      const fieldOptions = MetadataService.getCollectionFieldLayoutConfig(
        config,
        'edit',
        item.name
      );

      if (
        fieldOptions.type === 'relation' &&
        fieldOptions.relation === 'oneToMany'
      ) {
        return;
      }

      lines.push({
        ...item,
        options: fieldOptions,
      });
    });

    cols.push(lines);
  });

  return cols;
}

export function getEditLayoutColumns(
  config: CollectionConfigType,
  isLine: boolean = false
) {
  const editLayout = updateEditLayoutColumns(config);

  const cols: any[] = [];

  editLayout.forEach((line: any[]) => {
    const lineLayouts: any[] = [];

    line.forEach((item: any) => {
      const fieldOptions = item.options;
      const title = fieldOptions.label
        ? camelToTitle(fieldOptions.label)
        : camelToTitle(item.name);
      if (isLine) {
        lineLayouts.push({
          title,
          dataIndex: item.name,
          valueType: undefined,
          render: (_text: any, record: any) => (
            <DetailView item={fieldOptions} data={record} />
          ),
        });
      } else {
        cols.push({
          title,
          dataIndex: item.name,
          valueType: undefined,
          render: (_text: any, record: any) => (
            <DetailView item={fieldOptions} data={record} />
          ),
          span: line.length === 1 ? 2 : 1,
        });
      }
    });

    if (isLine) {
      cols.push(lineLayouts);
    }
  });

  return cols;
}

export function renderEditLayoutRows(
  config: any,
  record: any,
  form: FormInstance
) {
  const editLayout = updateEditLayoutColumns(config);
  return editLayout.map((line: any[], lineIndex: number) => (
    <Row
      key={`line-${lineIndex}`}
      gutter={[16, 16]}
      className='mb-4'
      style={{ width: '100%' }}
    >
      {line.map((item: any) => {
        const fieldOptions = item.options;
        return (
          <Col key={item.name} span={line.length === 1 ? 24 : 12}>
            <FormInput form={form} item={fieldOptions} data={record} />
          </Col>
        );
      })}
    </Row>
  ));
}

export function getEditLayoutPanels(config: CollectionConfigType) {
  const panels: any[] = [];
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
        panels.push({
          name: item.name,
          label: fieldOptions.label || item.name,
          type: fieldOptions.relation,
          module,
          parentModule: config.collectionName,
          field: config.attributes?.[item.name] || {},
        });
      }
    });
  });

  return panels;
}

export function capitalizeFirstLetter(str: string) {
  if (str.length === 0) {
    return ''; // Handle empty strings
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelToTitle(str: string): string {
  return (
    str
      // Đổi snake_case và kebab-case thành space
      .replace(/[_-]/g, ' ')
      // Chèn space giữa camelCase
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Viết hoa chữ cái đầu mỗi từ
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function getCollectionPopulatedList(
  config: CollectionConfigType
): string[] {
  const populate: string[] = [];

  config.layouts.list.forEach((field: string) => {
    const options = config.attributes[field];
    if (['relation', 'component'].includes(options.type)) {
      populate.push(field);
    }
  });

  return populate;
}
