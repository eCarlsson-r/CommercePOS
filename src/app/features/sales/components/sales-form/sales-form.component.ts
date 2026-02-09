import { Component, OnInit, inject, ViewChild, NgModule, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ThermalReceiptComponent } from '../thermal-receipt/thermal-receipt.component';
import { ProductService } from '@/services/product.service';
import { Product } from '@/models/product.model';
import { Customer } from '@/models/customer.model';
import { CustomerService } from '@/services/customer.service';
import { FormsModule } from '@angular/forms';
import { ActiveSale } from '@/models/sale.model';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ThermalReceiptComponent, FormsModule],
  templateUrl: './sales-form.component.html'
})
export class SalesFormComponent implements OnInit {
  private productService = inject(ProductService);
  private customerService = inject(CustomerService);
  
  products: Product[] = [];
  customers: Customer[] = [];
  isLoading = false;
  scanBuffer = '';
  activeSale = signal<ActiveSale>({
    branchId: 0,
    items: [],
    customerId: null,
    appliedPoints: 0,
    subtotal: 0
  }); 

  ngOnInit() {
    this.loadProducts();
    this.loadCustomers();
  }

  /**
   * Matches {{ total | currency }}
   */
  totalPrice = computed(() => {
    const subtotal = this.activeSale().items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = this.activeSale().appliedPoints * 100; // Example: 1 point = Rp 100
    return subtotal - discount;
  });

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.isLoading = false;
      }
    });
  }

  loadCustomers() {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load customers', err);
        this.isLoading = false;
      }
    });
  }

  selectCustomer(customer: Customer) {
    this.activeSale.update(current => ({
      ...current,
      customerId: customer.id,
      customerName: customer.name
    }));
  }

  // Add this to your Return or Sales Component
  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.processScannedCode(this.scanBuffer);
      this.scanBuffer = ''; // Clear for next scan
    } else {
      this.scanBuffer += event.key;
    }
  }

  processScannedCode(sku: string) {
    const product = this.products.find(p => p.sku === sku);
    if (product) {
      this.addToCart(product); // Add to the return or sales list
    }
  }

  /**
   * Matches (click)="addToCart(product)"
   */
  addToCart(product: any) {
    this.activeSale.update(current => ({
      ...current,
      items: [...current.items, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]
    }));
  }

  // Link to the component in the HTML
  @ViewChild(ThermalReceiptComponent) receipt!: ThermalReceiptComponent;

  /**
   * Matches (click)="processPayment()"
   */
  processPayment() {
    if (this.activeSale().items.length === 0) return alert('Cart is empty!');
    
    console.log('Processing payment for:', this.activeSale().items);
    // 1. Send to Laravel API
    // 2. Trigger Print
    setTimeout(() => {
      window.print();
      this.clearCart();
    }, 100);
  }

  clearCart() {
    this.activeSale.update(current => ({
      ...current,
      items: []
    }));
    this.receipt.items = [];
    this.receipt.total = 0;
  }
}