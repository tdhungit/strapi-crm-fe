import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import ApiService from '../../services/ApiService';

export default function ProductPriceList() {
  const { data: records } = useRequest(() => {
    return ApiService.getClient()
      .collection('products')
      .find({
        populate: ['product_variants.product_prices'],
      });
  });

  console.log(records);

  const dataSource: any[] = [];
  if (records && records.data && records.data.length > 0) {
    records.data.forEach((record: any) => {
      // product
      const productLine: any = {
        row_type: 'product',
        row_id: record.id + 'product',
        product_id: record.id,
        product_name: record.name,
        product_unit: record.unit,
        product_status: record.product_status,
        children: [],
      };

      record.product_variants.forEach((variant: any) => {
        // variant
        const variantLine: any = {
          row_type: 'variant',
          row_id: variant.id + 'variant',
          product_id: record.id,
          product_name: record.name,
          product_unit: record.unit,
          product_status: record.product_status,
          variant_id: variant.id,
          variant_name: variant.name,
          sku: variant.sku,
          variant_status: variant.variant_status,
          children: [],
        };

        variant.product_prices.forEach((price: any) => {
          variantLine.children.push({
            row_type: 'price',
            row_id: price.id + 'price',
            product_id: record.id,
            product_name: record.name,
            product_unit: record.unit,
            product_status: record.product_status,
            variant_id: variant.id,
            variant_name: variant.name,
            sku: variant.sku,
            variant_status: variant.variant_status,
            price_id: price.id,
            price: price.price,
            price_type: price.price_type,
            price_status: price.price_status,
            start_date: price.start_date,
            end_date: price.end_date,
          });
        });

        productLine.children.push(variantLine);
      });

      dataSource.push(productLine);
    });
  }

  const columns: any[] = [
    {
      title: 'Product/Variant',
      dataIndex: 'product_name',
      render: (_dom: any, entity: any) => {
        if (entity.row_type === 'product') {
          return entity.product_name;
        }

        if (entity.row_type === 'variant') {
          return entity.variant_name;
        }

        return null;
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      render: (_dom: any, entity: any) => {
        if (entity.row_type === 'variant') {
          return entity.sku;
        }

        return null;
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (_dom: any, entity: any) => {
        if (entity.row_type === 'price') {
          return entity.price;
        }

        return null;
      },
    },
    {
      title: 'Price Type',
      dataIndex: 'price_type',
      render: (_dom: any, entity: any) => {
        if (entity.row_type === 'price') {
          return entity.price_type;
        }

        return null;
      },
    },
    {
      title: 'Price Status',
      dataIndex: 'price_status',
      valueType: 'money',
      render: (_dom: any, entity: any) => {
        if (entity.row_type === 'price') {
          return entity.price_status;
        }

        return null;
      },
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      valueType: 'date',
      render: (_dom: any, entity: any) => {
        if (entity.row_type === 'price') {
          return entity.start_date;
        }

        return null;
      },
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      valueType: 'date',
      render: (_dom: any, entity: any) => {
        if (entity.row_type === 'price') {
          return entity.end_date;
        }

        return null;
      },
    },
  ];

  return (
    <>
      <PageContainer title='Product Price List'>
        {records && (
          <ProTable
            bordered
            search={{
              labelWidth: 'auto',
              searchText: 'Search',
            }}
            columns={columns}
            dataSource={dataSource}
            rowKey='row_id'
            options={false}
          />
        )}
      </PageContainer>
    </>
  );
}
