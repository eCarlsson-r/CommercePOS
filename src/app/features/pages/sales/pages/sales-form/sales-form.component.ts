import { Component, OnInit, inject, ViewChild, NgModule, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ThermalReceiptComponent } from '../../components/thermal-receipt/thermal-receipt.component';
import { ProductService } from '@/services/product.service';
import { Product } from '@/models/product.model';
import { Customer } from '@/models/customer.model';
import { CustomerService } from '@/services/customer.service';
import { FormsModule } from '@angular/forms';
import { ActiveSale } from '@/models/sale.model';
import { BranchService } from '@/services/branch.service';
import { SaleService } from '@/services/sale.service';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ThermalReceiptComponent, FormsModule],
  templateUrl: './sales-form.component.html'
})
export class SalesFormComponent implements OnInit {
  private productService = inject(ProductService);
  private customerService = inject(CustomerService);
  private branchService = inject(BranchService);
  private salesService = inject(SaleService);
  
  products: Product[] = [];
  customers: Customer[] = [];
  isLoading = false;
  searchQuery = '';
  searchResults = signal<any[]>([]);
  scanBuffer = '';
  selectedCustomerBalance = signal(0);
  manualDiscount = 0;
  showPaymentModal = signal(false);
  selectedPayments = signal<{payment_method: string, amount_paid: number}[]>([]);
  activeSale = signal<ActiveSale>({
    branch_id: 0,
    items: [],
    customer_id: null,
    appliedPoints: 0,
    subtotal: 0
  }); 

  lastSale = signal<any>(null);
  
  ngOnInit() {
    this.loadProducts();
    this.loadCustomers();
  }

  totalPrice = computed(() => {
    const subtotal = this.activeSale().subtotal;
    const pointDiscount = this.activeSale().appliedPoints * 100; // 1 pt = Rp 100
    const final = Number(subtotal) - pointDiscount - this.manualDiscount;
    return final < 0 ? 0 : final; // Prevent negative totals
  });

  calculateBalance = computed(() => {
    const paid = this.selectedPayments().reduce((acc, p) => acc + p.amount_paid, 0);
    return this.totalPrice() - paid;
  });

  onCustomerChange(customerId: any) {
    if (!customerId || customerId === 'null') {
      this.activeSale.update(s => ({ ...s, customer_id: null, appliedPoints: 0 }));
      this.selectedCustomerBalance.set(0);
    } else {
      const customer = this.customers.find(c => c.id == customerId);
      if (customer) {
        this.selectCustomer(customer);
        this.activeSale.update(s => ({ ...s, customer_id: customerId, appliedPoints: 0 }));
      }
    }
  }

  addPaymentMethod(type: string) {
    // If the method already exists, don't add another row, just focus it
    const existing = this.selectedPayments().find(p => p.payment_method === type);
    if (!existing) {
      // Auto-fill the remaining balance for convenience
      this.selectedPayments.update(p => [...p, { payment_method: type, amount_paid: this.calculateBalance() }]);
    }
  }

  getBranchStock(product: Product) {
    const branch_id = this.branchService.selectedBranchId();
    if (!branch_id) return null;
    return product.stocks?.find((s: any) => parseInt(s.branch_id) === branch_id) || null;
  }

