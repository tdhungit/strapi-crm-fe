import type { ParamsType, ProColumns } from '@ant-design/pro-components';
import { Col, Row, type FormInstance } from 'antd';
import type { SortOrder } from 'antd/lib/table/interface';
import { Link } from 'react-router-dom';
import DetailView from '../components/fields/DetailView';
import FormInput from '../components/fields/FormInput';
import RelationInput from '../components/fields/relation/RelationInput';
import MetadataService from '../services/MetadataService';
import type {
  ContentTypeFiltersType,
  ContentTypeSortsType,
} from '../types/content-types';
import type {
  CollectionConfigType,
  LayoutEditLineType,
  ListLayoutOptions,
  PanelItemType,
} from '../types/layouts';

export function updateListLayoutFieldRender(
  field: string,
  col: ProColumns<any>,
  config: CollectionConfigType,
  options: ListLayoutOptions
) {
  const option = options.attributes?.[field] || {};
  if (option.render) {
    col.render = option.render;
    return col;
  }

  if (options.onClickMainField) {
    if (config.settings?.mainField) {
      if (field === config.settings?.mainField) {
        col.render = (text: any, record: any) => (
          <span
            className='cursor-pointer font-semibold'
            onClick={() => options.onClickMainField?.(record)}
          >
            {text}
          </span>
        );
        return col;
      }
    }
  }

  const fieldTypes = config.attributes?.[field] || {};
  fieldTypes.name = field;
  col.render = (_text: any, record: any) => (
    <>
      <DetailView item={fieldTypes} data={record} />
    </>
  );

  return col;
}

export function updateListLayoutFilterRender(
  field: string,
  col: ProColumns<any>,
  config: CollectionConfigType,
  options: ListLayoutOptions
): ProColumns<any> {
  const option = options.attributes?.[field] || {};
  if (option.renderFormItem) {
    col.renderFormItem = option.renderFormItem;
    return col;
  }

  const fieldTypes = config.attributes?.[field] || { type: 'string' };

  switch (fieldTypes.type) {
    case 'relation': {
      const fieldOptions = MetadataService.getCollectionFieldLayoutConfig(
        config,
        'edit',
        field
      );
      col.renderFormItem = (_item: any, _config: any, form: FormInstance) => {
        return (
          <RelationInput
            item={fieldOptions}
            onChange={(value: any) => {
              form.setFieldValue(field, value.value);
            }}
          />
        );
      };
      break;
    }

    case 'enumeration': {
      col.valueType = 'select';
      const valueEnum: any = {};
      fieldTypes.enum.forEach((item: any) => {
        valueEnum[item] = {
          text: item,
          [col.dataIndex]: item,
        };
      });
      col.valueEnum = valueEnum;
      break;
    }

    case 'date':
    case 'datetime': {
      col.valueType = 'dateRange';
      break;
    }

    default:
      break;
  }

  return col;
}

export function getListLayoutColumns(
  config: CollectionConfigType,
  options?: ListLayoutOptions
): ProColumns<any>[] {
  options = options || {};
  const cols: ProColumns<any>[] = [];

  config?.layouts?.list?.forEach((field: string) => {
    const metadatas = config.metadatas?.[field]?.list || {};

    const title = metadatas.label
      ? camelToTitle(metadatas.label)
      : camelToTitle(field);

    let col: ProColumns<any> = {
      title,
      dataIndex: field,
      key: field,
      search: metadatas.searchable || false,
      ellipsis: true,
      sorter: metadatas.sortable || false,
    };

    col = updateListLayoutFieldRender(field, col, config, options);
    col = updateListLayoutFilterRender(field, col, config, options);

    cols.push(col);
  });

  return cols;
}

