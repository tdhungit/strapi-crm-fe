interface ProductFormAttributeType {
  attribute?: {
    value: number;
    [key: string]: any;
  };
  value?: string;
}

interface ProductFormVariantType {
  name?: string;
  sku?: string;
  variant_status?: string;
  photos?: string[];
  attributes: ProductFormAttributeType[];
}

export interface ProductFormType {
  name?: string;
  unit?: string;
  photos?: string[];
  product_status?: string;
  description?: string;
  variants?: ProductFormVariantType[];
  product_category?: {
    [key: string]: any;
  };
}

interface ProductAttributeType {
  id?: number;
  documentId?: string;
  name?: string;
  metadata?: {
    options?: {
      value?: string;
    }[];
  };
}

interface ProductVariantAttributeType {
  id?: number;
  documentId?: string;
  product_attribute?: ProductAttributeType | number;
  attribute_value?: string;
}

interface ProductVariantType {
  id?: number;
  documentId?: string;
  name?: string;
  sku?: string;
  variant_status?: string;
  photos?: string[];
  product_variant_attributes?: ProductVariantAttributeType[];
}

export interface ProductType {
  id?: number;
  documentId?: string;
  name?: string;
  unit?: string;
  photos?: string[];
  description?: string;
  product_status?: string;
  product_variants?: ProductVariantType[];
  product_category?: {
    [key: string]: any;
  };
}

class ProductService {
  normalizerFormValues(values: ProductFormType): ProductType {
    const data: any = { ...values };
    delete data.variants;

    if (data.product_category) {
      data.product_category =
        data.product_category.value || data.product_category.id;
    }

    if (values.variants && values.variants.length > 0) {
      const productVariants = values.variants.map(
        (variant: ProductFormVariantType) => {
          const variantData: any = {
            name: variant.name,
            sku: variant.sku,
            variant_status: variant.variant_status,
            photos: variant.photos,
            product_variant_attributes: [],
          };

          if (variant.attributes && variant.attributes.length > 0) {
            variant.attributes.forEach(
              (attribute: ProductFormAttributeType) => {
                variantData.product_variant_attributes.push({
                  product_attribute: attribute.attribute?.value,
                  attribute_value: attribute.value,
                });
              }
            );
          }

          return variantData;
        }
      );

      data.product_variants = productVariants;
    }

    return data;
  }

  denormalizerFormValues(product: ProductType): ProductFormType {
    const data: ProductFormType = {
      name: product.name,
      unit: product.unit,
      photos: product.photos,
      product_status: product.product_status,
      description: product.description,
      product_category: {
        ...product.product_category,
        value: product.product_category?.id,
        label: product.product_category?.name,
      },
      variants: [],
    };

    if (product.product_variants && product.product_variants.length > 0) {
      const productVariants = product.product_variants.map(
        (variant: ProductVariantType) => {
          const variantData: ProductFormVariantType = {
            name: variant.name,
            sku: variant.sku,
            variant_status: variant.variant_status,
            photos: variant.photos,
            attributes: [],
          };

          if (
            variant.product_variant_attributes &&
            variant.product_variant_attributes.length > 0
          ) {
            variant.product_variant_attributes.forEach(
              (attribute: ProductVariantAttributeType) => {
                const attributeData = attribute.product_attribute as any;
                variantData.attributes.push({
                  attribute: {
                    value: attributeData.id,
                    ...attributeData,
                  },
                  value: attribute.attribute_value,
                });
              }
            );
          }

          return variantData;
        }
      );

      data.variants = productVariants;
    }

    return data;
  }
}

export default new ProductService();
