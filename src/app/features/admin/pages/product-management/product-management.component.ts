import { Component, inject, signal } from '@angular/core';
import { ProductService } from '@/services/product.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CategoryService } from '@/services/category.service';
import { ProductFormComponent } from './components/product-form/product-form.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProductFormComponent],
  templateUrl: './product-management.component.html'
})

export class ProductManagementComponent {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  // State Signals
  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  isDrawerOpen = signal(false);
  isSaving = signal(false);
  selectedProduct = signal<any | null>(null);
  selectedProductId = signal<number | null>(null);

  ngOnInit() {
    this.refreshProducts();
    this.refreshCategories();
  }

  // The missing refresh function
  refreshProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products.set(data);
    });
  }

  refreshCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories.set(data);
    });
  }

  // Drawer helpers
  openCreateDrawer() {
    this.selectedProduct.set(null);
    this.selectedProductId.set(null);
    this.isDrawerOpen.set(true);
  }

  openEditDrawer(product: any) {
    this.selectedProduct.set(product);
    this.selectedProductId.set(product.id);
    this.isDrawerOpen.set(true);
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
  }

  saveProduct(formData: any) {
    this.isSaving.set(true);
    
    const request = this.selectedProductId() 
      ? this.productService.update(this.selectedProductId()!, formData)
      : this.productService.create(formData);

    request.subscribe({
      next: () => {
        this.refreshProducts(); // Now defined
        this.closeDrawer();    // Now defined
        this.isSaving.set(false);
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error(err);
      }
    });
  }
}