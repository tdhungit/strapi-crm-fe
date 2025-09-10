import type { CollectionConfigSettingsType } from './layouts';

export interface ListRequestType {
  filters?: any;
  sort?: any;
  populate?: any;
}

export interface ContentTypeAttributeType {
  type: string;
  configurable?: boolean;
  required?: boolean;
  searchable?: boolean;
  private?: boolean;
  writable?: boolean;
  // type: component
  component?: string;
  repeatable?: boolean;
  // type: relation
  relation?: string;
  target?: string;
  inversedBy?: string;
  useJoinTable?: boolean;
  unstable_virtual?: boolean;
  joinColumn: {
    name: string;
    referencedColumn: string;
    referencedTable: string;
  };
}

export interface ContentTypeType {
  uid: string;
  collectionName: string;
  singularName: string;
  pluralName: string;
  displayName: string;
  description: string;
  attributes: ContentTypeAttributeType;
  settings: CollectionConfigSettingsType;
  isCRM?: boolean;
}

export interface ContentTypeFiltersType {
  [key: string]: any;
}

export interface ContentTypeSortsType {
  [key: string]:
    | {
        [key: string]: 'asc' | 'desc';
      }
    | 'asc'
    | 'desc';
}
