import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginPageComponent } from './features/auth/pages/login-page.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { TerminalComponent } from './features/sales/pages/terminal/terminal.component';

export const routes: Routes = [
  { path: 'login', component: LoginLayoutComponent, children: [{ path: '', component: LoginPageComponent }] }, // Public
  { 
    path: 'admin', 
    canActivate: [authGuard], // Protected
    component: AdminLayoutComponent,
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'pos',
    component: TerminalComponent, // Use the Terminal directly (no sidebar)
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];