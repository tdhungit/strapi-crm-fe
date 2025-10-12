import { useParams } from 'react-router-dom';
import CollectionDetailComponent from '../collections/components/CollectionDetailComponent';

export default function CouponDetail() {
  const { id } = useParams();

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
        />
      )}
    </>
  );
}
