import { Component, inject, signal } from '@angular/core';
import { CategoryService } from '@/services/category.service';
import { LucideAngularModule } from "lucide-angular";
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  templateUrl: './category-management.component.html',
  imports: [LucideAngularModule, FormsModule]
})
export class CategoryManagementComponent {
  private categoryService = inject(CategoryService);

  categories = signal<any[]>([]);
  editingCategory = signal<any | null>(null);
  categoryName = signal(''); // Bound to the input field
  categoryDescription = signal(''); // Bound to the input field

  ngOnInit() {
    this.refreshCategories();
  }

  refreshCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories.set(data);
    });
  }

  // --- TRASH FUNCTION (DELETE) ---
  deleteCategory(id: number) {
    if (confirm('Are you sure? This may affect products linked to this category.')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          // Update local state immediately for a snappy UI
          this.categories.update(items => items.filter(c => c.id !== id));
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  // --- PENCIL FUNCTION (EDIT) ---
  editCategory(category: any) {
    // Fill the "New Category" input with the existing name
    this.editingCategory.set(category);
    this.categoryName.set(category.name);
    this.categoryDescription.set(category.description);    
    // Smoothly scroll to the form if on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Modified Save Function to handle both Create and Update
  saveCategory() {
    if (!this.categoryName()) return;

    const obs$ = this.editingCategory() 
      ? this.categoryService.update(this.editingCategory().id, { 
        name: this.categoryName(), 
        slug:this.categoryName().replace(/\s+/g, '-').toLowerCase(), 
        description: this.categoryDescription() 
      })
      : this.categoryService.create({ 
        name: this.categoryName(), 
        slug:this.categoryName().replace(/\s+/g, '-').toLowerCase(), 
        description: this.categoryDescription() 
      });

    obs$.subscribe(() => {
      this.refreshCategories(); // Refresh list
      this.cancelEdit();     // Clear form
    });
  }

  cancelEdit() {
    this.editingCategory.set(null);
    this.categoryName.set('');
    this.categoryDescription.set('');
  }
}