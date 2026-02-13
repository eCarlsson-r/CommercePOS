import { Component, inject, signal, computed } from '@angular/core';
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

  searchQuery = signal('');
  selectedCategory = signal<string>('All');

  filteredProducts = computed(() => {
    return this.products().filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchQuery().toLowerCase()) || 
                            p.sku.toLowerCase().includes(this.searchQuery().toLowerCase());
      const matchesCat = this.selectedCategory() === 'All' || p.category_id == this.selectedCategory();
      return matchesSearch && matchesCat;
    });
  });

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

  saveProduct(eventData: any) {
    this.isSaving.set(true);

    const { images, ...formData } = eventData;
    
    const request = this.selectedProductId() 
      ? this.productService.update(this.selectedProductId()!, formData, images)
      : this.productService.create(formData, images);

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