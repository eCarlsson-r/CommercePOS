# 🛒 CommercePOS

[![Angular 21](https://img.shields.io/badge/Angular-21.x-DD0031?style=for-the-badge&logo=angular)](https://angular.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide-purple?style=for-the-badge)](https://lucide.dev)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)

**CommercePOS** is a next-generation Point of Sale system built with Angular 21 and Tailwind CSS 4. It provides a lightning-fast, terminal-like efficiency for sales operators while maintaining a rich, modern aesthetic.

---

## ✨ Key Features

### 🖥️ High-Performance POS

- **Optimized Checkout**: Rapid product lookups and multi-payment support (Cash, QR, Credit).
- **Split Payments**: Easily handle transactions spread across multiple payment methods.
- **Offline Resilience**: Built as a PWA to ensure sales continue even during network flakes.

### 📊 Dynamic Dashboard

- **Real-time Insights**: Visual representations of sales performance using **Chart.js**.
- **Integrated Analytics**: Track revenue, top-selling products, and branch performance at a glance.

### 📡 Real-time Synchronization

- **WebSocket Integration**: Instant synchronization with the [CommerceSystem-API](https://github.com/eCarlsson-r/CommerceSystem-API) backend via **Laravel Echo**.
- **Live Stock Updates**: Never sell out-of-stock items; inventory levels sync instantly across all devices.

### 🏢 multi-Branch Management

- **Centralized Control**: Seamlessly switch between branches or manage them all from a single interface.
- **Supplier Coordination**: Direct integration with procurement and supplier workflows.

---

## 🛠 Tech Stack

- **Framework**: [Angular 21](https://angular.dev) (Signal-driven architecture)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) (Native CSS variables & zero-runtime)
- **State Management**: Angular Signals & RxJS
- **Real-time**: [Laravel Echo](https://laravel.com/docs/broadcasting) & Pusher
- **Visualization**: [Chart.js](https://www.chartjs.org/) & [ng2-charts](https://valor-software.com/ng2-charts/)
- **Icons**: [Lucide Angular](https://lucide.dev/guide/packages/lucide-angular)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- NPM (v10+)
- [CommerceSystem-API](https://github.com/eCarlsson-r/CommerceSystem-API) (Running backend)

### Installation

1. **Clone & Install**:

   ```bash
   git clone <repository-url>
   cd CommercePOS
   npm install
   ```

2. **Environment Config**:
   Configure your API endpoints in `src/environments/environment.ts`.

3. **Start Development Server**:
   ```bash
   npm start
   ```
   _Navigate to `http://localhost:4200/`._

---

## 💻 Development Commands

| Command         | Description                                    |
| :-------------- | :--------------------------------------------- |
| `npm start`     | Launches development server                    |
| `npm run build` | Produces production-ready bundle in `dist/`    |
| `npm test`      | Runs unit tests via **Vitest**                 |
| `npm run watch` | Development build with automatic recompilation |

---

## 🧪 Testing

The project uses **Vitest** for blistering fast unit testing:

```bash
npm test
```

---

## 📄 License

Part of the CommerceSystem ecosystem. Licensed under the [MIT license](LICENSE).
