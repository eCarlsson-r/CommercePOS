# 🖥️ CommercePOS

### The AI-Augmented Enterprise Retail Terminal & Omnichannel Command Center

[![Angular 21](https://img.shields.io/badge/Angular-21.x-DD0031?style=for-the-badge&logo=angular)](https://angular.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)

**CommercePOS** is an enterprise-grade Point of Sale and Inventory Management terminal engineered for brick-and-mortar operations. Far from a disconnected legacy till, this interface acts as a real-time **AI Telemetry Node** that bridges physical counter actions directly to an autonomous cloud logistics engine.

Built using a bleeding-edge stack of **Angular 21** and **Tailwind CSS 4**, it provides physical store clerks with an ultra-responsive, native-app-grade environment that feeds mission-critical stock and transaction data directly to backend AI workflows.

---

## 🚀 TechEx Multi-Repo Ecosystem Mapping

This terminal acts as the physical brick-and-mortar execution layer within our interconnected enterprise architecture:

- ⚙️ CommerceSystem-API Backend: Central Laravel Backend, Database, and Vertex AI Gateway.

- 🛍️ CommerceStore Frontend: Next.js Consumer Web App with interactive 3D Spatial Calculation Canvas and Sales Concierge Sidebar.

- 🖥️ CommercePOS Frontend (This Repository): In-store clerk Point of Sale & Physical Inventory Management Terminal.

---

## ✨ Feature Matrix

### 🤖 Agentic Integrations & AI Telemetry

Rather than waiting for manual end-of-day reconciliations, CommercePOS communicates changes instantly to cloud-hosted agents:

- **Autonomous Replenishment Triggers**: When a cashier finalizes a transaction, the POS emits atomic inventory delta telemetry via our API. This automatically alerts the backend **Operations Agent**. If stock dips below critical levels, **Gemini Function Calling** executes autonomously to compile draft replenishment purchase orders without clerk intervention.
- **Predictive Stock Auditing**: Feeds physical inventory discrepancies straight into analytical channels, providing clear data profiles for multi-branch optimization models.

### 🖥️ High-Velocity Point of Sale

- **Lightning-Fast Checkout**: Fully optimized for high-volume environments utilizing dense data layouts, global keyboard macro shortcuts, and hardware barcode scanner integration.
- **Flexible Ledger Settlement**: Complete architectural processing handles Split Payments, Cash, Credit accounts, and instant dynamic QRIS scanning.
- **Integrated Loyalty Profiles**: Pulls historical cross-channel e-commerce records instantly, giving the physical cashier access to digital storefront preferences and omni-channel point metrics.

### 📦 Unified Inventory Command Center

- **Real-Time Cross-Branch Sync**: Instant websocket reflections prevent local oversells by reconciling digital storefront stock data simultaneously.
- **Barcode Label Generation**: Built-in programmatic rendering engine creating physical product labels (Code 128) with dynamic inline price encoding.
- **Supply Chain Telemetry**: Native handling of inter-branch inventory transfers, vendor deliveries, and customer return tracking.

### 🌐 Omnichannel E-commerce Hub

- **Unified Order Management**: Clerks monitor, flag, and fulfill online digital sales coming from the Next.js storefront directly on their terminal dashboard.
- **Workflow Automation Lifecycle**: Highly visible visual pipeline moving items cleanly through: _New_ → _Processing_ → _Shipped_.
- **Automated Logistics Fulfillment**: Single-click canvas compilation producing structural **Packing Slips** and Shipping Labels.
- **CMS Integration**: Manage website content, including Homepage Banners, directly from the admin panel.

### 📊 Advanced Analytics

- **Live Dashboard**: Real-time sales velocity, revenue metrics, and branch performance.
- **Financial Reporting**: A4-ready sales reports and daily closing summaries.
- **Stock Audit**: Detailed history of every inventory movement (sales, adjustments, transfers).

---

## 🛠 Technical Highlights (For Engineers & Judges)

This frontend reflects a production-grade application of **Clean Architecture** and highly reactive state design patterns:

- **Signal-Driven Reactivity**: Leverages Angular 21 Signals for granular data management, reducing engine change detection cycles to near-zero for lightning-fast hardware event scanning.
- **Fully Modular Standalone Architecture**: 100% template architecture written entirely via isolated Standalone Components, dropping heavy legacy _NgModule_ declarations completely.
- **Real-Time Laravel Echo Synchronization**: Listens continuously to event broadcasts using background WebSockets (Laravel Reverb), mutating UI components automatically when stock edits occur anywhere in the enterprise.
- **Advanced Print Media Engineering**: Native CSS Paged Media implementations using hidden layout injection nodes to produce pixel-perfect, printer-ready A6 receipts and A4 stock documentation directly from the browser window.
- **Sub-Second Core Web Vitals**: Strict lazy-loading module boundaries and bundle-splitting ensure an incredibly low Initial Contentful Paint (ICP) suitable for low-power tablet or retail terminal registers.

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

## 💻 Operational Execution Matrix

| Command         | Description                               |
| :-------------- | :---------------------------------------- |
| `npm start`     | Launches dev server with `.env` injection |
| `npm run build` | Generates production bundle in `dist/`    |
| `npm test`      | Runs unit tests via **Vitest**            |

---

## 🔐 Security Configuration

- **Granular Role-Based Access Control (RBAC)**: Strict view structural locks isolate administrative reports from cashiers, matching back-end Sanctum permission layers.
- **Secure Route Guards**: Strict HTTP request interceptors automatically append stateless JWT session structures to prevent spoofing on terminal nodes.

---

## 📄 License

Proprietary software part of the CommerceSystem ecosystem.
