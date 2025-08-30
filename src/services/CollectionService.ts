import ApiService from './ApiService';

class CollectionService {
  private static instance: CollectionService;

  public static getInstance(): CollectionService {
    if (!CollectionService.instance) {
      CollectionService.instance = new CollectionService();
    }
    return CollectionService.instance;
  }

  async getTableRequest(
    collectionName?: string,
    params: any = {},
    sort: any = [],
    options: any = {}
  ) {
    if (!collectionName) {
      return {
        data: [],
        total: 0,
      };
    }

    options = options || {};

    // Handle search parameters
    const searchParams: any = { filters: {} };

    // Handle individual field filters
    Object.keys(params).forEach((key) => {
      if (
        key !== 'search' &&
        key !== 'current' &&
        key !== 'pageSize' &&
        params[key]
      ) {
        searchParams.filters[key] = {
          $contains: params[key],
        };
      }
    });

    // add filter from options
    if (options.filters) {
      searchParams.filters = {
        ...searchParams.filters,
        ...options.filters,
      };
    }

    // Handle sorting
    if (sort) {
      const sortConfig: any = {};
      Object.keys(sort).forEach((field) => {
        const order = sort[field];
        if (order === 'ascend') {
          sortConfig[field] = 'asc';
        } else if (order === 'descend') {
          sortConfig[field] = 'desc';
        }
      });

      if (Object.keys(sortConfig).length > 0) {
        searchParams.sort = sortConfig;
      }
    }

    return await ApiService.getClient()
      .collection(collectionName)
      .find({
        ...searchParams,
      });
  }

  getTablePagination(config: any, options: any = {}) {
    options = options || {};
    return {
      defaultPageSize: config?.settings?.pageSize || 10,
      showSizeChanger: options.showSizeChanger === false ? false : true,
      showQuickJumper: options.showQuickJumper === false ? false : true,
      showTotal: (total: number, range: [number, number]) =>
        `Showing ${range[0]}-${range[1]} of ${total} items`,
    };
  }

  async addRelationRecord(
    collectionName: string,
    field: any,
    record: any,
    parentId: number
  ) {
    await ApiService.getClient()
      .collection(collectionName)
      .update(record.documentId, {
        [field.mappedBy]: parentId,
      });
  }

  async removeRelationRecord(collectionName: string, field: any, record: any) {
    await ApiService.getClient()
      .collection(collectionName)
      .update(record.documentId, {
        [field.mappedBy]: null,
      });
  }
}

export default CollectionService.getInstance();
