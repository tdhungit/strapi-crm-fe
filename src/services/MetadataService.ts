import type { ComponentType } from '../types/components';
import type { ContentTypeType } from '../types/content-types';
import type {
  CollectionConfigType,
  FieldLayoutConfigType,
} from '../types/layouts';
import ApiService from './ApiService';

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

  getSavedContentTypes(): ContentTypeType[] {
    const appSettingStr = localStorage.getItem('strapi-crm');
    const appSetting = appSettingStr ? JSON.parse(appSettingStr) : {};
    return appSetting['content-types'];
  }

  async getContentTypes(): Promise<ContentTypeType[]> {
    return ApiService.request('get', '/metadata/content-types');
  }

  getContentTypeByModule(module: string): ContentTypeType | undefined {
    const contentTypes = this.getSavedContentTypes();
    return contentTypes.find((item: any) => item.pluralName === module);
  }

  getContentTypeByUid(uid: string) {
    const contentTypes = this.getSavedContentTypes();
    return contentTypes.find((item: any) => item.uid === uid);
  }

  async getCollectionConfigurations(
    module: string,
    type: 'content_types' | 'components' = 'content_types'
  ): Promise<CollectionConfigType> {
    const contentType = this.getContentTypeByModule(module);
    const collectionUid = contentType?.uid;

    if (!collectionUid) {
      throw new Error(`Content type ${module} not found`);
    }

    return ApiService.request(
      'get',
      `/metadata/content-types/${collectionUid}/configuration`,
      { type }
    );
  }

  getComponentConfigurations(componentUid: string): ComponentType | undefined {
    const appSettingStr = localStorage.getItem('strapi-crm');
    const appSetting = appSettingStr ? JSON.parse(appSettingStr) : {};
    const components: ComponentType[] = appSetting['components'];
    return components.find((item: any) => item.uid === componentUid);
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
