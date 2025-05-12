# 📘 GraphQL API Documentation

## 📚 Table of Contents

* [Modules Overview](#modules-overview)

  * [Auth](#auth-module)
  * [Address](#address-module)
  * [Cart](#cart-module)
  * [Category](#category-module)
  * [Delivery](#delivery-module)
  * [Notification](#notification-module)
  * [Order](#order-module)
  * [Payment](#payment-module)
  * [Product](#product-module)
  * [Review](#review-module)
  * [Store](#store-module)
  * [User](#user-module)
  * [Wishlist](#wishlist-module)
  * [Enums](#enums)
  * [Common Types](#common-types-used)

---

## 🔐 Auth Module

### Mutations

* `signup(signupInput: SignupInput!)` → `AuthResponse { token, user { id, email } }`
* `login(loginInput: LoginInput!)` → `AuthResponse { token, user { id, email } }`

---

## 🏠 Address Module

All queries and mutations require authentication.

### Queries

* `addresses(filter?: AddressFilterInput)` → `[Address!]`
* `address(id: ID!)` → `Address`
* `defaultAddress` → `Address`

### Mutations

* `createAddress(createAddressInput: CreateAddressInput!)` → `Address`
* `updateAddress(updateAddressInput: UpdateAddressInput!)` → `Address`
* `removeAddress(id: ID!)` → `Boolean`
* `setDefaultAddress(id: ID!)` → `Address`

---

## 🛒 Cart Module

### Queries

* `myCart` → `Cart`
* `cart(id: ID!)` → `Cart`
* `cartTotal(cartId: ID!)` → `{ total: Float }`

### Mutations

* `createCart(input: CreateCartInput!)` → `Cart`
* `updateCart(id: ID!, input: UpdateCartInput!)` → `Cart`
* `addCartItem(cartId: ID!, input: AddCartItemInput!)` → `Cart`
* `addItemToMyCart(input: AddCartItemInput!)` → `Cart`
* `removeCartItem(cartId: ID!, productId: ID!, variantId?: ID)` → `Cart`
* `updateCartItemQuantity(cartId: ID!, productId: ID!, quantity: Int!, variantId?: ID)` → `Cart`
* `clearCart(id: ID!)` → `Cart`
* `deleteCart(id: ID!)` → `Boolean`

---

## 📦 Category Module

### Queries

* `categories(parentId?)` → `[Category!]`
* `categoryTree` → `[Category!]`
* `category(id: ID!)` → `Category`

### Mutations

* `createCategory(input: CreateCategoryInput!)` → `Category`
* `updateCategory(id: ID!, input: UpdateCategoryInput!)` → `Category`
* `deleteCategory(id: ID!)` → `Boolean`

---

## 🚚 Delivery Module

### Queries

* `deliveries(filter?)` → `[Delivery!]`
* `delivery(id: ID!)` → `Delivery`
* `deliveryByOrder(orderId: String!)` → `Delivery`
* `deliveriesByDriver(driverId: String!)` → `[Delivery!]`

### Mutations

* `createDelivery(input: CreateDeliveryInput!)` → `Delivery`
* `updateDelivery(id: ID!, input: UpdateDeliveryInput!)` → `Delivery`
* `assignDriver(id: ID!, driverId: String!)` → `Delivery`
* `updateDeliveryStatus(id: ID!, status: DeliveryStatusEnum!, note: String)` → `Delivery`
* `updateDriverLocation(id: ID!, latitude: Float!, longitude: Float!, address: String!)` → `Delivery`
* `removeDelivery(id: ID!)` → `Boolean`

---

## 🔔 Notification Module

### Queries

* `notifications(filter?)` → `[Notification!]`
* `notification(id: ID!)` → `Notification`

### Mutations

* `createNotification(input: CreateNotificationInput!)` → `Notification`
* `updateNotification(id: ID!, input: UpdateNotificationInput!)` → `Notification`
* `deleteNotification(id: ID!)` → `Boolean`

---

## 📦 Order Module

### Queries

* `orders(filter?)` → `[Order!]`
* `order(id: ID!)` → `Order`
* `orderByNumber(orderNumber: String!)` → `Order`
* `ordersByUser(userId: ID!)` → `[Order!]`
* `orderSummary(startDate?, endDate?)` → `OrderSummary`

### Mutations

* `createOrder(input: CreateOrderInput!)` → `Order`
* `updateOrder(input: UpdateOrderInput!)` → `Order`
* `cancelOrder(id: ID!)` → `Order`
* `processOrder(id: ID!)` → `Order`
* `shipOrder(id: ID!, trackingNumber?)` → `Order`
* `deliverOrder(id: ID!)` → `Order`
* `refundOrder(id: ID!, reason: String!)` → `Order`

---

## 📦 Payment Module

### Queries

* `payments(filter?)` → `[Payment!]`
* `payment(id: ID!)` → `Payment`
* `paymentsByOrder(orderId: ID!)` → `[Payment!]`
* `paymentsByUser(userId: ID!)` → `[Payment!]`

### Mutations

* `createPayment(input: CreatePaymentInput!)` → `Payment`
* `updatePayment(input: UpdatePaymentInput!)` → `Payment`
* `deletePayment(id: ID!)` → `Boolean`
* `processPayment(paymentId: ID!)` → `Payment`
* `confirmPayment(paymentId: ID!, paymentMethodId: String!)` → `Payment`
* `refundPayment(paymentId: ID!, amount?)` → `Payment`

---

## 🛍️ Product Module

### Queries

* `products(filter?)` → `[Product!]!`
* `productsCount(filter?)` → `Int!`
* `product(id: ID!)` → `Product!`
* `productBySku(sku: String!)` → `Product!`
* `featuredProducts(limit?)` → `[Product!]!`

### Mutations

* `createProduct(input: CreateProductInput!)` → `Product!`
* `updateProduct(input: UpdateProductInput!)` → `Product!`
* `removeProduct(id: ID!)` → `Product!`
* `updateProductStock(id: ID!, quantity: Int!)` → `Product!`

---

## 💬 Review Module

### Queries

* `reviews(filter?)` → `[Review!]!`
* `review(id: ID!)` → `Review!`
* `productReviews(productId: ID!)` → `[Review!]!`
* `userReviews` → `[Review!]!`
* `productAverageRating(productId: ID!)` → `Float!`

### Mutations

* `createReview(input: CreateReviewInput!)` → `Review!`
* `updateReview(input: UpdateReviewInput!)` → `Review!`
* `removeReview(id: ID!)` → `Boolean!`
* `adminUpdateReview(input: UpdateReviewInput!)` → `Review!`

---

## 🏬 Store Module

### Queries

* `stores(filter?)` → `[Store!]!`
* `store(id: ID!)` → `Store!`
* `myStores` → `[Store!]!`

### Mutations

* `createStore(input: CreateStoreInput!)` → `Store!`
* `updateStore(input: UpdateStoreInput!)` → `Store!`
* `removeStore(id: ID!)` → `Boolean!`
* `toggleStoreFeatured(id: ID!)` → `Store!`
* `toggleStoreActive(id: ID!)` → `Store!`

---

## 👤 User Module

### Queries

* `users` → `[User!]!`
* `user(id: ID!)` → `User`
* `me` → `User`

### Mutations

* `createUser(input: CreateUserInput!)` → `User!`
* `updateUser(id: ID!, input: UpdateUserInput!)` → `User!`
* `updateMyProfile(input: UpdateUserInput!)` → `User!`
* `deleteUser(id: ID!)` → `User!`

---

## 💖 Wishlist Module

### Queries

* `getWishlist` → `Wishlist`
* `getWishlistById(id: ID!)` → `Wishlist`

### Mutations

* `addToWishlist(productId: ID!)` → `Wishlist!`
* `removeFromWishlist(productId: ID!)` → `Wishlist!`
* `clearWishlist` → `Wishlist!`

---

## 🌍 Enums

### DeliveryStatusEnum

```graphql
enum DeliveryStatusEnum {
  PENDING
  ASSIGNED
  IN_TRANSIT
  DELIVERED
  CANCELLED
}
```

### OrderStatus

```graphql
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### PaymentStatus

```graphql
enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
  CANCELLED
}
```

---

## 📦 Common Types Used

### Store

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
  workingHours: [WorkingHours!]
}
```

---

> **End of API Documentation**
