import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { CreateCategoryInput, UpdateCategoryInput } from './dto';
import { CategoryTree } from './interface/category.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(parentId?: string): Promise<Category[]> {
    const filter = parentId ? { parentId } : {};
    return this.categoryModel.find(filter).sort({ sortOrder: 1 }).exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    // Check if parent category exists if parentId is provided
    if (createCategoryInput.parentId) {
      const parentExists = await this.categoryModel
        .findById(createCategoryInput.parentId)
        .exec();
      if (!parentExists) {
        throw new BadRequestException(
          `Parent category with ID ${createCategoryInput.parentId} not found`,
        );
      }
    }

    // Check if name is unique
    const existingCategory = await this.categoryModel
      .findOne({ name: createCategoryInput.name })
      .exec();
    if (existingCategory) {
      throw new BadRequestException(
        `Category with name ${createCategoryInput.name} already exists`,
      );
    }

    const createdCategory = new this.categoryModel(createCategoryInput);
    return createdCategory.save();
  }

  async update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    // Check if category exists
    const category = await this.findOne(id);

    // Check if parent category exists if parentId is provided
    if (updateCategoryInput.parentId) {
      // Prevent circular reference
      if (updateCategoryInput.parentId === id) {
        throw new BadRequestException(`Category cannot be its own parent`);
      }

      const parentExists = await this.categoryModel
        .findById(updateCategoryInput.parentId)
        .exec();
      if (!parentExists) {
        throw new BadRequestException(
          `Parent category with ID ${updateCategoryInput.parentId} not found`,
        );
      }
    }

    // Check if name is unique if updated
    if (
      updateCategoryInput.name &&
      updateCategoryInput.name !== category.name
    ) {
      const existingCategory = await this.categoryModel
        .findOne({ name: updateCategoryInput.name })
        .exec();
      if (existingCategory) {
        throw new BadRequestException(
          `Category with name ${updateCategoryInput.name} already exists`,
        );
      }
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryInput, { new: true })
      .exec();

    return updatedCategory;
  }

  async remove(id: string): Promise<boolean> {
    // Check if category exists
    await this.findOne(id);

    // Check if category has children
    const hasChildren = await this.categoryModel
      .findOne({ parentId: id })
      .exec();
    if (hasChildren) {
      throw new BadRequestException(
        `Cannot delete category with child categories`,
      );
    }

    // Check if category is used in products (assuming a Product model with categoryIds field)
    // Uncomment and adjust if you have a Product model with a reference to categories
    /*
    const isUsedInProducts = await this.productModel.findOne({ categoryIds: id }).exec();
    if (isUsedInProducts) {
      throw new BadRequestException(`Cannot delete category that is used in products`);
    }
    */

    const result = await this.categoryModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async getCategoryTree(): Promise<CategoryTree[]> {
    const allCategories = await this.categoryModel
      .find()
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    // Create a map for faster lookups
    const categoryMap = new Map<string, CategoryTree>();

    // Transform into objects with a 'children' array
    const categories = allCategories.map((cat) => {
      const category: CategoryTree = {
        ...cat,
        children: [], // Ensure 'children' property is added
      };
      categoryMap.set(category._id.toString(), category);
      return category;
    });

    // Build the tree structure
    const rootCategories: CategoryTree[] = [];

    for (const category of categories) {
      if (!category.parentId) {
        rootCategories.push(category);
      } else {
        const parentId = category.parentId.toString();
        if (categoryMap.has(parentId)) {
          categoryMap.get(parentId)?.children.push(category);
        }
      }
    }

    return rootCategories;
  }
}
