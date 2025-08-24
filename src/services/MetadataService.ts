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

  async getContentTypes() {
    return ApiService.request('get', '/metadata/content-types');
  }

  async getCollectionConfigurations(module: string) {
    const menusJson = localStorage.getItem('menus');
    const menus = menusJson ? JSON.parse(menusJson) : [];
    const menu = menus.find((item: any) => item.pluralName === module);
    const collectionUid = menu.uid;
    return ApiService.request('get', `/metadata/content-types/${collectionUid}/configuration`);
  }
}

export default MetadataService.getInstance();
