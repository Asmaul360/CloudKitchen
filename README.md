# 🍽️ Cloud Kitchen Backend

A complete backend system for a Cloud Kitchen application built using **Node.js**, **Express.js**, **MongoDB**, **JWT**, **Multer**, and **Cloudinary**.

This backend manages Users, Food Items, Gallery Items, Cart System, Orders, Payments, Delivery, and Reviews.

---

## 🚀 Features

### 👤 User Management

- Register / Login
- JWT Authentication
- Protected Routes

### 🍕 Food Management

- Add / Update / Delete Foods
- Upload Food Images (Cloudinary)
- Manage Categories & Add-ons

### 🖼️ Gallery Management

- Add / Update / Delete Gallery Items
- Upload Promotional Banner Images

### 🛒 Cart System

- Add Items to Cart
- Update Quantity
- Remove Item
- Clear Cart
- Auto Total Price Calculation

### 🛍️ Orders

- Create Order
- Update Order
- Fetch All Orders / Single Order
- Delivery Address Handling
- Order Status Tracking

### 💳 Payments

- Create Payment Record
- Update Payment
- Prevent Duplicate Transaction IDs

### 🚚 Delivery Management

- Assign Delivery Person
- Update Delivery Status
- Auto-set Delivered Timestamp
- Get Delivery Person Details

### ⭐ Reviews

- Add Review
- Fetch All Reviews

---

## 📁 Folder Structure

```

src/
├── controllers/
│ ├── cart.controller.js
│ ├── delivery.controller.js
│ ├── food.controller.js
│ ├── galleryItem.controller.js
│ ├── order.controller.js
│ ├── payment.controller.js
│ ├── review.controller.js
│ └── user.controller.js
│
├── models/
│ ├── cart.model.js
│ ├── delivery.model.js
│ ├── food.model.js
│ ├── galleryItem.model.js
│ ├── order.model.js
│ ├── payment.model.js
│ ├── review.model.js
│ └── user.model.js
│
├── routes/
│ ├── cart.routes.js
│ ├── delivery.routes.js
│ ├── food.routes.js
│ ├── galleryItem.routes.js
│ ├── order.routes.js
│ ├── payment.routes.js
│ ├── review.routes.js
│ └── user.routes.js
│
├── middlewares/
│ ├── auth.middleware.js
│ ├── multer.middleware.js
│ └── role.middleware.js
│
├── utils/
│ ├── ApiError.js
│ ├── ApiResponse.js
│ ├── asyncHandler.js
│ └── cloudinary.js
│
├── app.js
└── index.js

```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourname/cloud-kitchen-backend.git
cd cloud-kitchen-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create `.env`

```
MONGO_URI=your_mongodb_connection
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

ACCESS_TOKEN=youraccesstoken
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN=yourrefreshtoken
REFRESH_TOKEN_EXPIRES=7d

CORS_ORIGIN=*
PORT=8000
```

### 4️⃣ Start Server

```bash
npm run dev
```

---

## 🔗 API Overview

### 👤 Users → `/api/v1/users`

### 🍔 Food → `/api/v1/food`

### 🖼️ Gallery → `/api/v1/galleryItem`

### 🛒 Cart → `/api/v1/cart`

### 🛍️ Orders → `/api/v1/order`

### 💳 Payments → `/api/v1/payment`

### 🚚 Delivery → `/api/v1/delivery`

### ⭐ Reviews → `/api/v1/review`

---

## 🧑‍💻 Developer

**Asmau Mallick**
Cloud Kitchen Backend Developer
