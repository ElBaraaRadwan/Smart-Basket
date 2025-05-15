import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

describe('Smart-Basket E2E Tests', () => {
  let app: INestApplication;
  let authToken: string;
  let refreshToken: string;

  // Test data
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  const adminUser = {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  };

  beforeAll(async () => {
    // Create test module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Create app
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Cleanup
    await app.close();
  });

  // Empty test to verify setup
  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
