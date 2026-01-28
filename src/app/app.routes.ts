import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: LoginLayoutComponent,
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./features/auth/pages/login-page.component').then(m => m.LoginPageComponent) 
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(m => m.DashboardPageComponent) 
      },
      { 
        path: 'inventory', 
        loadComponent: () => import('./features/inventory/pages/inventory-list-page.component').then(m => m.InventoryListPageComponent) 
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];