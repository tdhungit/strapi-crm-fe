import type { ParamsType } from '@ant-design/pro-components';
import type { SortOrder } from 'antd/es/table/interface';
import { generateCollectionFilters } from '../helpers/views_helper';
import ApiService from './ApiService';
import type { CollectionConfigType } from './MetadataService';

interface ListRequestType {
  filters?: any;
  sort?: any;
  populate?: any;
}

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
    params: ParamsType & {
      pageSize?: number;
      current?: number;
      keyword?: string;
    } = {},
    sort: Record<string, SortOrder> = {},
    options: ListRequestType = {},
    config?: CollectionConfigType
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
    searchParams.filters = generateCollectionFilters(params, config);

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

    if (options?.populate) {
      searchParams.populate = options.populate;
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
