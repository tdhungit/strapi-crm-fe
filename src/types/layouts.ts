import type { FormInstance } from 'antd';
import type { ReactNode } from 'react';

export interface MetadataFieldType {
  label: string;
  description?: string;
  placeholder?: string;
  visible?: boolean;
  editable?: boolean;
  mainField?: string; // relation field
  searchable?: boolean; // layout list
  sortable?: boolean; // layout list
}

export interface MetadataCollectionType {
  [field: string]: {
    edit: MetadataFieldType;
    list: MetadataFieldType;
  };
}

export interface LayoutEditItemType {
  name: string;
  size: number;
}

export interface CollectionConfigSettingsType {
  bulkable: boolean;
  defaultSortBy: string;
  defaultSortOrder: string;
  filterable: boolean;
  mainField: string;
  pageSize: number;
  searchable: boolean;
}

export interface CollectionConfigType {
  uid: string;
  collectionName: string;
  attributes: {
    [field: string]: {
      type: string;
      [key: string]: any;
    };
  };
  metadatas: MetadataCollectionType;
  layouts: {
    list: string[];
    edit: LayoutEditItemType[][];
  };
  settings: CollectionConfigSettingsType;
}

export interface FieldLayoutConfigType {
  type: string;
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  visible?: boolean;
  editable?: boolean;
  enum?: string[]; // type: enumeration
  mainField?: string; // type: relation
  relation?: string; // type: relation
  target?: string; // type: relation
  inversedBy?: string; // type: relation
  component?: string; // type: component
  repeatable?: boolean; // type: component
  options?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface LayoutEditLineType {
  name: string;
  size: number;
  options: FieldLayoutConfigType;
}

export interface ListColumnViewOptions {
  render?: (text: any, record: any) => React.ReactNode;
  renderFormItem?: (
    item: any,
    { type, defaultRender, formItemProps, fieldProps, ...rest }: any,
    form: FormInstance
  ) => ReactNode;
}

export interface ListLayoutOptions {
  attributes?: {
    [field: string]: ListColumnViewOptions;
  };
  onClickMainField?: (record: any) => void;
}

export interface PanelItemType {
  name: string;
  label: string;
  type: string;
  module: string;
  parentModule: string;
  field: any;
}
