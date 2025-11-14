import type { Config, ImmutableTree } from '@react-awesome-query-builder/antd';
import { Utils as QbUtils } from '@react-awesome-query-builder/antd';

const { jsonLogicFormat, queryString, sqlFormat } = QbUtils;

export interface QueryExport {
  jsonLogic?: any;
  queryString?: string;
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
    // jsonLogic: jsonLogicFormat(tree, config),
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
  console.log('jsonLogic output:', JSON.stringify(jsonLogic, null, 2));

  // Convert JSON Logic to Strapi filters
  // This is a basic implementation - you may need to extend it
  if (!jsonLogic) return {};

  // The jsonLogicFormat returns an object with logic, data, and errors
  // We need to extract just the logic part
  const logic = jsonLogic.logic || jsonLogic;
  // console.log('Extracted logic:', JSON.stringify(logic, null, 2));

  const strapiFilters = convertJsonLogicToStrapi(logic);
  // console.log('Strapi filters:', JSON.stringify(strapiFilters, null, 2));

  return strapiFilters;
};

const convertJsonLogicToStrapi = (logic: any): any => {
  if (!logic) return {};

  // Helper to extract field path from var object
  const getFieldPath = (varObj: any): string => {
    if (typeof varObj === 'string') return varObj;
    if (varObj && varObj.var) return varObj.var;
    return '';
  };

  // Helper to convert dot notation to nested object
  // e.g., "assigned_user.email" with {$contains: "gmail"}
  // becomes {assigned_user: {email: {$contains: "gmail"}}}
  const buildNestedFilter = (fieldPath: string, operator: any): any => {
    const parts = fieldPath.split('.');
    if (parts.length === 1) {
      return { [fieldPath]: operator };
    }

    let result: any = operator;
    for (let i = parts.length - 1; i >= 0; i--) {
      result = { [parts[i]]: result };
    }
    return result;
  };

  // Handle basic operators
  if (logic['==']) {
    const [field, value] = logic['=='];
    const fieldPath = getFieldPath(field);
    return buildNestedFilter(fieldPath, { $eq: value });
  }

  if (logic['!=']) {
    const [field, value] = logic['!='];
    const fieldPath = getFieldPath(field);
    return buildNestedFilter(fieldPath, { $ne: value });
  }

  if (logic['>']) {
    const [field, value] = logic['>'];
    const fieldPath = getFieldPath(field);
    return buildNestedFilter(fieldPath, { $gt: value });
  }

  if (logic['>=']) {
    const [field, value] = logic['>='];
    const fieldPath = getFieldPath(field);
    return buildNestedFilter(fieldPath, { $gte: value });
  }

  if (logic['<']) {
    const [field, value] = logic['<'];
    const fieldPath = getFieldPath(field);
    return buildNestedFilter(fieldPath, { $lt: value });
  }

  if (logic['<=']) {
    const [field, value] = logic['<='];
    const fieldPath = getFieldPath(field);
    return buildNestedFilter(fieldPath, { $lte: value });
  }

  if (logic['in']) {
    const [searchValue, target] = logic['in'];

    // Check if target is a variable (field reference)
    if (target && typeof target === 'object' && target.var) {
      const fieldPath = getFieldPath(target);
      // "searchValue" in "field" means field contains searchValue
      return buildNestedFilter(fieldPath, { $contains: searchValue });
    }

    // Otherwise, treat as field IN array of values
    const fieldPath = getFieldPath(searchValue);
    return buildNestedFilter(fieldPath, { $in: target });
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
