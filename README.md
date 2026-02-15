# � CommercePOS

### The Ultimate Retail Operating System.

[![Angular 21](https://img.shields.io/badge/Angular-21.x-DD0031?style=for-the-badge&logo=angular)](https://angular.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)

**CommercePOS** is an enterprise-grade Point of Sale and Inventory Management system designed for modern retailers. It seamlessly bridges the gap between physical retail and e-commerce, providing a unified command center for sales, stock, and customer engagement.

Built with **Angular 21** and **Tailwind CSS 4**, it delivers a native-app-like experience in the browser—fast, responsive, and resilient.

---

## ✨ Key Features

### 🖥️ Intelligent Point of Sale

- **Lightning-Fast Checkout**: Optimized for high-volume environments with keyboard shortcuts and barcode scanning.
- **Flexible Payments**: Support for Split Payments, Cash, Credit, and QRIS.
- **Customer Profiles**: Instant access to customer purchase history and loyalty data.

### 📦 Inventory Command Center

- **Real-Time Stock Tracking**: Syncs instantly across multiple branches and the online store.
- **Barcode Label Printing**: Built-in generator for custom product labels (Code 128) with price encoding.
- **Stock Movements**: Track transfers between branches, supplier deliveries (Purchase Orders), and returns.
- **Low Stock Alerts**: Automated notifications for replenishment.

### 🌐 Omnichannel E-commerce Hub

- **Unified Order Management**: Process online orders from your Next.js storefront directly within the POS.
- **Workflow Automation**: Manage order lifecycle: _New_ → _Processing_ → _Shipped_.
- **Automated Fulfillment**: One-click generation of **Packing Slips** and Shipping Labels.
- **CMS Integration**: Manage website content, including Homepage Banners, directly from the admin panel.

### 📊 Advanced Analytics

- **Live Dashboard**: Real-time sales velocity, revenue metrics, and branch performance.
- **Financial Reporting**: A4-ready sales reports and daily closing summaries.
- **Stock Audit**: Detailed history of every inventory movement (sales, adjustments, transfers).

---

## 🛠 Technical Highlights (For Developers & Recruiters)

Reflecting a commitment to **Clean Architecture** and **Modern Web Standards**:

- **Signal-Driven Architecture**: Leverages Angular Signals for fine-grained reactivity and minimal change detection cycles.
- **Standalone Components**: fully modular architecture without NgModules.
- **Real-Time Sync**: Integrated with **Laravel Echo** (Reverb/Pusher) for instant updates on orders and inventory.
- **Print Engineering**: Custom implementation of "Hidden Print Components" for pixel-perfect A6 labels and A4 reports using CSS Paged Media.
- **Optimized Build**: Application bundles are split and lazy-loaded for sub-second Initial Contentful Paint (ICP).
- **Type Safety**: Strict TypeScript usage throughout the codebase, maximizing reliability.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- NPM (v10+)
- [CommerceSystem-API](https://github.com/eCarlsson-r/CommerceSystem-API) (Laravel Backend)

### Installation

1.  **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd CommercePOS
    npm install
    ```

2.  **Environment Configuration**
    Create a `.env` file in the root directory:

    ```env
    API_URL=http://localhost:8000/api
    DEBUG_MODE=true
    ```

3.  **Run the Application**
    ```bash
    npm start
    ```
    The app will launch at `http://localhost:4200/`.

---

## 💻 Development Commands

| Command         | Description                               |
| :-------------- | :---------------------------------------- |
| `npm start`     | Launches dev server with `.env` injection |
| `npm run build` | Generates production bundle in `dist/`    |
| `npm test`      | Runs unit tests via **Vitest**            |

---

## 🔐 Security & Permissions

- **Role-Based Access Control (RBAC)**: Granular permissions for Admins, Managers, and Cashiers.
- **Secure Authentication**: JWT-based auth flow with secure route guards and HTTP interceptors.

---

## 📄 License

Proprietary software part of the CommerceSystem ecosystem.
