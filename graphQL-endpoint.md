# 📘 GraphQL API Endpoints

---

## 📚 Modules Overview

- [Auth](#-auth-module)
- [Address](#-address-module)
- [Cart](#-cart-module)
- [Category](#-category-module)
- [Delivery](#-delivery-module)
- [Notification](#-notification-module)
- [Order](#-order-module)
- [Payment](#-payment-module)
- [Product](#-product-module)
- [Review](#-review-module)
- [Store](#-store-module)
- [User](#-user-module)
- [Wishlist](#-wishlist-module)
- [Enums](#-enums)
- [Common Types](#-common-types-used)


## 🔐 Auth Module

### Mutations

| Name   | Args | Returns |
|--------|------|---------|
| `signup(signupInput: SignupInput!)` | `email`, `password`, `firstName?`, `lastName?` | `AuthResponse { token, user { id, email } }` |
| `login(loginInput: LoginInput!)`   | `email`, `password` | `AuthResponse { token, user { id, email } }` |

---

## 🏠 Address Module

All queries and mutations require authentication. Each user can only access and manage their own addresses.

### 🔍 Queries

| Name | Args | Returns | Description |
|------|------|---------|-------------|
| `addresses(filter?: AddressFilterInput)` | `city?`, `state?`, `isDefault?`, `label?` | `[Address!]` | List all addresses of the authenticated user with optional filters |
| `address(id: ID!)` | - | `Address` | Get a specific address owned by the user |
| `defaultAddress` | - | `Address` | Get the default address of the authenticated user |

### ✏️ Mutations

| Name | Args | Returns | Description |
|------|------|---------|-------------|
| `createAddress(createAddressInput: CreateAddressInput!)` | Full address fields (userId is inferred) | `Address` | Create a new address for the user |
| `updateAddress(updateAddressInput: UpdateAddressInput!)` | Partial address fields + `id` | `Address` | Update an address owned by the user |
| `removeAddress(id: ID!)` | - | `Boolean` | Delete an address owned by the user |
| `setDefaultAddress(id: ID!)` | - | `Address` | Set an address as the user's default |

---

> **Note:** No admin functionality is exposed. Users can only act on their own data.

---

## 🛒 Cart Module

### Queries

| Name | Args | Returns |
|------|------|---------|
| `myCart` | (Auth required) | `Cart` |
| `cart(id: ID!)` | - | `Cart` |
| `cartTotal(cartId: ID!)` | - | `{ total: Float }` |

### Mutations

| Name | Args | Returns |
|------|------|---------|
| `createCart(input: CreateCartInput!)` | `userId`, `items?` | `Cart` |
| `updateCart(id: ID!, input: UpdateCartInput!)` | - | `Cart` |
| `addCartItem(cartId: ID!, input: AddCartItemInput!)` | - | `Cart` |
| `addItemToMyCart(input: AddCartItemInput!)` | (Auth required) | `Cart` |
| `removeCartItem(cartId: ID!, productId: ID!, variantId?: ID)` | - | `Cart` |
| `updateCartItemQuantity(cartId: ID!, productId: ID!, quantity: Int!, variantId?: ID)` | - | `Cart` |
| `clearCart(id: ID!)` | - | `Cart` |
| `deleteCart(id: ID!)` | - | `Boolean` |

---

## 📦 Category Module

### Queries

| Name             | Args                                 | Returns     |
|------------------|--------------------------------------|-------------|
| `categories`     | `parentId?`                          | `[Category!]`|
| `categoryTree`   | -                                    | `[Category!]`|
| `category`       | `id: ID!`                            | `Category`  |

### Mutations

| Name               | Args                                    | Returns    |
|--------------------|-----------------------------------------|------------|
| `createCategory`   | `input: CreateCategoryInput!`           | `Category` |
| `updateCategory`   | `id: ID!, input: UpdateCategoryInput!`  | `Category` |
| `deleteCategory`   | `id: ID!`                               | `Boolean`  |

---

## 🚚 Delivery Module

### Queries

| Name                     | Args                                      | Returns        |
|--------------------------|-------------------------------------------|----------------|
| `deliveries`             | `filter: DeliveryFilterInput?`            | `[Delivery!]`  |
| `delivery`               | `id: ID!`                                 | `Delivery`     |
| `deliveryByOrder`        | `orderId: String!`                        | `Delivery`     |
| `deliveriesByDriver`     | `driverId: String!`                       | `[Delivery!]`  |

### Mutations

| Name                       | Args                                                 | Returns    |
|----------------------------|------------------------------------------------------|------------|
| `createDelivery`           | `input: CreateDeliveryInput!`                        | `Delivery` |
| `updateDelivery`           | `id: ID!, input: UpdateDeliveryInput!`               | `Delivery` |
| `assignDriver`             | `id: ID!, driverId: String!`                         | `Delivery` |
| `updateDeliveryStatus`     | `id: ID!, status: DeliveryStatusEnum!, note: String` | `Delivery` |
| `updateDriverLocation`     | `id: ID!, latitude: Float!, longitude: Float!, address: String!` | `Delivery` |
| `removeDelivery`           | `id: ID!`                                           | `Boolean`  |

---

## 🔔 Notification Module

### Queries

| Name               | Args                                   | Returns       |
|--------------------|----------------------------------------|---------------|
| `notifications`    | `filter: NotificationFilterInput?`    | `[Notification!]` |
| `notification`     | `id: ID!`                             | `Notification` |

### Mutations

| Name               | Args                                   | Returns       |
|--------------------|----------------------------------------|---------------|
| `createNotification` | `input: CreateNotificationInput!`   | `Notification` |
| `updateNotification` | `id: ID!, input: UpdateNotificationInput!` | `Notification` |
| `deleteNotification` | `id: ID!`                           | `Boolean`     |

---

## 📦 Order Module

### Queries

| Name               | Args                                   | Returns       |
|--------------------|----------------------------------------|---------------|
| `orders`           | `filter?: OrderFilterInput`           | `[Order!]`    |
| `order`            | `id: ID!`                             | `Order`       |
| `orderByNumber`    | `orderNumber: String!`                | `Order`       |
| `ordersByUser`     | `userId: ID!`                         | `[Order!]`    |
| `orderSummary`     | `startDate?: DateTime, endDate?: DateTime` | `OrderSummary` |

### Mutations

| Name               | Args                                   | Returns       |
|--------------------|----------------------------------------|---------------|
| `createOrder`      | `createOrderInput: CreateOrderInput!` | `Order`       |
| `updateOrder`      | `updateOrderInput: UpdateOrderInput!` | `Order`       |
| `cancelOrder`      | `id: ID!`                             | `Order`       |
| `processOrder`     | `id: ID!`                             | `Order`       |
| `shipOrder`        | `id: ID!, trackingNumber?: String`    | `Order`       |
| `deliverOrder`     | `id: ID!`                             | `Order`       |
| `refundOrder`      | `id: ID!, reason: String!`            | `Order`       |

---

## 📦 Payment Module

### Queries

| Name               | Args                                   | Returns       |
|--------------------|----------------------------------------|---------------|
| `payments`         | `filter?: PaymentFilterInput`         | `[Payment!]`  |
| `payment`          | `id: ID!`                             | `Payment`     |
| `paymentsByOrder`  | `orderId: ID!`                        | `[Payment!]`  |
| `paymentsByUser`   | `userId: ID!`                         | `[Payment!]`  |

### Mutations

| Name               | Args                                   | Returns       |
|--------------------|----------------------------------------|---------------|
| `createPayment`    | `input: CreatePaymentInput!`          | `Payment`     |
| `updatePayment`    | `input: UpdatePaymentInput!`          | `Payment`     |
| `deletePayment`    | `id: ID!`                             | `Boolean`     |
| `processPayment`   | `paymentId: ID!`                      | `Payment`     |
| `confirmPayment`   | `paymentId: ID!, paymentMethodId: String!` | `Payment` |
| `refundPayment`    | `paymentId: ID!, amount?: Float`      | `Payment`     |

---

## 🛍️ Product Module

### Queries

| Name                  | Args                                        | Returns        |
|-----------------------|---------------------------------------------|----------------|
| `products`            | `filter?: ProductFilterInput`              | `[Product!]!`  |
| `productsCount`       | `filter?: ProductFilterInput`              | `Int!`         |
| `product`             | `id: ID!`                                  | `Product!`     |
| `productBySku`        | `sku: String!`                             | `Product!`     |
| `featuredProducts`    | `limit?: Int`                              | `[Product!]!`  |

### Mutations

| Name                  | Args                                               | Returns     |
|-----------------------|----------------------------------------------------|-------------|
| `createProduct`       | `input: CreateProductInput!`                      | `Product!`  |
| `updateProduct`       | `input: UpdateProductInput!`                      | `Product!`  |
| `removeProduct`       | `id: ID!`                                          | `Product!`  |
| `updateProductStock`  | `id: ID!, quantity: Int!`                          | `Product!`  |

---

## 💬 Review Module

### Queries

| Name                     | Args                             | Returns        |
|--------------------------|----------------------------------|----------------|
| `reviews`                | `filter?: ReviewFilterInput`     | `[Review!]!`   |
| `review`                 | `id: ID!`                         | `Review!`      |
| `productReviews`         | `productId: ID!`                 | `[Review!]!`   |
| `userReviews`            | -                                | `[Review!]!`   |
| `productAverageRating`   | `productId: ID!`                 | `Float!`       |

### Mutations

| Name                 | Args                                      | Returns     |
|----------------------|-------------------------------------------|-------------|
| `createReview`       | `createReviewInput: CreateReviewInput!`  | `Review!`   |
| `updateReview`       | `updateReviewInput: UpdateReviewInput!`  | `Review!`   |
| `removeReview`       | `id: ID!`                                 | `Boolean!`  |
| `adminUpdateReview`  | `updateReviewInput: UpdateReviewInput!`  | `Review!`   |

---

## 🏬 Store Module

### Queries

| Name          | Args                         | Returns     |
|---------------|------------------------------|-------------|
| `stores`      | `filter?: StoreFilterInput`  | `[Store!]!` |
| `store`       | `id: ID!`                    | `Store!`    |
| `myStores`    | -                            | `[Store!]!` |

### Mutations

| Name                 | Args                                      | Returns   |
|----------------------|-------------------------------------------|-----------|
| `createStore`        | `createStoreInput: CreateStoreInput!`     | `Store!`  |
| `updateStore`        | `updateStoreInput: UpdateStoreInput!`     | `Store!`  |
| `removeStore`        | `id: ID!`                                  | `Boolean!`|
| `toggleStoreFeatured`| `id: ID!`                                  | `Store!`  |
| `toggleStoreActive`  | `id: ID!`                                  | `Store!`  |

---

## 👤 User Module

### Queries

| Name           | Args          | Returns     |
|----------------|---------------|-------------|
| `users`        | -             | `[User!]!`  |
| `user`         | `id: ID!`     | `User`      |
| `me`           | -             | `User`      |

### Mutations

| Name              | Args                                  | Returns   |
|-------------------|----------------------------------------|-----------|
| `createUser`      | `input: CreateUserInput!`              | `User!`   |
| `updateUser`      | `id: ID!, input: UpdateUserInput!`     | `User!`   |
| `updateMyProfile` | `input: UpdateUserInput!`              | `User!`   |
| `deleteUser`      | `id: ID!`                              | `User!`   |

---

## 💖 Wishlist Module

### Queries

| Name              | Args        | Returns      |
|-------------------|-------------|--------------|
| `getWishlist`     | -           | `Wishlist`   |
| `getWishlistById` | `id: ID!`   | `Wishlist`   |

### Mutations

| Name              | Args               | Returns     |
|-------------------|--------------------|-------------|
| `addToWishlist`   | `productId: ID!`   | `Wishlist!` |
| `removeFromWishlist`| `productId: ID!` | `Wishlist!` |
| `clearWishlist`   | -                  | `Wishlist!` |

---


## 🌍 Enums

### `DeliveryStatusEnum`
```graphql
enum DeliveryStatusEnum {
  PENDING
  ASSIGNED
  IN_TRANSIT
  DELIVERED
  CANCELLED
}
```

### `OrderStatus`
```graphql
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### `PaymentStatus`
```graphql
enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
  CANCELLED
}
```

## 📦 Common Types Used

### `Store`
```graphql
type Store {
  _id: ID!
  name: String!
  description: String!
  logoUrl: String!
  bannerUrl: String
  cuisineTypes: [String!]!
  averageRating: Float!
  totalReviews: Int!
  deliveryFee: Float!
  minOrderAmount: Int!
  avgPrepTime: Int!
  commissionRate: Float!
  isFeatured: Boolean!
  isActive: Boolean!
  workingHours: [WorkingHours!]!
  deliveryZones: [DeliveryZone!]!
  managerId: ID!
  tags: [String!]
  contactPhone: String
  contactEmail: String
  createdAt: Date!
  updatedAt: Date!
}
```

### `WorkingHours`
```graphql
type WorkingHours {
  day: String!
  open: String!
  close: String!
}
```

### `StatusHistory`
```graphql
type StatusHistory {
  status: DeliveryStatusEnum!
  timestamp: DateTime!
  note: String
}
```

### `Location`
```graphql
type Location {
  latitude: Float!
  longitude: Float!
  address: String
}
```

### `Delivery`
```graphql
type Delivery {
  id: ID!
  orderId: String!
  driverId: String
  storeId: String
  status: DeliveryStatusEnum!
  statusHistory: [StatusHistory!]!
  isCompleted: Boolean!
  isCancelled: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  distance: Float
  currentLocation: Location
  actualDeliveryTime: DateTime
  cancellationReason: String
}

```

### `DeliveryZone`
```graphql
type DeliveryZone {
  areaName: String!
  zipCodes: [String!]!
}
```

### `User`
```graphql
type User {
  _id: ID!
  firstName: String!
  lastName: String!
  email: String!
  phoneNumber: String
  roles: [String]!
  createdAt: DateTime
  updatedAt: DateTime
  isEmailVerified: Boolean
  avatarUrl: String
  favoriteCategories: [String]
}
```

### `Wishlist`
```graphql
type Wishlist {
  _id: ID!
  userId: ID!
  productIds: [ID!]!
  updatedAt: DateTime!
  createdAt: DateTime!
}
```

### `Product`
```graphql
type Product {
  _id: ID!
  name: String!
  description: String!
  price: Float!
  salePrice: Float
  categoryIds: [String!]!
  imageUrls: [String!]!
  averageRating: Float!
  reviewCount: Int!
  stock: Int!
  sku: String!
  brand: String
  isActive: Boolean!
  attributes: [ProductAttribute!]
  variants: [ProductVariant!]
  isFeatured: Boolean!
  weight: Float!
  unit: String
  createdAt: DateTime!
  updatedAt: DateTime!
  taxRate: Float
  minOrderQuantity: Int
}
```

### `Order`
```graphql
type Order {
  _id: ID!
  orderNumber: String!
  userId: ID!
  items: [OrderItem!]!
  subtotal: Float!
  tax: Float!
  total: Float!
  status: OrderStatus!
  payment: PaymentInfo!
  shipping: ShippingInfo!
  addressId: ID
  createdAt: DateTime!
  updatedAt: DateTime!
  deliveredAt: DateTime
}
```

### `OrderItem`
```graphql
type OrderItem {
  productId: ID!
  productName: String!
  quantity: Int!
  price: Float!
  variantName: String
  variantId: String
  imageUrl: String
}
```

### `Payment`
```graphql
type Payment {
  _id: ID!
  orderId: ID!
  userId: ID!
  method: String!
  amount: Float!
  status: PaymentStatus!
  transactionId: String
  paymentIntentId: String
  receiptUrl: String
  createdAt: Date!
  updatedAt: Date!
  paidAt: Date
  failureMessage: String
}

```

### `PaymentInfo`
```graphql
type PaymentInfo {
  method: String!
  status: PaymentStatus!
  transactionId: String
}
```

### `ShippingInfo`
```graphql
type ShippingInfo {
  address: String!
  trackingNumber: String
  cost: Float!
}
```

### `OrderSummary`
```graphql
type OrderSummary {
  totalOrders: Int!
  pendingOrders: Int!
  processingOrders: Int!
  shippedOrders: Int!
  deliveredOrders: Int!
  cancelledOrders: Int!
  totalRevenue: Float!
}
```

### `Category`
```graphql
type Category {
  _id: ID!
  name: String!
  description: String
  imageUrl: String
  parentId: ID
  isActive: Boolean!
  sortOrder: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### `Address`
```graphql
type Address {
  _id: ID!
  street: String!
  city: String!
  state: String!
  zipCode: String!
  apartment: String
  userId: String!
  isDefault: Boolean!
  label: String
  coordinates: [Float!]!
}
```

### `Cart`
```graphql
type Cart {
  _id: ID!
  userId: ID!
  items: [CartItem!]!
  updatedAt: DateTime!
  createdAt: DateTime!
}
```

### `CartItem`
```graphql
type CartItem {
  productId: ID!
  quantity: Int!
  variantId: ID
  price: Float!
}
```
