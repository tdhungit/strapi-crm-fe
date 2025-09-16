import type { ParamsType } from '@ant-design/pro-components';
import type { SortOrder } from 'antd/lib/table/interface';
import {
  generateCollectionFilters,
  generateCollectionSort,
} from '../helpers/views_helper';
import type { ListRequestType } from '../types/content-types';
import type { CollectionConfigType } from '../types/layouts';
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
    params: ParamsType & {
      pageSize?: number;
      current?: number;
      keyword?: string;
    } = {},
    sort: Record<string, SortOrder> = {},
    options: ListRequestType = {},
    config?: CollectionConfigType
  ): Promise<{
    data: any[];
    meta: {
      pagination: {
        total: number;
        pageSize?: number;
        page?: number;
        pageCount?: number;
      };
      [key: string]: any;
    };
  }> {
    if (!collectionName) {
      return {
        data: [],
        meta: { pagination: { total: 0 } },
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
      const sortConfig = generateCollectionSort(sort, config);
      if (Object.keys(sortConfig).length > 0) {
        searchParams.sort = sortConfig;
      }
    }

    if (options?.populate && options.populate.length > 0) {
      searchParams.populate = options.populate;
    }

    if (params?.pageSize) {
      searchParams.pagination = {
        page: params.current,
        pageSize: params.pageSize,
      };
    }

    const res: any = await ApiService.getClient()
      .collection(collectionName)
      .find({
        ...searchParams,
      });

    return res;
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

  async addRelationRecords(
    collectionName: string,
    field: any,
    parentId: number,
    recordIds?: number[],
    filters?: any
  ) {
    if (!recordIds?.length && !filters) {
      throw new Error('No records to update');
    }

    return await ApiService.request(
      'put',
      `/collections/${collectionName}/bulk-update`,
      {
        ids: recordIds,
        filters,
        data: {
          [field.mappedBy]: {
            connect: parentId,
          },
        },
      }
    );
  }
}

export default CollectionService.getInstance();
