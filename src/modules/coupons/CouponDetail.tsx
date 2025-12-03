import { Tag } from 'antd';
import { useParams } from 'react-router-dom';
import CollectionDetailComponent from '../collections/components/CollectionDetailComponent';

export default function CouponDetail() {
  const { id } = useParams();

  const hook = (res: any) => {
    const record = res.data;
    if (
      !record ||
      !record.product_categories ||
      record.product_categories.length === 0
    ) {
      return null;
    }

    return (
      <div className='mt-4 bg-white p-4 rounded-lg'>
        <h2 className='text-lg font-semibold mb-2'>Product Categories</h2>
        <div className='flex flex-wrap gap-2'>
          {record.product_categories.map((item: any) => (
            <Tag key={item.id}>{item.name}</Tag>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {id && (
        <CollectionDetailComponent
          module='coupons'
          id={id}
          panelConfigs={[
            {
              name: 'sale_orders',
              canDelete: false,
              canEdit: false,
              canView: true,
            },
          ]}
          populate={['product_categories']}
          hook={hook}
        />
      )}
    </>
  );
}
