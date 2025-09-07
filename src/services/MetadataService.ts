import ApiService from './ApiService';

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

export interface CollectionConfigType {
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

class MetadataService {
  private static instance: MetadataService;

  private constructor() {
    // Initialize with empty metadata
  }

  public static getInstance(): MetadataService {
    if (!MetadataService.instance) {
      MetadataService.instance = new MetadataService();
    }
    return MetadataService.instance;
  }

  getSavedContentTypes() {
    const appSettingStr = localStorage.getItem('strapi-crm');
    const appSetting = appSettingStr ? JSON.parse(appSettingStr) : {};
    return appSetting['content-types'];
  }

  async getContentTypes() {
    return ApiService.request('get', '/metadata/content-types');
  }

  getContentTypeByModule(module: string) {
    const contentTypes = this.getSavedContentTypes();
    return contentTypes.find((item: any) => item.pluralName === module);
  }

  getContentTypeByUid(uid: string) {
    const contentTypes = this.getSavedContentTypes();
    return contentTypes.find((item: any) => item.uid === uid);
  }

  async getCollectionConfigurations(
    module: string,
    type: string = 'content_types'
  ): Promise<CollectionConfigType> {
    const contentType = this.getContentTypeByModule(module);
    const collectionUid = contentType.uid;

    return ApiService.request(
      'get',
      `/metadata/content-types/${collectionUid}/configuration`,
      { type }
    );
  }

  getCollectionFieldLayoutConfig(
    config: any,
    layout: string,
    fieldName: string
  ): FieldLayoutConfigType {
    const fieldOptions = config.attributes?.[fieldName] || {};
    const metadatas = config.metadatas?.[fieldName]?.[layout] || {};
    metadatas.type = fieldOptions.type || 'string';
    metadatas.name = fieldName;
    return {
      ...fieldOptions,
      ...metadatas,
      options: fieldOptions,
    };
  }
}

export default MetadataService.getInstance();
