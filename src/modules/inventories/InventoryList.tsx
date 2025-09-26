import { Link } from 'react-router-dom';
import CollectionListComponent from '../collections/components/CollectionListComponent';
import InventoryDrawer from './components/InventoryDrawer';

export default function InventoryList() {
  return (
    <CollectionListComponent
      module='inventories'
      toolBarRender={[]}
      noEdit
      populate={['product_variant.product']}
      mainField='product_variant'
      updateColumns={(columns, options) => {
        const newColumns: any[] = [];
        columns.forEach((col) => {
          if (col.dataIndex === 'product_variant') {
            newColumns.push({
              title: 'Product',
              dataIndex: 'product_variant.product',
              render: (_dom: any, record: any) => {
                return (
                  <Link
                    to={`/collections/products/detail/${record.product_variant.product.documentId}`}
                  >
                    {record.product_variant.product.name}
                  </Link>
                );
              },
            });

            col.render = (_dom: any, record: any) => {
              return (
                <div
                  className='w-full cursor-pointer'
                  onClick={() => {
                    options?.onClickMainField?.(record);
                  }}
                >
                  {record.product_variant.name}
                  <div className='text-xs italic text-gray-500'>
                    {record.product_variant.sku}
                  </div>
                </div>
              );
            };
          }
          newColumns.push(col);
        });
        return newColumns;
      }}
      drawerComponent={InventoryDrawer}
    />
  );
}
