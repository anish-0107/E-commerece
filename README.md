# E-Commerce Admin & Storefront System

A modern, full-stack E-commerce management application featuring a sleek **Black & Violet** aesthetic. This system handles complex product taxonomies, transaction-safe order processing, and real-time inventory management.

---

## 🎨 UI Theme: "Violet Night"
- **Primary Palette:** Deep Black (`#0f172a`), Dark Slate (`#1e293b`)
- **Accent:** Linear Gradient Violet (`#6d28d9` to `#8b5cf6`)
- **Design Philosophy:** Minimalist cards, neon glow accents, and high-contrast typography for administrative clarity.

---

## 🚀 Key Features

### 🛒 Order Management (Transaction Safe)
- **Atomic Operations:** Uses TypeORM `QueryRunner` to ensure that an order is only created if stock is successfully deducted.
- **Relational Data:** Complex joins between `Orders`, `OrderItems`, and `Products` to show detailed purchase history.

### 🔍 Advanced Search & Filtering
- **RxJS Powered:** Uses `switchMap` to cancel previous searches and `debounceTime` to optimize API calls.
- **Taxonomy System:** Three-tier categorization (Type -> Category -> Sub-Category).

### 📦 Inventory Control
- **Real-time Stock Tracking:** Dedicated "Out of Stock" dashboard with pagination support.
- **Dynamic Updates:** Automatic stock decrementing upon order placement.

---

## 🛠 Tech Stack

**Frontend:**
- Angular (v17+)
- RxJS (Reactive Streams)
- CSS Media Queries (Mobile-first responsive design)

**Backend:**
- Node.js / Express
- TypeORM (Data Mapper Pattern)
- PostgreSQL / MySQL

---

## 💾 Database Schema (Core Logic)

The project utilizes a robust relational structure:
- **Order:** Stores user details, total amount, and payment method.
- **OrderItem:** Links products to orders with a snapshot of the `amountAtPurchase`.
- **Product:** Manages inventory levels (`Stockquantity`) and base pricing.

---

## 🚦 Getting Started

### 1. Clone the project
```bash
git clone <your-repo-url>


cd backend
npm install
# Configure your .env with database credentials
npm run dev


cd frontend
npm install
ng serve

### Instructions to Paste:
1. Open your project on your computer.
2. Create a new file named `README.md` in the main folder.
3. Paste the text above into it and save.
4. When you push this to GitHub, the site will automatically turn this text into a beautiful formatted page!
