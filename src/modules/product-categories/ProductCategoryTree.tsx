import {
  EditOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Alert, Space, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import CollectionFormModal from '../collections/components/CollectionFormModal';
import './ProductCategoryTree.css';

interface ProductCategoryType {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  weight: number;
  parent: number | null;
  children: ProductCategoryType[];
}

export default function ProductCategoryTree() {
  const [tree, setTree] = useState<ProductCategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryType | null>(null);

  const navigate = useNavigate();

  const fetchTreeData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch from API
      const res = await ApiService.request(
        'GET',
        '/product-categories/extra/tree'
      );
      setTree(res);
    } catch (err) {
      console.error('Failed to fetch product category tree:', err);
      setError('Failed to load product category tree.');
      setTree([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreeData();
  }, []);

  const handleEdit = (categoryId: string) => {
    navigate(`/collections/product-categories/edit/${categoryId}`);
  };

  const convertToTreeData = (categories: ProductCategoryType[]): DataNode[] => {
    return categories.map((category) => {
      // Create a detailed title with name, slug, description, and edit button
      const title = (
        <div className='category-node'>
          <div className='category-header'>
            <div className='category-name'>{category.name}</div>
            <Space>
              <PlusCircleOutlined
                className='edit-icon'
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCategory(category);
                  setOpenCreate(true);
                }}
              />
              <EditOutlined
                className='edit-icon'
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(category.documentId);
                }}
              />
            </Space>
          </div>
          <div className='category-details'>
            <span className='category-slug'>Slug: {category.slug}</span>
            {category.description && (
              <span
                className='category-description'
                title={category.description}
              >
                Description: {category.description}
              </span>
            )}
          </div>
        </div>
      );

      return {
        title,
        key: category.id.toString(),
        children: category.children ? convertToTreeData(category.children) : [],
      };
    });
  };

  const treeData = convertToTreeData(tree);

  return (
    <PageContainer
      header={{
        title: 'Product Categories',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: 'Products',
              href: '/collections/products',
            },
            {
              title: 'Categories',
              href: '/collections/product-categories',
            },
            {
              title: 'Tree',
            },
          ],
          itemRender: breadcrumbItemRender,
        },
      }}
      extra={[
        <ReloadOutlined
          className='cursor-pointer text-blue-500 hover:text-blue-700'
          onClick={fetchTreeData}
        />,
      ]}
    >
      {error && (
        <Alert message={error} type='warning' showIcon className='mb-4' />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : treeData.length > 0 ? (
        <div className='bg-white p-4 rounded'>
          <Tree
            treeData={treeData}
            defaultExpandAll
            showLine={{ showLeafIcon: false }}
            className='w-full custom-tree'
          />
        </div>
      ) : (
        <p>No categories found.</p>
      )}

      <CollectionFormModal
        module='product-categories'
        open={openCreate}
        onOpenChange={setOpenCreate}
        onFinish={() => {
          fetchTreeData();
          setSelectedCategory(null);
          setOpenCreate(false);
        }}
        initData={{
          parent: {
            value: selectedCategory?.id,
            label: selectedCategory?.name,
          },
        }}
      />
    </PageContainer>
  );
}
