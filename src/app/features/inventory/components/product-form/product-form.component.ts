// src/app/features/inventory/components/product-form/product-form.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '@/services/product.service';
import { MediaUploaderComponent } from '@/shared/components/media-uploader/media-uploader.component';
import { CategoryService } from '@/services/category.service';
import { SupplierService } from '@/services/supplier.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BranchService } from '@/services/branch.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MediaUploaderComponent],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private supplierService = inject(SupplierService);
  private branchService = inject(BranchService);

  branches = toSignal(this.branchService.getBranches(), { initialValue: [] })();
  categories = toSignal(this.categoryService.getCategories(), { initialValue: [] })();
  suppliers = toSignal(this.supplierService.getSuppliers(), { initialValue: [] })();

  productForm = this.fb.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    category_id: [null, Validators.required],
    branch_id: [null, Validators.required],
    purchase_price: [0, [Validators.required, Validators.min(0)]],
    sale_price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    min_stock: [5, Validators.required]
  });

  uploadedFiles: File[] = [];

  // Matches the (onUpload) event from your MediaUploader
  handleImageUpload(files: File[]) {
    this.uploadedFiles = files;
  }

  saveProduct() {
    if (this.productForm.valid) {
      // Since we have images, we use FormData instead of a standard JSON object
      const formData = new FormData();
      
      // Append form fields
      Object.keys(this.productForm.value).forEach(key => {
        formData.append(key, (this.productForm.value as any)[key]);
      });

      // Append files
      this.uploadedFiles.forEach(file => {
        formData.append('images[]', file);
      });

      this.productService.createProduct(formData as any).subscribe({
        next: (res) => console.log('Product Saved!', res),
        error: (err) => console.error('Upload failed', err)
      });
    }
  }
}