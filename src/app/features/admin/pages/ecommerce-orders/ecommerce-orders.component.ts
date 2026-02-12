import { Component, inject, signal } from '@angular/core';
import { EcommerceService } from '@/services/ecommerce.service';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ecommerce-orders',
  templateUrl: './ecommerce-orders.component.html',
  imports: [LucideAngularModule, CommonModule, RouterLink]
})
export class EcommerceOrdersComponent {
  private ecommerceService = inject(EcommerceService);
  
  activeTab = signal<'new' | 'processing' | 'shipped' | 'completed'>('new');
  orders = signal<any[]>([]);

  ngOnInit() {
    this.loadOrders();
  }
  setTab(tab: any) {
    this.activeTab.set(tab);
    this.loadOrders();
  }

  loadOrders() {
    this.ecommerceService.getOrders(this.activeTab()).subscribe(data => {
      this.orders.set(data);
    });
  }

  processOrder(orderId: number) {
    this.ecommerceService.updateStatus(orderId, 'processing').subscribe(() => {
      this.loadOrders(); // Refresh current tab
    });
  }
}