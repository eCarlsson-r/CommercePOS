// src/app/core/layouts/login-layout/login-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterOutlet, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-primary italic">Zard Store</h1>
          <p class="text-muted-foreground mt-2">Information System & POS</p>
        </div>
        
        <router-outlet></router-outlet>
        
        <div class="mt-8 text-center text-xs text-muted-foreground">
          &copy; 2026 Carlsson Studio. All rights reserved.
        </div>
      </div>
    </div>
  `
})
export class LoginLayoutComponent {}