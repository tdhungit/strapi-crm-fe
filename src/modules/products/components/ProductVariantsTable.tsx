import { ProTable } from '@ant-design/pro-components';
import type { ProductType } from '../ProductService';

export default function ProductVariantsTable({
  product,
}: {
  product: ProductType;
}) {
  return (
    <div className='w-full bg-white p-4 rounded-md'>
      <ProTable columns={[]} dataSource={product.product_variants} />
    </div>
  );
}
