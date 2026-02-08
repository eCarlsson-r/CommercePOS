// src/app/features/admin/admin.routes.ts
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/pages/dashboard-page/dashboard-page.component').then(c => c.DashboardPageComponent) },
      { path: 'categories', loadComponent: () => import('./pages/category-management/category-management.component').then(c => c.CategoryManagementComponent) },
      { path: 'products', loadComponent: () => import('./pages/product-management/product-management.component').then(c => c.ProductManagementComponent) },
      { path: 'customers', loadComponent: () => import('./pages/customer-list/customer-list.component').then(c => c.CustomerListComponent) },
      { path: 'branches', loadComponent: () => import('./pages/branch-management/branch-management.component').then(c => c.BranchManagementComponent) },
      { path: 'employees', loadComponent: () => import('./pages/employee-list/employee-list.component').then(c => c.EmployeeListComponent) },
      { path: 'inventory', loadComponent: () => import('./pages/inventory/pages/inventory-list-page.component').then(c => c.InventoryListPageComponent) },
      { path: 'movement', loadComponent: () => import('./pages/inventory/pages/stock-movement-page/stock-movement-page.component').then(c => c.StockMovementPageComponent) },
      { path: 'purchase', loadComponent: () => import('./pages/inventory/pages/purchase-order/purchase-order.component').then(c => c.PurchaseOrderComponent) },
      { path: 'reports/daily-closing', loadComponent: () => import('./pages/reports/pages/daily-closing/daily-closing.component').then(c => c.DailyClosingComponent) },
    ]
  }
];