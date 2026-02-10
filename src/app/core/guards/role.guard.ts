// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@/services/auth.service';

export const roleGuard = (allowedRoles: string[]) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser(); // Signal from your AuthService

    if (user && allowedRoles.includes(user.type)) {
      return true;
    }

    return router.parseUrl('/unauthorized');
  };
};