  loadProducts(search?: string) {
    const branch_id = this.branchService.selectedBranchId() || 0;
    this.productService.getProducts(branch_id, search).subscribe((data) => {
      // Only show products that have a stock entry for THIS specific branch with quantity > 0
      this.products = data.filter(p => {
        const stock = this.getBranchStock(p);
        return stock && stock.quantity > 0;
      });
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
      customer_id: customer.id,
      customer_name: customer.name,
      appliedPoints: 0 // Reset points on customer change
    }));
    this.selectedCustomerBalance.set(customer.points || 0);
  }

  togglePoints() {
    const current = this.activeSale();
    // If points not applied, apply all available points
    const pointsToApply = current.appliedPoints > 0 ? 0 : this.selectedCustomerBalance();
    this.activeSale.update(state => ({ ...state, appliedPoints: pointsToApply }));
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

  onSearch() {
    if (this.searchQuery.length < 2) this.loadProducts();
    else this.loadProducts(this.searchQuery);
  }

  reduceQuantity(item: any) {
    this.activeSale.update(current => {
      const existingItem = current.items.find(i => i.product_id === item.product_id);
      
      if (existingItem && existingItem.quantity > 1) {
        // Decrement quantity of existing line item
        return {
          ...current,
          items: current.items.map(i => 
            i.product_id === item.product_id ? { ...i, quantity: i.quantity - 1 } : i
          ),
          subtotal: current.subtotal - item.price
        };
      }
      
      // Remove line item if quantity is 1
      return {
        ...current,
        items: current.items.filter(i => i.product_id !== item.product_id),
        subtotal: current.subtotal - item.price
      };
    });
  }

  addQuantity(item: any) {
    const product = this.products.find(p => p.id === item.product_id);
    const stock = product ? this.getBranchStock(product) : null;

    this.activeSale.update(current => {
      const existingItem = current.items.find(i => i.product_id === item.product_id);
      if (existingItem) {
        // Increment quantity of existing line item if stock allows
        if (stock && existingItem.quantity < stock.quantity) {
          return {
            ...current,
            items: current.items.map(i => 
              i.product_id === item.product_id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            subtotal: current.subtotal + item.price
          };
        }
        return current;
      }
      
      // Add new line item if not existing and stock > 0
      if (stock && stock.quantity > 0) {
        return {
          ...current,
          items: [...current.items, { 
            product_id: item.product_id, 
            name: item.name, 
            price: item.price, 
            quantity: 1 
          }],
          subtotal: current.subtotal + item.price
        };
      }
      return current;
    });
  }

  addToCart(product: any) {
    const stock = this.getBranchStock(product);
    if (!stock || stock.quantity <= 0) return;

    this.activeSale.update(current => {
      const existingItem = current.items.find(i => i.product_id === product.id);
      
      if (existingItem) {
        if (existingItem.quantity < stock.quantity) {
          // Increment quantity of existing line item
          return {
            ...current,
            items: current.items.map(i => 
              i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            subtotal: current.subtotal + Number(stock.sale_price)
          };
        }
        return current;
      }
      
      // Add new line item
      return {
        ...current,
        items: [...current.items, { 
          product_id: product.id, 
          name: product.name, 
          price: Number(stock.sale_price),
          quantity: 1 
        }],
        subtotal: current.subtotal + Number(stock.sale_price)
      };
    });
  }

  // Link to the component in the HTML
  @ViewChild(ThermalReceiptComponent) receipt!: ThermalReceiptComponent;

  // Add to SalesFormComponent
  updatePaymentAmount(index: number, amount_paid: any) {
    this.selectedPayments.update(list => {
      const newList = [...list];
      newList[index] = { ...newList[index], amount_paid: Number(amount_paid) };
      return newList;
    });
  }

  removePayment(index: number) {
    this.selectedPayments.update(list => list.filter((_, i) => i !== index));
  }

  hasCashPayment(): boolean {
    return this.selectedPayments().some(p => p.payment_method === 'CASH');
  }

  calculateChange(): number {
    const paidTotal = this.selectedPayments().reduce((acc, p) => acc + p.amount_paid, 0);
    const diff = paidTotal - this.totalPrice();
    return diff > 0 ? diff : 0;
  }

  // Ensure processPayment clears the old payment selections
  processPayment() {
    if (this.activeSale().items.length === 0) return;
    this.selectedPayments.set([]); // Reset for new transaction
    this.showPaymentModal.set(true);
  }

  submitPayment() {
    const payload = {
      branch_id: this.branchService.selectedBranchId(),
      items: this.activeSale().items,
      customer_id: this.activeSale().customer_id,
      applied_points: this.activeSale().appliedPoints,
      manual_discount: this.manualDiscount,
      subtotal: this.activeSale().subtotal,
      grand_total: this.totalPrice(),
      payments: this.selectedPayments()
    };

    this.salesService.createSale(payload).subscribe({
      next: (res: any) => {
        // Set lastSale so the receipt template binds to it
        this.lastSale.set({
          ...res,
          change: this.calculateChange(),
          branch: this.branchService.selectedBranch()
        });
        
        // Brief timeout ensures Angular updates the Receipt DOM before printing
        setTimeout(() => {
          window.print();
          this.clearCart();
          this.closePayment();
          alert('Transaction Successful!');
        }, 100);
      },
      error: (err) => alert('Payment Failed: ' + err.message)
    });
  }

  closePayment() {
    this.showPaymentModal.set(false);
    this.lastSale.set(null);
    this.selectedPayments.set([]);
    this.manualDiscount = 0;
    this.selectedCustomerBalance.set(0);
  }

  clearCart() {
    this.activeSale.update(current => ({
      ...current,
      items: [],
      subtotal: 0,
      customer_id: null,
      appliedPoints: 0
    }));
  }
}