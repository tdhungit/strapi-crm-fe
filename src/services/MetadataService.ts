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
}

export default MetadataService.getInstance();
