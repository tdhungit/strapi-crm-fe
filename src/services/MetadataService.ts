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
  ) {
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
  ) {
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
