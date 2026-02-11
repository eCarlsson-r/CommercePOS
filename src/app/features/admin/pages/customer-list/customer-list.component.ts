// src/app/features/admin/pages/customer-list/customer-list.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '@/services/customer.service';
import { LucideAngularModule } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { Customer } from '@/models/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent {
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  
  // Search Control with 300ms debounce to save Medan server resources
  searchControl = new FormControl('');
  customerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });
  showDrawer = signal(false);

  // Reactive signal that updates whenever the user types in the search box
  customers = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query) return of([]); // Return empty if search is cleared
        return this.customerService.findCustomer(query);
      })
    ),
    { initialValue: [] as Customer[] }
  );

  ngOnInit() {
    this.refreshCustomers();
  }

  refreshCustomers() {
    this.customerService.getCustomers();
  }

  cancelEdit() {
    this.showDrawer.set(false);
  }

  saveCustomer() {
    if (this.customerForm.valid) {
      this.customerService.createCustomer(this.customerForm.value).subscribe({
        next: () => {
          this.refreshCustomers();
          this.cancelEdit();
        },
        error: (err: any) => {
          console.error('Error saving customer:', err);
        }
      });
    }
  }
}