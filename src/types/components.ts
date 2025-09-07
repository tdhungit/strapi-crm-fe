import type { ContentTypeAttributeType } from './content-types';
import type { CollectionConfigSettingsType } from './layouts';

export interface ComponentType {
  uid: string;
  collectionName: string;
  info: {
    displayName: string;
    icon: string;
  };
  attributes: {
    [field: string]: ContentTypeAttributeType;
  };
  options: any;
  category: string;
  modelType: string;
  modelName: string;
  globalId: string;
  settings?: CollectionConfigSettingsType;
}
