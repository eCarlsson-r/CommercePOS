// src/app/core/services/auth.service.ts
import { Injectable, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService {
  private router = inject(Router);
  
  // Use a signal to track the current user globally
  currentUser = signal<any | null>(null);
  isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

  constructor() {
    super();
    const token = localStorage.getItem('token');
    if (token) {
      // Optional: Call a /me endpoint to verify the token is still valid
      this.isAuthenticated.set(true);
    }
  }

  // A helper signal to get just the role string
  userRole = computed(() => this.currentUser()?.role || 'guest');
  // A helper signal for branch-level access
  userBranchId = computed(() => this.currentUser()?.employee?.branch_id);

  login(credentials: any) {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, { headers: this.getHeaders() }).pipe(
      tap(res => {
        localStorage.setItem('pos-token', res.token);
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
        this.router.navigate(['/admin/dashboard']);
      })
    );
  }

  logout() {
    localStorage.removeItem('pos-token');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}