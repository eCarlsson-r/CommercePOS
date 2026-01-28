import { Component, OnInit, inject, ViewChild, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ThermalReceiptComponent } from '../thermal-receipt/thermal-receipt.component';
import { ProductService } from '@/services/product.service';
import { Product } from '@/models/product.model';
import { Customer } from '@/models/customer.model';
import { CustomerService } from '@/services/customer.service';
import { FormsModule } from '@angular/forms';

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

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
  selectedCustomerId: string | null = null;

  // Must match the *ngFor="let item of cart"
  cart: CartItem[] = [];

  ngOnInit() {
    this.loadProducts();
    this.loadCustomers();
  }

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

  /**
   * Matches (click)="addToCart(product)"
   */
  addToCart(product: Product) {
    const existingItem = this.cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.sale_price,
        qty: 1
      });
    }
  }

  /**
   * Matches {{ total | currency }}
   */
  get total(): number {
    return this.cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
  }

  // Link to the component in the HTML
  @ViewChild(ThermalReceiptComponent) receipt!: ThermalReceiptComponent;

  /**
   * Matches (click)="processPayment()"
   */
  processPayment() {
    if (this.cart.length === 0) return alert('Cart is empty!');
    
    console.log('Processing payment for:', this.cart);
    // 1. Send to Laravel API
    // 2. Trigger Print
    setTimeout(() => {
      window.print();
      this.clearCart();
    }, 100);
  }

  clearCart() {
    this.cart = [];
    this.receipt.items = [];
    this.receipt.total = 0;
  }
}