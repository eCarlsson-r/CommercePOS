// src/app/features/admin/pages/customer-list/customer-list.component.ts
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
  }

  refreshCustomers() {
    this.refresh$.next();
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