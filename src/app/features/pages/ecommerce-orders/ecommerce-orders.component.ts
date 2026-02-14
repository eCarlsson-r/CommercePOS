import { Component, inject, signal } from '@angular/core';
import { EcommerceService } from '@/services/ecommerce.service';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BranchService } from '@/services/branch.service';

@Component({
  selector: 'app-ecommerce-orders',
  templateUrl: './ecommerce-orders.component.html',
  imports: [LucideAngularModule, CommonModule, RouterLink]
})
export class EcommerceOrdersComponent {
  private ecommerceService = inject(EcommerceService);
  private branchService = inject(BranchService);  

  activeTab = signal<'paid' | 'processing' | 'shipped' | 'completed'>('paid');
  orders = signal<any[]>([]);

  ngOnInit() {
    this.loadOrders();
    this.ecommerceService.checkNewOrders();
  }
  setTab(tab: any) {
    this.activeTab.set(tab);
    this.loadOrders();
  }

  loadOrders() {
    this.ecommerceService.getOrders(this.activeTab(), this.branchService.selectedBranchId() || 0).subscribe(data => {
      this.orders.set(data);
    });
  }

  processOrder(orderId: number) {
    this.ecommerceService.updateStatus(
      orderId,
      'processing',
      this.branchService.selectedBranchId() || 0
    ).subscribe({
      next: () => {
        this.loadOrders();
        // Trigger Label Print here
        this.printPackingSlip(orderId);
      },
      error: (err) => {
        // If someone else took it, the backend returns 422
        alert(err.error.message || 'This order was just taken by another branch.');
        this.loadOrders();
      }
    });
  }

  openShipmentModal(order: any) {
    // This would trigger your Modal to enter the Resi (Tracking Number)
    // and eventually call the 'finalizeShipment' backend we discussed.
    this.ecommerceService.finalizeShipment(order.id).subscribe(() => {
      this.loadOrders();
    });
  }

  printPackingSlip(orderId: number) {
    // This would trigger your Modal to enter the Resi (Tracking Number)
    // and eventually call the 'finalizeShipment' backend we discussed.
  }
}