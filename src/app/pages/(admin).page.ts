import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { RouteMeta } from '@analogjs/router';
import { authGuard } from '../core/guards/auth.guard';

export const routeMeta: RouteMeta = {
  canActivate: [authGuard]
};

export default AdminLayoutComponent;
