// src/app/features/pages/customer-list/customer-list.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '@/services/customer.service';
import { LucideAngularModule } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of, BehaviorSubject, merge } from 'rxjs';
import { Customer } from '@/models/customer.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent {
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  
  // Search Control with 300ms debounce to save Medan server resources
  searchControl = new FormControl('');
  customerForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    mobile: ['', [Validators.required]],
    email: ['', [Validators.email]],
  });
  showDrawer = signal(false);

  private refresh$ = new BehaviorSubject<void>(undefined);
  
  // Reactive signal that updates whenever the user types in the search box OR calls refreshCustomers()
  customers = toSignal(
    merge(
      this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
      this.refresh$
    ).pipe(
      switchMap(() => {
        const query = this.searchControl.value || '';
        return query 
          ? this.customerService.findCustomer(query)
          : this.customerService.getCustomers();
      })
    ),
    { initialValue: [] as Customer[] }
  );

  ngOnInit() {
    this.refreshCustomers();
  }

  refreshCustomers() {
    this.refresh$.next();
  }

  cancelEdit() {
    this.customerForm.reset({ id: null, name: '', mobile: '', email: '' });
    this.showDrawer.set(false);
  }

  editCustomer(customer: Customer) {
    this.customerForm.patchValue({
      id: customer.id,
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email || '',
    });
    this.showDrawer.set(true);
  }

  deleteCustomer(customer: Customer) {
    if (!customer.id) return;
    if (!window.confirm(`Delete ${customer.name}?`)) return;

    this.customerService.deleteCustomer(customer.id).subscribe({
      next: () => this.refreshCustomers(),
      error: (err: any) => console.error('Error deleting customer:', err),
    });
  }

  saveCustomer() {
    if (this.customerForm.valid) {
      const id = this.customerForm.value.id;
      const payload = {
        name: this.customerForm.value.name,
        mobile: this.customerForm.value.mobile,
        email: this.customerForm.value.email,
      };

      const request$ = id
        ? this.customerService.updateCustomer(id, payload)
        : this.customerService.createCustomer(payload);

      request$.subscribe({
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