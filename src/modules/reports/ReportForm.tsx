import { PageContainer } from '@ant-design/pro-components';
import type { Config, ImmutableTree } from '@react-awesome-query-builder/antd';
import { Card, Form, Select } from 'antd';
import { useState } from 'react';
import { availableCollections } from '../../config/collections';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import MetadataService from '../../services/MetadataService';
import QueryBuilder from './components/QueryBuilder';
import { exportQuery, toStrapiFilters } from './utils/queryExport';

export default function ReportForm() {
  const [selectedModule, setSelectedModule] = useState<string>('');

  const contentTypes = MetadataService.getSavedContentTypes();
  const availableContentTypes = contentTypes.filter((ct) =>
    availableCollections.includes(ct.collectionName)
  );
  const moduleOptions = availableContentTypes.map((ct) => ({
    label: ct.displayName,
    value: ct.collectionName,
  }));

  const handleQueryChange = (tree: ImmutableTree, config: Config) => {
    // Export query in different formats
    const exported = exportQuery(tree, config);
    const strapiFilters = toStrapiFilters(tree, config);

    console.log('Query Tree:', tree);
    console.log('Query Exports:', exported);
    console.log('Strapi Filters:', strapiFilters);
  };

  return (
    <PageContainer
      header={{
        title: 'Report Builder',
        breadcrumb: {
          itemRender: breadcrumbItemRender,
          items: [
            {
              path: '/',
              title: 'Home',
            },
            { path: '/collections/reports', title: 'Reports' },
            {
              title: 'Report Builder',
            },
          ],
        },
      }}
    >
      <div className='flex flex-col gap-2'>
        <Card title='Report Builder' size='small'>
          <Form layout='vertical'>
            <Form.Item label='Select Collection' required>
              <Select
                placeholder='Choose a collection to query'
                options={moduleOptions}
                value={selectedModule || undefined}
                onChange={setSelectedModule}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Form>
        </Card>

        {selectedModule && (
          <Card title='Query Builder' size='small'>
            <QueryBuilder
              module={selectedModule}
              onChange={handleQueryChange}
            />
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
