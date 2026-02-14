// src/app/core/services/auth.service.ts
import { Injectable, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { User } from '@/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService {
  private router = inject(Router);
  
  // Use a signal to track the current user globally
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(!!localStorage.getItem('pos-token'));

  constructor() {
    super();
    const token = localStorage.getItem('pos-token');
    if (token) {
      this.isAuthenticated.set(true);
      this.me().subscribe();
    }
  }

  // A helper signal to get just the role string
  userRole = computed(() => this.currentUser()?.role || 'guest');
  // A helper signal for branch-level access
  userBranchId = computed(() => this.currentUser()?.employee?.branch?.id);

  me() {
    return this.http.get<any>(`${this.baseUrl}/user`, { headers: this.getHeaders() }).pipe(
      tap({
        next: (user) => {
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
        },
        error: () => this.logout() // If token is invalid or request fails, logout
      })
    );
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, { headers: this.getHeaders() }).pipe(
      tap(res => {
        localStorage.setItem('pos-token', res.token);
        this.currentUser.set(res.data);
        this.isAuthenticated.set(true);
        this.router.navigate(['/']);
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