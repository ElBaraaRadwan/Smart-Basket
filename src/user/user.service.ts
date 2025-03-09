import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entities/user-entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userModel.findOne({
      email: createUserInput.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    // Create new user
    const newUser = new this.userModel({
      ...createUserInput,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    // Check if user exists
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If email is being updated, check if new email already exists
    if (updateUserInput.email && updateUserInput.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserInput.email,
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password if it's being updated
    if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hash(
        updateUserInput.password,
        10,
      );
    }

    // Update user
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserInput }, { new: true })
      .exec();

    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