export function updateEditLayoutColumns(
  config: CollectionConfigType
): LayoutEditLineType[][] {
  const cols: LayoutEditLineType[][] = [];

  config?.layouts?.edit?.forEach((line) => {
    const lines: LayoutEditLineType[] = [];

    line.forEach((item) => {
      const fieldOptions = MetadataService.getCollectionFieldLayoutConfig(
        config,
        'edit',
        item.name
      );

      if (
        fieldOptions.type === 'relation' &&
        fieldOptions.relation &&
        ['oneToMany', 'manyToMany'].includes(fieldOptions.relation)
      ) {
        return;
      }

      lines.push({
        ...item,
        options: fieldOptions,
      });
    });

    if (lines.length > 0) {
      cols.push(lines);
    }
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
  config: CollectionConfigType,
  record: any,
  form: FormInstance
) {
  const editLayout = updateEditLayoutColumns(config);
  return editLayout.map((line, lineIndex: number) => (
    <Row
      key={`line-${lineIndex}`}
      gutter={[16, 16]}
      className=''
      style={{ width: '100%' }}
    >
      {line.map((item) => {
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

export function getEditLayoutPanels(
  config: CollectionConfigType
): PanelItemType[] {
  const panels: PanelItemType[] = [];
  config.layouts.edit.forEach((line: any[]) => {
    line.forEach((item: any) => {
      const fieldOptions = MetadataService.getCollectionFieldLayoutConfig(
        config,
        'edit',
        item.name
      );

      if (
        fieldOptions.type === 'relation' &&
        fieldOptions.relation &&
        ['oneToMany', 'manyToMany'].includes(fieldOptions.relation) &&
        fieldOptions.target
      ) {
        const contentType = MetadataService.getContentTypeByUid(
          fieldOptions.target
        );

        panels.push({
          name: item.name,
          label: fieldOptions.label || item.name,
          type: fieldOptions.relation,
          module: contentType?.collectionName || '',
          moduleApi: contentType?.pluralName || '',
          parentModule: config.collectionName || '',
          parentModuleApi: config.pluralName || '',
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
    if (['relation', 'component'].includes(options?.type || '')) {
      populate.push(field);
    }
  });

  return populate;
}

export function getCollectionPopulatedDetail(
  config: CollectionConfigType
): string[] {
  const populate: string[] = [];

  config.layouts.edit.forEach((line: any[]) => {
    line.forEach((item: any) => {
      const options = config.attributes[item.name];
      if (options.type) {
        if (options.type === 'component') {
          populate.push(item.name);
        } else if (options.type === 'relation') {
          if (
            options.relation === 'oneToOne' ||
            options.relation === 'manyToOne'
          ) {
            populate.push(item.name);
          }
        }
      }
    });
  });

  return populate;
}

export function generateCollectionFilters(
  params: ParamsType & {
    search?: string;
    pageSize?: number;
    current?: number;
    keyword?: string;
  } = {},
  config?: CollectionConfigType
): ContentTypeFiltersType {
  const filters: ContentTypeFiltersType = {};

  Object.keys(params).forEach((key) => {
    if (
      key !== 'search' &&
      key !== 'current' &&
      key !== 'pageSize' &&
      params[key]
    ) {
      const fieldOptions = config?.attributes?.[key] || { type: 'string' };
      switch (fieldOptions.type) {
        case 'relation':
          if (fieldOptions.relation === 'manyToOne') {
            filters[key] = {
              id: params[key],
            };
          }
          break;
        case 'enumeration':
          filters[key] = {
            $eq: params[key],
          };
          break;
        case 'date':
        case 'datetime':
          filters[key] = {
            $gte: params[key][0] + ' 00:00:00',
            $lte: params[key][1] + ' 23:59:59',
          };
          break;
        default:
          filters[key] = {
            $contains: params[key],
          };
          break;
      }
    }
  });

  return filters;
}

export function generateCollectionSort(
  sort: Record<string, SortOrder> = {},
  config?: CollectionConfigType
): ContentTypeSortsType {
  const sortConfig: ContentTypeSortsType = {};

  Object.keys(sort).forEach((field) => {
    const fieldOptions = config?.attributes?.[field] || { type: 'string' };
    const order = sort[field] === 'descend' ? 'desc' : 'asc';

    switch (fieldOptions.type) {
      case 'relation':
        if (fieldOptions.relation === 'manyToOne') {
          const contentType = MetadataService.getContentTypeByUid(
            fieldOptions.target
          );
          if (contentType?.settings?.mainField) {
            sortConfig[field] = {
              [contentType.settings.mainField]: order,
            };
          }
        }
        break;

      case 'component': {
        const component = MetadataService.getComponentConfigurations(
          fieldOptions.component
        );
        if (component?.settings?.mainField) {
          sortConfig[field] = {
            [component.settings.mainField]: order,
          };
        }
        break;
      }

      default:
        sortConfig[field] = order;
        break;
    }
  });

  return sortConfig;
}

export function strapiClientErrorMessage(err: any): string {
  const errors = err.message.split(':');
  let message = errors[errors.length - 1].trim();

  if (err.name === 'HTTPForbiddenError') {
    message =
      'Permission denied. You do not have permission to perform this action.';
  }

  return message;
}

export function breadcrumbItemRender(route: any) {
  if (!route.path && !route.href) {
    return <span className='font-semibold'>{route.title}</span>;
  }
  return <Link to={route.path || route.href}>{route.title}</Link>;
}

export function getMediaUrl(media: any) {
  return media.url.startsWith('http')
    ? media.url
    : import.meta.env.VITE_MEDIA_URL + media.url;
}
