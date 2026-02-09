// src/app/features/admin/pages/master/suppliers/suppliers.component.ts
import { Component, inject, signal } from '@angular/core';
import { SupplierService } from '@/services/supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './supplier-list.component.html'
})
export class SupplierListComponent {
  private supplierService = inject(SupplierService);
  
  suppliers = signal<any[]>([]);
  isLoading = signal(true);
  showDrawer = signal(false);

  // Form State
  formData = { name: '', contact_person: '', phone: '', tax_id: '', email: '', address: '' };

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
    this.supplierService.create(this.formData).subscribe(() => {
      this.loadSuppliers();
      this.showDrawer.set(false);
      this.resetForm();
    });
  }

  resetForm() {
    this.formData = { name: '', contact_person: '', phone: '', tax_id: '', email: '', address: '' };
  }
}