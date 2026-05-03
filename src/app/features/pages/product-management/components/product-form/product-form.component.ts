// src/app/features/pages/inventory/pages/product-management/components/product-form/product-form.component.ts
import { Component, Input, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CategoryService } from '@/services/category.service';
import { AIService } from '@/services/ai.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private aiService = inject(AIService);

  isGeneratingDescription = signal(false);
  isGeneratingImage = signal(false);

  categories = signal<any[]>([]);
  previews = signal<string[]>([]);
  selectedFiles: File[] = [];

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
    this.refreshCategories();
  }

  refreshCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories.set(data);
    });
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.update(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.previews.update(prev => prev.filter((_, i) => i !== index));
    this.selectedFiles.splice(index, 1);
  }

  submit() {
    if (this.productForm.valid) {
      // We emit an object containing both the form values and the files
      this.save.emit({
        ...this.productForm.value,
        images: this.selectedFiles
      });
    }
  }

  generateDescription() {
    const name = this.productForm.get('name')?.value;
    if (!name) return;

    this.isGeneratingDescription.set(true);
    this.aiService.generateDescription(name).subscribe({
      next: (res) => {
        this.productForm.patchValue({ description: res.text });
        this.isGeneratingDescription.set(false);
      },
      error: () => this.isGeneratingDescription.set(false)
    });
  }

  generateAIImage() {
    const name = this.productForm.get('name')?.value;
    if (!name) return;

    this.isGeneratingImage.set(true);
    this.aiService.generateImage(`Professional product photo of ${name} on white background`).subscribe({
      next: (res) => {
        const base64 = `data:image/png;base64,${res.image_base64}`;
        this.previews.update(prev => [...prev, base64]);
        
        // Convert base64 to file for form submission
        fetch(base64)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `${name.replace(/\s+/g, '_')}_ai.png`, { type: 'image/png' });
            this.selectedFiles.push(file);
          });

        this.isGeneratingImage.set(false);
      },
      error: () => this.isGeneratingImage.set(false)
    });
  }
}