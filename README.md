# 🛒 Smart-baskt

A **Smart Shopping Basket System** built with [NestJS](https://nestjs.com/) and [GraphQL](https://graphql.org/), designed to deliver modern e-commerce functionalities including intelligent cart management, product browsing, and user-specific operations.

---

## 🧰 Tools & Dependencies

The core tools and dependencies used in this project:

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS" height="100" />
<img width="96" height="96" src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/96/external-graphql-an-open-source-data-query-and-manipulation-language-for-api-logo-color-tal-revivo.png" alt="external-graphql-an-open-source-data-query-and-manipulation-language-for-api-logo-color-tal-revivo"/>
  <img src="https://img.icons8.com/?size=100&id=ktSS1TBte4xa&format=png&color=000000" alt="Apollo Server" height="100" />
  <img src="https://img.icons8.com/?size=100&id=8rKdRqZFLurS&format=png&color=000000" alt="MongoDB" height="100" style="margin-right: -10px;"  />
  <img src="https://icon.icepanel.io/Technology/svg/Mongoose.js.svg" alt="Mongoose" height="100" style="margin-right: 10px;"  />
<img src="https://img.icons8.com/?size=100&id=wU62u24brJ44&format=png&color=000000" alt="AWS S3" height="100" style="margin-right: 10px;" />
<img src="https://img.icons8.com/?size=100&id=PMavpx1jbiQB&format=png&color=000000" alt="Stripe" height="100" />
  <img src="https://img.icons8.com/color/100/000000/firebase.png" alt="Firebase Admin" height="100" />
  <img src="https://img.icons8.com/?size=100&id=ZhlVdE53t65r&format=png&color=000000" alt="Twilio" height="100" />
  <img src="https://img.icons8.com/color/100/000000/typescript.png" alt="TypeScript" height="100" />
</p>

---


## 🚀 Project Setup

```bash
# Install dependencies
$ yarn install
```

---

## ▶️ Compile and Run the Project

```bash
# development mode
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

---


## 📡 API Documentation

### GraphQL Playground

Once the application is running, access the GraphQL playground to explore queries, mutations, and schemas:

```
http://localhost:3000/graphql
```

---

## 🔍 Example GraphQL Operations

You can find example queries, mutations, and subscriptions used in this project in the [`GraphQL-endpoints.md`](./graphQL-endpoint.md) file.

This includes:
- 📌 Common mutations (e.g., `createUser`, `login`, `uploadFile`, etc...)
- 📥 Data fetching queries
- 🔔 Subscription examples for real-time updates

---

## 🧪 Test Suites

### End-to-End (E2E) Testing Overview

- **Authentication**
  - Sign-up, login, logout via GraphQL mutations
- **Products**
  - Query product catalog
  - Admin-only access to product creation/update
- **Cart**
  - Add/remove/update items
  - Auto-price and stock recalculations
- **Users**
  - Profile query, order history, cart persistence

> Coverage and full test specs available using `$ yarn test:cov`

---

## 📦 Package Highlights

This project uses a rich set of modern libraries and frameworks to deliver robust, scalable, and efficient functionality. Key packages include:

### 🔧 Framework & Core
- **@nestjs/core** – Core NestJS framework module
- **@nestjs/graphql** & **@nestjs/apollo** – GraphQL integration with Apollo Server
- **@nestjs/mongoose** – Integration with Mongoose and MongoDB
- **@nestjs/jwt**, **@nestjs/passport** – Authentication with JWT and Passport strategies

### 📡 API & Communication
- **apollo-server-express** – Apollo Server setup for Express
- **graphql**, **graphql-upload-ts** – Core GraphQL library and file upload support
- **rxjs** – Reactive programming utilities (built-in with NestJS)

### 🧠 Data Management
- **mongoose** – ODM for MongoDB
- **class-validator**, **class-transformer** – Decorator-based validation and transformation
- **joi** – Schema validation utility
- **uuid** – Universal unique ID generator

### ☁️ Cloud & Messaging
- **@aws-sdk/client-s3**, **@aws-sdk/s3-request-presigner**, **aws-sdk** – AWS S3 SDKs for file handling
- **firebase-admin** – Firebase Admin SDK for notifications or other integrations
- **@vonage/server-sdk**, **twilio** – SMS and voice communication
- **nodemailer** – Email handling

### 🔐 Authentication
- **passport**, **passport-jwt**, **passport-local**, **passport-google-oauth20** – Multiple authentication strategies

### 🧰 Caching & Redis
- **ioredis**, **redis**, **nestjs-redis**, **cache-manager**, **cache-manager-redis-store** – Redis integration for caching and session handling

### 💳 Payments
- **stripe** – Stripe API integration for payment processing

### 🧪 Development & Testing
- **jest**, **ts-jest**, **supertest** – Unit and integration testing
- **@types/**\* – TypeScript type definitions for many of the packages
- **eslint**, **prettier**, **@typescript-eslint/** – Code linting and formatting tools
- **ts-node**, **typescript**, **tsconfig-paths** – TypeScript compiler and runtime tools

---

> This collection of tools empowers the app to handle GraphQL APIs, authentication, payments, cloud storage, messaging, and more—all in a modular, maintainable way.

## 📝 License

This project is [MIT licensed](LICENSE).
