# 👗 Luxe Multi-Vendor Fashion E-commerce Marketplace

A high-fidelity, premium e-commerce platform custom-built for local multi-vendor fashion boutiques. The system features a modern visual design, curating distinct boutique store halls, robust checkout procedures, and specialized portals for **Customers**, **Shop Owners**, and **Super Admins**.

## 🌟 Key Features

### 🛍️ 1. Customer Marketplace
- Browse active and verified premium designer boutiques.
- Filter products dynamically by department categories: **Women**, **Men**, **Kids**, and **Accessories**.
- Tactile detail views: Select custom sizing scales and color palettes.
- Shared multi-vendor checkout cart with simulated split-invoice orders.

### 👔 2. Shop Owner Desk
- **Sales Analytics Dashboard:** Aggregate total revenue metrics and track weekly growth with interactive graphical charts.
- **Catalogue Control Desk:** Add, edit, or remove boutique apparel items. Features a new **Quick Add by Department** console.
- **Spam Moderation:** Real-time customer review review moderation to flag and hide comment bot spam.
- **Boutique Profile Customizer:** Customize banners, logos, and support configurations.

### 👑 3. Super Admin Suite
- Active overview statistics for overall platform transactions and accounts.
- Vetting console for new boutique applications with single-click approvals.
- Directory of all registered accounts with cascading user deletion controls.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Next.js (TypeScript) styled with Vanilla CSS and high-fidelity micro-interactions.
- **Backend:** Node.js + Express.js API.
- **Database Schema:** Mongoose schemas representing `User`, `Shop`, `Product`, `Order`, and `Review` collections.
- **State Management:** Custom React Context simulator persisting state smoothly in browser `localStorage`.
- **Localization:** Integrated multi-lingual dictionary switcher supporting **English**, **Hindi**, **Tamil**, **Kannada**, and **Telugu**.

---

## 🚀 Getting Started

### 1. Launch Backend Server
```bash
cd backend
npm install
npm start
```

### 2. Launch Frontend Website
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.
