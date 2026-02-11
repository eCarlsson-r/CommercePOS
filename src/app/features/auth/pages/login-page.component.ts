// src/app/features/auth/pages/login-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="bg-white p-8 rounded-3xl border border-border shadow-xl shadow-primary/5">
      <h2 class="text-xl font-bold text-foreground mb-6">Welcome back</h2>
      
      <form [formGroup]="loginForm" class="space-y-4" (submit)="handleLogin($event)">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Username</label>
          <input type="text" formControlName="username" 
            class="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Password</label>
          <input type="password" formControlName="password" 
            class="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
        </div>

        <button type="submit" [disabled]="loginForm.invalid || isLoading"
          class="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
          @if (isLoading) {
            <lucide-icon name="loader-2" class="w-4 h-4 animate-spin"></lucide-icon>
          }
          Sign In
        </button>
      </form>
    </div>
  `
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);  

  isLoading = false;
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  handleLogin(event: Event) {
    event.preventDefault();
    this.isLoading = true;

    this.auth.login({ username: this.loginForm.value.username, password: this.loginForm.value.password }).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.error.message);
      }
    });
  }
}