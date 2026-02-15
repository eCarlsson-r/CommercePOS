import { Component, inject, signal } from '@angular/core';
import { EcommerceService } from '@/services/ecommerce.service';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { BranchService } from '@/services/branch.service';
import { PackingSlipComponent } from './components/packing-slip.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ecommerce-orders',
  templateUrl: './ecommerce-orders.component.html',
  imports: [LucideAngularModule, CommonModule, FormsModule, PackingSlipComponent]
})
export class EcommerceOrdersComponent {
  private ecommerceService = inject(EcommerceService);
  private branchService = inject(BranchService);  

  activeTab = signal<'paid' | 'processing' | 'shipped' | 'completed'>('paid');
  orders = signal<any[]>([]);
  selectedOrderForPrinting = signal<any>(null);
  selectedBranchName = signal<string>('');
  showShipmentModal = signal(false);
  selectedOrder = signal<any>(null);
  shipmentData = { courier: 'JNE', resi: '' };

  ngOnInit() {
    this.loadOrders();
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
      { status: 'processing', branch_id: this.branchService.selectedBranchId() || 0 }
    ).subscribe({
      next: (res) => {
        // 1. Assign data to the packing slip component
        this.selectedOrderForPrinting.set(res); 
        
        // 2. Refresh the UI tabs
        this.loadOrders();

        // 3. Trigger the print dialog
        setTimeout(() => {
          window.print();
          this.selectedOrderForPrinting.set(null);
        }, 500);
      },
      error: (err) => {
        // If someone else took it, the backend returns 422
        alert(err.error.message || 'This order was just taken by another branch.');
        this.loadOrders();
      }
    });
  }

  releaseOrder(orderId: number) {
    if (confirm('Release this order? It will go back to the "NEW" pool for other branches.')) {
      // We send status 'new' and branch_id null to the backend
      this.ecommerceService.updateStatus(orderId, { 
        status: 'paid', 
        branch_id: null 
      }).subscribe(() => {
        this.loadOrders();
      });
    }
  }

  async cancelOrder(order: any) {
    const reason = prompt("Reason for cancellation:");
    if (reason) {
      this.ecommerceService.updateStatus(order.id, { 
        status: 'cancelled',
        cancel_reason: reason 
      }).subscribe(() => {
        this.loadOrders();
      });
    }
  }

  openShipmentModal(order: any) {
    this.selectedOrder.set(order);
    this.showShipmentModal.set(true);
  }

  onConfirmShipment() {
    const payload = {
      status: 'processed',
      tracking_number: this.shipmentData.resi,
      courier_service: this.shipmentData.courier
    };

    this.ecommerceService.updateStatus(this.selectedOrder().id, payload).subscribe({
      next: () => {
        this.showShipmentModal.set(false);
        this.loadOrders();
        this.shipmentData.resi = ''; // Clear for next use
      },
      error: (err) => alert("Error: " + err.error.message)
    });
  }
}