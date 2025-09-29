import type { CollectionConfigType } from '../types/layouts';

export function normalizeRecord(
  record: any,
  config: CollectionConfigType
): Record<string, any> {
  if (!record) {
    return {};
  }

  const normalize: any = {};

  Object.keys(record).forEach((field: string) => {
    const fieldOptions = config.attributes?.[field] || { type: 'string' };
    switch (fieldOptions.type) {
      case 'media':
        normalize[field] = record[field];
        delete normalize[field]['documentId'];
        break;
      case 'relation':
        if (typeof record[field] === 'object') {
          const fieldValue = record[field];
          normalize[field] = fieldValue?.value || fieldValue?.id || fieldValue;
        } else {
          normalize[field] = record[field];
        }
        break;
      default:
        normalize[field] = record[field];
        break;
    }
  });

  return normalize;
}
