// src/app/features/admin/pages/inventory/pages/product-management/components/product-form/product-form.component.ts
import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MasterDataStore } from '@/core/store/master-data.store';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  public store = inject(MasterDataStore); // To get categories

  @Input() set initialData(product: any) {
    if (product) {
      this.productForm.patchValue(product);
    }
  }
  
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    sku: ['', [Validators.required]],
    category_id: ['', [Validators.required]],
    base_price: [0, [Validators.required, Validators.min(0)]],
    min_stock_alert: [5, [Validators.required, Validators.min(0)]],
    description: ['']
  });

  ngOnInit() {
    // Ensure categories are loaded for the dropdown
    if (this.store.categories().length === 0) {
      this.store.init();
    }
  }

  submit() {
    if (this.productForm.valid) {
      this.save.emit(this.productForm.value);
    }
  }
}