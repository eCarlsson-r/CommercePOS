import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { RealtimeService } from '@/services/realtime.service';
import { PushNotificationService } from '@/services/push-notification.service';
import { BranchService } from '@/services/branch.service';
import { AuthService } from '@/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-layout', // Changed from app-root
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterModule, 
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent implements OnInit {
  // Using the modern inject() pattern
  private realtime = inject(RealtimeService);
  private push = inject(PushNotificationService);
  private branchService = inject(BranchService);
  private auth = inject(AuthService);
  user = this.auth.currentUser; // Assuming your user signal has { type: 'admin' | 'staff' }
  userRole = this.auth.userRole;
  branches = this.branchService.branches;
  selectedBranch = this.branchService.selectedBranch;
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update((v: boolean) => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  onBranchChange(value: number) {
    this.branchService.setBranch(value);
  }

  pendingTransfers = 0;
  hasNewNotifications = false;

  menuItems = computed(() => {
    const role = this.userRole();

    // interface MenuItem { title: string; link: string; icon: string; roles?: string[] }
    // interface MenuSection { title: string; visible: boolean; items: MenuItem[] }

    const baseMenu = [
      {
        title: 'Sales',
        visible: true,
        items: [
          { title: 'Sales POS', link: '/sales', icon: 'shopping-cart' },
          { title: 'E-Commerce Orders', link: '/ecommerce-orders', icon: 'globe', roles: ['admin'] }
        ]
      },
      {
        title: 'Master',
        visible: role === 'admin', 
        items: [
          { title: 'Branches', link: '/branches', icon: 'map-pin' },
          { title: 'Employees', link: '/employees', icon: 'user-plus' },
          { title: 'Customers', link: '/customers', icon: 'users' },
          { title: 'Products', link: '/products', icon: 'package' },  
          { title: 'Suppliers', link: '/suppliers', icon: 'users' },
          { title: 'Categories', link: '/categories', icon: 'folder' },
          { title: 'Price Coder', link: '/price-coder', icon: 'tag' }
        ]
      },
      {
        title: 'Inventory',
        visible: true,
        items: [
          { title: 'Stock Inventory', link: '/inventory', icon: 'monitor-smartphone' },
          { title: 'Purchase Order', link: '/purchase', icon: 'shopping-cart', roles: ['admin'] },
          { title: 'Stock Transfers', link: '/movement', icon: 'truck' }, // Example restriction
          { title: 'Returns & Waste', link: '/returns', icon: 'rotate-ccw', roles: ['admin'] },
        ]
      },
      {
        title: 'Insights',
        visible: true,
        items: [
          { title: 'Daily Closing', link: '/reports/daily-closing', icon: 'clipboard-list' },
          { title: 'Sales Report', link: '/reports/sales', icon: 'file-text' },
          { title: 'Purchase Report', link: '/reports/purchase', icon: 'truck', roles: ['admin'] }, // Example restriction
          { title: 'Stock Audit', link: '/reports/audit', icon: 'clipboard-pen-line', roles: ['admin'] }, // Example restriction
        ]
      },
    ];

    // Filter by section visibility, then filter items by role, and finally hide sections with no items
    return baseMenu
      .filter(section => section.visible)
      .map(section => ({
        ...section,
        items: section.items.filter(item => !item.roles || item.roles.includes(role))
      }))
      .filter(section => section.items.length > 0);
  });

  ngOnInit() {
    this.branchService.getBranches().subscribe({
      next: (data) => {
        this.branchService.branches.set(data);
        this.branchService.setBranch(this.user()?.employee?.branch?.id || 1);
      }
    });
    
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

  logout() {
    this.auth.logout();
  }

  playNotificationSound() {
    const audio = new Audio('assets/sounds/notification.mp3');
    audio.play().catch(err => console.log('Audio play blocked by browser'));
  }
}