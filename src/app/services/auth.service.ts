// src/app/core/services/auth.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Use a signal to track the current user globally
  currentUser = signal<any | null>(null);
  isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      // Optional: Call a /me endpoint to verify the token is still valid
      this.isAuthenticated.set(true);
    }
  }

  login(credentials: any) {
    return this.http.post<any>(`${environment.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
        this.router.navigate(['/admin/dashboard']);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}