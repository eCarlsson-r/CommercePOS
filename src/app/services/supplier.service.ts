import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/suppliers`;

  getSuppliers() {
    return this.http.get<Supplier[]>(this.apiUrl);
  }
}