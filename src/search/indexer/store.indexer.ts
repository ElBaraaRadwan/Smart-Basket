import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from '../../store/entities/store.entity'; // Adjust path as needed

@Injectable()
export class StoreIndexer {
  private readonly logger = new Logger(StoreIndexer.name);
  private readonly indexName = 'stores';

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @InjectModel(Store.name) private storeModel: Model<Store>,
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
              logoUrl: { type: 'keyword' },
              bannerUrl: { type: 'keyword' },
              cuisineTypes: { type: 'keyword' },
              averageRating: { type: 'float' },
              totalReviews: { type: 'integer' },
              deliveryFee: { type: 'float' },
              minOrderAmount: { type: 'integer' },
              avgPrepTime: { type: 'integer' },
              commissionRate: { type: 'float' },
              isFeatured: { type: 'boolean' },
              isActive: { type: 'boolean' },
              workingHours: {
                type: 'nested',
                properties: {
                  day: { type: 'keyword' },
                  open: { type: 'keyword' },
                  close: { type: 'keyword' },
                },
              },
              deliveryZones: {
                type: 'nested',
                properties: {
                  areaName: { type: 'keyword' },
                  zipCodes: { type: 'keyword' },
                },
              },
              managerId: { type: 'keyword' },
              tags: { type: 'keyword' },
              contactPhone: { type: 'keyword' },
              contactEmail: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
        },
      });
      this.logger.log(`Created index: ${this.indexName}`);
    }
  }

  async indexStore(store: Store): Promise<void> {
    try {
      const storeData = {
        name: store.name,
        description: store.description,
        logoUrl: store.logoUrl,
        bannerUrl: store.bannerUrl,
        cuisineTypes: store.cuisineTypes,
        averageRating: store.averageRating,
        totalReviews: store.totalReviews,
        deliveryFee: store.deliveryFee,
        minOrderAmount: store.minOrderAmount,
        avgPrepTime: store.avgPrepTime,
        commissionRate: store.commissionRate,
        isFeatured: store.isFeatured,
        isActive: store.isActive,
        workingHours: store.workingHours,
        deliveryZones: store.deliveryZones,
        managerId: store.managerId.toString(),
        tags: store.tags,
        contactPhone: store.contactPhone,
        contactEmail: store.contactEmail,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
      };

      await this.elasticsearchService.index({
        index: this.indexName,
        id: store._id.toString(),
        body: storeData,
      });

      this.logger.log(`Indexed store: ${store._id}`);
    } catch (error) {
      this.logger.error(`Error indexing store: ${error.message}`, error.stack);
    }
  }

  async reindexAll() {
    const stores = await this.storeModel.find().exec();
    this.logger.log(`Reindexing ${stores.length} stores`);

    for (const store of stores) {
      await this.indexStore(store);
    }

    this.logger.log('Reindexing completed');
  }

  async removeStore(storeId: string) {
    try {
      await this.elasticsearchService.delete({
        index: this.indexName,
        id: storeId,
      });
      this.logger.log(`Removed store from index: ${storeId}`);
    } catch (error) {
      this.logger.error(
        `Error removing store from index: ${error.message}`,
        error.stack,
      );
    }
  }
}
