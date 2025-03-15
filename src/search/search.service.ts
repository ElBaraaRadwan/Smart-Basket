import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  SearchInput,
  SearchResultOutput,
  SearchItemOutput,
  SearchFilterInput,
  SearchLocationInput,
} from './dto';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly indexName = 'search_index';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search(input: SearchInput): Promise<SearchResultOutput> {
    const { query, filters, page = 1, limit = 10, location } = input;

    if (!query || query.trim() === '') {
      throw new Error('Search query is required.');
    }

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    const searchBody: any = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['title^3', 'description^2', 'tags'],
                fuzziness: 'AUTO',
              },
            },
          ],
          filter: this.buildFilterClauses(filters),
        },
      },
      from: (safePage - 1) * safeLimit,
      size: safeLimit,
      sort: this.buildSortClauses(filters?.sortBy, location),
    };

    try {
      const response = await this.elasticsearchService.search({
        index: this.indexName,
        body: searchBody,
      });

      const items: SearchItemOutput[] = response.hits.hits.map((hit) => ({
        id: hit._id,
        ...(hit._source as SearchItemOutput),
      }));

      const totalHits =
        typeof response.hits.total === 'object'
          ? response.hits.total.value
          : response.hits.total;

      return {
        items,
        total: totalHits,
        page: safePage,
        limit: safeLimit,
        pages: Math.ceil(totalHits / safeLimit),
      };
    } catch (error) {
      this.logger.error(
        `Search operation failed: ${error.message}`,
        error.stack,
      );
      throw new Error('Search service is currently unavailable.');
    }
  }

  private buildFilterClauses(filters?: SearchFilterInput): any[] {
    return [
      ...(filters?.category ? [{ term: { category: filters.category } }] : []),
      ...(filters?.tags ? [{ terms: { tags: filters.tags } }] : []),
      ...(filters?.minPrice || filters?.maxPrice
        ? [
            {
              range: {
                price: {
                  ...(filters.minPrice !== undefined && {
                    gte: filters.minPrice,
                  }),
                  ...(filters.maxPrice !== undefined && {
                    lte: filters.maxPrice,
                  }),
                },
              },
            },
          ]
        : []),
      ...(filters?.inStock !== undefined
        ? [{ term: { inStock: filters.inStock } }]
        : []),
    ];
  }

  private buildSortClauses(
    sortBy?: string,
    location?: SearchLocationInput,
  ): any[] {
    const sortOptions = [];

    if (location) {
      sortOptions.push({
        _geo_distance: {
          location: {
            lat: location.latitude,
            lon: location.longitude,
          },
          order: 'asc',
          unit: 'km',
        },
      });
    }

    if (sortBy) {
      sortOptions.push({ [sortBy]: { order: 'asc' } });
    }

    return sortOptions.length ? sortOptions : [{ _score: { order: 'desc' } }];
  }

  async indexDocument(id: string, document: any): Promise<void> {
    try {
      await this.elasticsearchService.index({
        index: this.indexName,
        id,
        body: document,
      });
    } catch (error) {
      this.logger.error(
        `Error indexing document: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await this.elasticsearchService.delete({
        index: this.indexName,
        id,
      });
    } catch (error) {
      this.logger.error(
        `Error deleting document: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async createIndex(): Promise<void> {
    try {
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
                categoryIds: { type: 'keyword' },
                imageUrls: { type: 'keyword' },
                averageRating: { type: 'float' },
                reviewCount: { type: 'integer' },
                stock: { type: 'integer' },
                brand: { type: 'keyword' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'date' },
                updatedAt: { type: 'date' },
                taxRate: { type: 'float' },
                minOrderQuantity: { type: 'integer' },
              },
            },
            settings: {
              number_of_shards: 1,
              number_of_replicas: 1,
            },
          },
        });

        this.logger.log(`Created index: ${this.indexName}`);
      }
    } catch (error) {
      this.logger.error(`Error creating index: ${error.message}`, error.stack);
      throw error;
    }
  }
}
