import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { CreateProductInput, UpdateProductInput, ProductFilterInput } from './dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    // Check if product with the same SKU already exists
    const existingProduct = await this.productModel.findOne({ sku: createProductInput.sku });
    if (existingProduct) {
      throw new ConflictException(`Product with SKU ${createProductInput.sku} already exists`);
    }

    const newProduct = new this.productModel(createProductInput);
    return newProduct.save();
  }

  async findAll(filterInput?: ProductFilterInput): Promise<Product[]> {
    const query = this.buildQuery(filterInput);
    const sortOptions = {};

    if (filterInput?.sortBy) {
      sortOptions[filterInput.sortBy] = filterInput.sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by createdAt in descending order
      sortOptions['createdAt'] = -1;
    }

    let productsQuery = this.productModel.find(query).sort(sortOptions);

    if (filterInput?.skip !== undefined) {
      productsQuery = productsQuery.skip(filterInput.skip);
    }

    if (filterInput?.limit !== undefined) {
      productsQuery = productsQuery.limit(filterInput.limit);
    }

    return productsQuery.exec();
  }

  async countProducts(filterInput?: ProductFilterInput): Promise<number> {
    const query = this.buildQuery(filterInput);
    return this.productModel.countDocuments(query).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findBySku(sku: string): Promise<Product> {
    const product = await this.productModel.findOne({ sku }).exec();
    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }
    return product;
  }

  async findFeatured(limit = 10): Promise<Product[]> {
    return this.productModel
      .find({ isFeatured: true, isActive: true, stock: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async update(id: string, updateProductInput: UpdateProductInput): Promise<Product> {
    // Check if product exists
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // If SKU is being updated, check if new SKU already exists
    if (updateProductInput.sku && updateProductInput.sku !== product.sku) {
      const existingProduct = await this.productModel.findOne({
        sku: updateProductInput.sku,
        _id: { $ne: id }
      });

      if (existingProduct) {
        throw new ConflictException(`Product with SKU ${updateProductInput.sku} already exists`);
      }
    }

    // Update product
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      { $set: updateProductInput },
      { new: true },
    ).exec();

    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return deletedProduct;
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const newStock = Math.max(0, product.stock + quantity);

    return this.productModel.findByIdAndUpdate(
      id,
      { $set: { stock: newStock } },
      { new: true },
    ).exec();
  }

  private buildQuery(filterInput?: ProductFilterInput): any {
    const query: any = {};

    if (!filterInput) {
      return query;
    }

    // Only show active products by default
    query.isActive = true;

    // Add search capability
    if (filterInput.search) {
      query.$or = [
        { name: { $regex: filterInput.search, $options: 'i' } },
        { description: { $regex: filterInput.search, $options: 'i' } },
        { sku: { $regex: filterInput.search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (filterInput.categoryIds && filterInput.categoryIds.length > 0) {
      query.categoryIds = { $in: filterInput.categoryIds };
    }

    // Filter by price range
    if (filterInput.minPrice !== undefined || filterInput.maxPrice !== undefined) {
      query.price = {};

      if (filterInput.minPrice !== undefined) {
        query.price.$gte = filterInput.minPrice;
      }

      if (filterInput.maxPrice !== undefined) {
        query.price.$lte = filterInput.maxPrice;
      }
    }

    // Filter by brand
    if (filterInput.brand) {
      query.brand = filterInput.brand;
    }

    // Filter by stock availability
    if (filterInput.inStock) {
      query.stock = { $gt: 0 };
    }

    // Filter by featured flag
    if (filterInput.isFeatured !== undefined) {
      query.isFeatured = filterInput.isFeatured;
    }

    // Filter by minimum rating
    if (filterInput.minRating !== undefined) {
      query.averageRating = { $gte: filterInput.minRating };
    }

    return query;
  }
}
