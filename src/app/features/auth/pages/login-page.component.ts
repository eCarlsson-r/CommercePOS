// src/app/features/auth/pages/login-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="bg-white p-8 rounded-3xl border border-border shadow-xl shadow-primary/5">
      <h2 class="text-xl font-bold text-foreground mb-6">Welcome back</h2>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Email</label>
          <input type="email" formControlName="email" 
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
  private router = inject(Router);
  
  isLoading = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      // Simulate API Call
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }, 1500);
    }
  }
}