// src/app/layouts/admin-layout/admin-layout.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { RealtimeService } from '@/services/realtime.service'; // Adjust paths as needed
import { PushNotificationService } from '@/services/push-notification.service';
import { BranchService } from '@/services/branch.service';

@Component({
  selector: 'app-admin-layout', // Changed from app-root
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterModule, 
    LucideAngularModule
  ],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent implements OnInit {
  // Using the modern inject() pattern
  private realtime = inject(RealtimeService);
  private push = inject(PushNotificationService);
  private branchService = inject(BranchService);
  branches = [{id: 1, name: 'Medan Main'}, {id: 2, name: 'Binjai Store'}];

  onBranchChange(event: any) {
    this.branchService.setBranch(Number(event.target.value));
  }

  pendingTransfers = 0;
  hasNewNotifications = false;

  menuItems = [
    {
      title: 'Master',
      items: [
        { title: 'Branches', link: '/admin/branches', icon: 'map-pin' },
        { title: 'Customers', link: '/admin/customers', icon: 'users' },
        { title: 'Employees', link: '/admin/employees', icon: 'user-plus' },
        { title: 'Products', link: '/admin/products', icon: 'package' },  
        { title: 'Suppliers', link: '/admin/suppliers', icon: 'users' },
        { title: 'Categories', link: '/admin/categories', icon: 'folder' },
        { title: 'Price Coder', link: '/admin/price-coder', icon: 'tag' }
      ]
    },
    {
      title: 'Inventory',
      items: [
        { title: 'Stock Inventory', link: '/admin/inventory', icon: 'monitor-smartphone' },
        { title: 'Purchase Order', link: '/admin/purchase', icon: 'shopping-cart' }, // Changed to shopping-cart for clarity
        { title: 'Stock Transfers', link: '/admin/movement', icon: 'truck' },
        { title: 'Returns & Waste', link: '/admin/returns', icon: 'rotate-ccw' }, // New!
      ]
    },
    {
      title: 'Insights',
      items: [
        { title: 'Daily Closing', link: '/admin/reports/daily-closing', icon: 'file-text' },
        { title: 'Stock Audit (Kartu Stok)', link: '/admin/reports/audit', icon: 'clipboard-list' }, // New!
      ]
    },
  ];

  ngOnInit() {
    // 1. Listen for new stock movement requests via Reverb
    this.realtime.listenForTransfers().subscribe({
      next: (data) => {
        this.pendingTransfers++;
        this.hasNewNotifications = true;
        this.playNotificationSound();
      }
    });

    // 2. Initial check for permissions
    this.push.checkSubscriptionStatus();
  }

  playNotificationSound() {
    const audio = new Audio('assets/sounds/notification.mp3');
    audio.play().catch(err => console.log('Audio play blocked by browser'));
  }
}