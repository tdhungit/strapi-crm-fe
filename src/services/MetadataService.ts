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

  async getCollectionConfigurations(module: string) {
    const contentType = this.getContentTypeByModule(module);
    const collectionUid = contentType.uid;

    return ApiService.request('get', `/metadata/content-types/${collectionUid}/configuration`);
  }
}

export default MetadataService.getInstance();
