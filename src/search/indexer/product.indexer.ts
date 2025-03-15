import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../product/entities/product.entity'; // Adjust path as needed

@Injectable()
export class ProductIndexer {
  private readonly logger = new Logger(ProductIndexer.name);
  private readonly indexName = 'products';

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async onModuleInit() {
    await this.createIndex();
  }

  async createIndex() {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: this.indexName,
    });

    if (!indexExists) {
      await this.elasticsearchService.indices.create({
        index: this.indexName,
        body: {
          mappings: {
            properties: {
              name: { type: 'text' },
              description: { type: 'text' },
              price: { type: 'float' },
              salePrice: { type: 'float' },
              categoryIds: { type: 'keyword' },
              imageUrls: { type: 'keyword' },
              averageRating: { type: 'float' },
              reviewCount: { type: 'integer' },
              stock: { type: 'integer' },
              sku: { type: 'keyword' },
              brand: { type: 'keyword' },
              isActive: { type: 'boolean' },
              attributes: {
                type: 'nested',
                properties: {
                  name: { type: 'keyword' },
                  value: { type: 'keyword' },
                },
              },
              variants: {
                type: 'nested',
                properties: {
                  id: { type: 'keyword' },
                  name: { type: 'text' },
                  price: { type: 'float' },
                  salePrice: { type: 'float' },
                  stock: { type: 'integer' },
                  imageUrls: { type: 'keyword' },
                },
              },
              isFeatured: { type: 'boolean' },
              weight: { type: 'float' },
              unit: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
              taxRate: { type: 'float' },
              minOrderQuantity: { type: 'integer' },
            },
          },
        },
      });
      this.logger.log(`Created index: ${this.indexName}`);
    }
  }

  async indexProduct(product: Product): Promise<void> {
    try {
      const productData = {
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        categoryIds: product.categoryIds,
        imageUrls: product.imageUrls,
        averageRating: product.averageRating,
        reviewCount: product.reviewCount,
        stock: product.stock,
        sku: product.sku,
        brand: product.brand,
        isActive: product.isActive,
        attributes: product.attributes,
        variants: product.variants?.map((variant) => ({
          id: variant._id.toString(),
          name: variant.name,
          price: variant.price,
          salePrice: variant.salePrice,
          stock: variant.stock,
          imageUrls: variant.imageUrls,
        })),
        isFeatured: product.isFeatured,
        weight: product.weight,
        unit: product.unit,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        taxRate: product.taxRate,
        minOrderQuantity: product.minOrderQuantity,
      };

      await this.elasticsearchService.index({
        index: this.indexName,
        id: product._id.toString(),
        body: productData,
      });

      this.logger.log(`Indexed product: ${product._id}`);
    } catch (error) {
      this.logger.error(
        `Error indexing product: ${error.message}`,
        error.stack,
      );
    }
  }

  async reindexAll() {
    const products = await this.productModel.find().exec();
    this.logger.log(`Reindexing ${products.length} products`);

    for (const product of products) {
      await this.indexProduct(product);
    }

    this.logger.log('Reindexing completed');
  }

  async removeProduct(productId: string) {
    try {
      await this.elasticsearchService.delete({
        index: this.indexName,
        id: productId,
      });
      this.logger.log(`Removed product from index: ${productId}`);
    } catch (error) {
      this.logger.error(
        `Error removing product from index: ${error.message}`,
        error.stack,
      );
    }
  }
}
