import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
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
            <EditOutlined
              className='edit-icon'
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(category.documentId);
              }}
            />
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
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Product Category Tree</h2>
        <div className='flex items-center gap-4'>
          <ReloadOutlined
            className='cursor-pointer text-blue-500 hover:text-blue-700'
            onClick={fetchTreeData}
          />
        </div>
      </div>

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
    </div>
  );
}
