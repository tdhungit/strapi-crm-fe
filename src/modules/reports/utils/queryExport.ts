import type { Config, ImmutableTree } from '@react-awesome-query-builder/antd';
import { Utils as QbUtils } from '@react-awesome-query-builder/antd';

const { jsonLogicFormat, queryString, sqlFormat } = QbUtils;

export interface QueryExport {
  jsonLogic: any;
  queryString: string;
  mongodb?: string;
  sql?: string;
}

/**
 * Export query tree to multiple formats
 */
export const exportQuery = (
  tree: ImmutableTree,
  config: Config
): QueryExport => {
  return {
    jsonLogic: jsonLogicFormat(tree, config),
    queryString: queryString(tree, config) || '',
    // mongodb: mongodbFormat(tree, config),
    sql: sqlFormat(tree, config),
  };
};

/**
 * Convert query to Strapi filters format
 */
export const toStrapiFilters = (tree: ImmutableTree, config: Config): any => {
  const jsonLogic = jsonLogicFormat(tree, config);

  // Convert JSON Logic to Strapi filters
  // This is a basic implementation - you may need to extend it
  if (!jsonLogic) return {};

  return convertJsonLogicToStrapi(jsonLogic);
};

const convertJsonLogicToStrapi = (logic: any): any => {
  if (!logic) return {};

  // Helper to extract field path from var object
  const getFieldPath = (varObj: any): string => {
    if (typeof varObj === 'string') return varObj;
    if (varObj && varObj.var) return varObj.var;
    return '';
  };

  // Handle basic operators
  if (logic['==']) {
    const [field, value] = logic['=='];
    const fieldPath = getFieldPath(field);
    return { [fieldPath]: { $eq: value } };
  }

  if (logic['!=']) {
    const [field, value] = logic['!='];
    const fieldPath = getFieldPath(field);
    return { [fieldPath]: { $ne: value } };
  }

  if (logic['>']) {
    const [field, value] = logic['>'];
    const fieldPath = getFieldPath(field);
    return { [fieldPath]: { $gt: value } };
  }

  if (logic['>=']) {
    const [field, value] = logic['>='];
    const fieldPath = getFieldPath(field);
    return { [fieldPath]: { $gte: value } };
  }

  if (logic['<']) {
    const [field, value] = logic['<'];
    const fieldPath = getFieldPath(field);
    return { [fieldPath]: { $lt: value } };
  }

  if (logic['<=']) {
    const [field, value] = logic['<='];
    const fieldPath = getFieldPath(field);
    return { [fieldPath]: { $lte: value } };
  }

  if (logic['in']) {
    const [field, values] = logic['in'];
    const fieldPath = getFieldPath(field);
    return { [fieldPath]: { $in: values } };
  }

  // Handle logical operators
  if (logic['and']) {
    return {
      $and: logic['and'].map((item: any) => convertJsonLogicToStrapi(item)),
    };
  }

  if (logic['or']) {
    return {
      $or: logic['or'].map((item: any) => convertJsonLogicToStrapi(item)),
    };
  }

  if (logic['!']) {
    return {
      $not: convertJsonLogicToStrapi(logic['!']),
    };
  }

  return logic;
};
