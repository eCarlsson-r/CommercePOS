// src/app/features/pages/master/suppliers/suppliers.component.ts
import { Component, inject, signal } from '@angular/core';
import { SupplierService } from '@/services/supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './supplier-list.component.html'
})
export class SupplierListComponent {
  private supplierService = inject(SupplierService);
  
  suppliers = signal<any[]>([]);
  isLoading = signal(true);
  showDrawer = signal(false);

  // Form State
  formData = { name: '', contact_person: '', phone: '', tax_id: '', email: '', address: '' };
  editingSupplier = signal(0);

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe(data => {
      this.suppliers.set(data);
      this.isLoading.set(false);
    });
  }

  saveSupplier() {
    const obs$ = this.editingSupplier() > 0
      ? this.supplierService.updateSupplier(this.editingSupplier(), this.formData)
      : this.supplierService.createSupplier(this.formData);

    obs$.subscribe(() => {
      this.loadSuppliers();
      this.showDrawer.set(false);
      this.resetForm();
    });
  }

  editSupplier(supplier: any) {
    this.editingSupplier.set(supplier.id);
    this.formData = supplier;
    this.showDrawer.set(true);
  }

  deleteSupplier(id: number) {
    this.supplierService.deleteSupplier(id).subscribe(() => {
      this.loadSuppliers();
    });
  }

  resetForm() {
    this.formData = { name: '', contact_person: '', phone: '', tax_id: '', email: '', address: '' };
  }
}