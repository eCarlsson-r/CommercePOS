// src/app/features.routes.ts
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard/pages/dashboard-page/dashboard-page.component').then(c => c.DashboardPageComponent) },
      { path: 'categories', loadComponent: () => import('./pages/category-management/category-management.component').then(c => c.CategoryManagementComponent) },
      { path: 'products', loadComponent: () => import('./pages/product-management/product-management.component').then(c => c.ProductManagementComponent) },
      { path: 'customers', loadComponent: () => import('./pages/customer-list/customer-list.component').then(c => c.CustomerListComponent) },
      { path: 'customers/:id', loadComponent: () => import('./pages/customer-detail/customer-detail.component').then(c => c.CustomerDetailComponent) },
      { path: 'branches', loadComponent: () => import('./pages/branch-management/branch-management.component').then(c => c.BranchManagementComponent) },
      { path: 'employees', loadComponent: () => import('./pages/employee-list/employee-list.component').then(c => c.EmployeeListComponent) },
      { path: 'suppliers', loadComponent: () => import('./pages/supplier-list/supplier-list.component').then(c => c.SupplierListComponent) },
      { path: 'price-coder', loadComponent: () => import('./pages/price-coder/price-coder.component').then(c => c.PriceCoderComponent) },
      { path: 'inventory', loadComponent: () => import('./pages/inventory/pages/inventory-list-page.component').then(c => c.InventoryListPageComponent) },
      { path: 'movement', loadComponent: () => import('./pages/inventory/pages/stock-movement-page/stock-movement-page.component').then(c => c.StockMovementPageComponent) },
      { path: 'purchase', loadComponent: () => import('./pages/inventory/pages/purchase-order/purchase-order.component').then(c => c.PurchaseOrderComponent) },
      { path: 'returns', loadComponent: () => import('./pages/inventory/pages/returns/returns.component').then(c => c.ReturnsComponent) },
      { path: 'sales', loadComponent: () => import('./pages/sales/pages/sales-form/sales-form.component').then(c => c.SalesFormComponent) },
      { path: 'ecommerce-orders', loadComponent: () => import('./pages/ecommerce-orders/ecommerce-orders.component').then(c => c.EcommerceOrdersComponent) },
      { path: 'reports/sales', loadComponent: () => import('./pages/reports/pages/sales-report/sales-report.component').then(c => c.SalesReportComponent) },
      { path: 'reports/purchase', loadComponent: () => import('./pages/reports/pages/purchase-report/purchase-report.component').then(c => c.PurchaseReportComponent) },
      { path: 'reports/audit', loadComponent: () => import('./pages/inventory/pages/stock-audit/stock-audit.component').then(c => c.StockAuditComponent) },
      { path: 'reports/daily-closing', loadComponent: () => import('./pages/reports/pages/daily-closing/daily-closing.component').then(c => c.DailyClosingComponent) },
    ]
  }
];