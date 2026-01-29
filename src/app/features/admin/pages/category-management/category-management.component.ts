import { Component, inject } from '@angular/core';
import { CategoryService } from '@/services/category.service';
import { MasterDataStore } from '@/core/store/master-data.store';
import { LucideAngularModule } from "lucide-angular";

@Component({
  standalone: true,
  templateUrl: './category-management.component.html',
  imports: [LucideAngularModule]
})
export class CategoryManagementComponent {
  private categoryService = inject(CategoryService);
  public store = inject(MasterDataStore); // Access pre-loaded categories

  newCategoryName = '';

  saveCategory() {
    if (!this.newCategoryName) return;
    
    this.categoryService.create({ name: this.newCategoryName }).subscribe(() => {
      this.newCategoryName = '';
      // Refresh the global store
      this.store.init(); 
    });
  }
}