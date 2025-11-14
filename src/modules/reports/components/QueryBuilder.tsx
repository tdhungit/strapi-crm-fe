import type {
  BuilderProps,
  Config,
  ImmutableTree,
} from '@react-awesome-query-builder/antd';
import {
  AntdConfig,
  Builder,
  Utils as QbUtils,
  Query,
} from '@react-awesome-query-builder/antd';
import '@react-awesome-query-builder/antd/css/styles.css';
import { useCallback, useEffect, useState } from 'react';
import MetadataService from '../../../services/MetadataService';
import type {
  ContentTypeAttributeType,
  ContentTypeType,
} from '../../../types/content-types';

interface QueryBuilderProps {
  module: string;
  value?: ImmutableTree;
  onChange?: (tree: ImmutableTree, config: Config) => void;
}

// Map Strapi field types to query builder types
const mapFieldType = (strapiType: string): string => {
  const typeMap: Record<string, string> = {
    string: 'text',
    text: 'text',
    richtext: 'text',
    email: 'text',
    password: 'text',
    uid: 'text',
    enumeration: 'select',
    integer: 'number',
    biginteger: 'number',
    float: 'number',
    decimal: 'number',
    date: 'date',
    time: 'time',
    datetime: 'datetime',
    timestamp: 'datetime',
    boolean: 'boolean',
    json: 'text',
  };
  return typeMap[strapiType] || 'text';
};

export default function QueryBuilder({
  module,
  value,
  onChange,
}: QueryBuilderProps) {
  const [config, setConfig] = useState<Config | null>(null);
  const [tree, setTree] = useState<ImmutableTree | null>(null);

  useEffect(() => {
    const collection = MetadataService.getContentTypeByModule(module);
    if (!collection) {
      console.warn('Collection not found for module:', module);
      return;
    }

    const queryConfig = buildConfig(collection);
    setConfig(queryConfig);

    // Initialize tree from value or create empty tree
    if (value) {
      setTree(value);
    } else {
      // Create an empty tree with proper structure
      const emptyTree = QbUtils.loadTree({ id: QbUtils.uuid(), type: 'group' });
      console.log('Initialized empty tree:', emptyTree);
      setTree(emptyTree);
    }
  }, [module]);

  const formatFieldLabel = (fieldName: string): string => {
    return (
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ')
    );
  };

  const buildRelationFields = (
    targetUid: string,
    parentLabel: string
  ): Config['fields'] => {
    const relatedContentType = MetadataService.getContentTypeByUid(targetUid);
    if (!relatedContentType) return {};

    const relatedFields: Config['fields'] = {};

    Object.entries(relatedContentType.attributes).forEach(
      ([fieldName, fieldAttr]: [string, ContentTypeAttributeType]) => {
        // Skip localizations field
        if (fieldName === 'localizations') {
          return;
        }

        // Skip nested relations to avoid infinite recursion
        if (fieldAttr.type === 'relation' || fieldAttr.type === 'component') {
          return;
        }

        const fieldType = mapFieldType(fieldAttr.type);
        const fieldLabel = formatFieldLabel(fieldName);

        relatedFields[fieldName] = {
          label: `${parentLabel} > ${fieldLabel}`,
          type: fieldType,
          valueSources: ['value'],
          preferWidgets: fieldType === 'text' ? ['text'] : undefined,
        };

        // Add enum options if available
        if (fieldAttr.type === 'enumeration' && (fieldAttr as any).enum) {
          relatedFields[fieldName].fieldSettings = {
            listValues: (fieldAttr as any).enum.map((val: string) => ({
              value: val,
              title: val,
            })),
          };
        }
      }
    );

    return relatedFields;
  };

  const buildConfig = (contentType: ContentTypeType): Config => {
    const fields: Config['fields'] = {};

    // Build fields from content type attributes
    Object.entries(contentType.attributes).forEach(
      ([fieldName, fieldAttr]: [string, ContentTypeAttributeType]) => {
        // Skip localizations field
        if (fieldName === 'localizations') {
          return;
        }

        const fieldType = mapFieldType(fieldAttr.type);

        // Handle relation fields
        if (fieldAttr.type === 'relation' && fieldAttr.target) {
          const parentLabel = formatFieldLabel(fieldName);
          // Create a group for relation fields
          const relatedFields = buildRelationFields(
            fieldAttr.target,
            parentLabel
          );

          if (Object.keys(relatedFields).length > 0) {
            fields[fieldName] = {
              label: parentLabel,
              type: '!struct',
              subfields: relatedFields,
            };
          }
          return;
        }

        // Skip components for now
        if (fieldAttr.type === 'component') {
          return;
        }

        fields[fieldName] = {
          label: formatFieldLabel(fieldName),
          type: fieldType,
          valueSources: ['value'],
          preferWidgets: fieldType === 'text' ? ['text'] : undefined,
        };

        // Add enum options if available
        if (fieldAttr.type === 'enumeration' && (fieldAttr as any).enum) {
          fields[fieldName].fieldSettings = {
            listValues: (fieldAttr as any).enum.map((val: string) => ({
              value: val,
              title: val,
            })),
          };
        }
      }
    );

    console.log('Built config with fields:', Object.keys(fields));

    return {
      ...AntdConfig,
      fields,
    };
  };

  const handleChange = useCallback(
    (immutableTree: ImmutableTree, config: Config) => {
      setTree(immutableTree);
      onChange?.(immutableTree, config);
    },
    [onChange]
  );

  const renderBuilder = useCallback(
    (props: BuilderProps) => (
      <div className='query-builder-container'>
        <div className='query-builder qb-lite'>
          <Builder {...props} />
        </div>
      </div>
    ),
    []
  );

  if (!config || !tree) {
    return <div>Loading query builder...</div>;
  }

  return (
    <div>
      <Query
        {...config}
        value={tree}
        onChange={handleChange}
        renderBuilder={renderBuilder}
      />
    </div>
  );
}
