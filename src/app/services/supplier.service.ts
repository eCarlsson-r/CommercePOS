import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class SupplierService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/suppliers`;

  getSuppliers() {
    return this.http.get<Supplier[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}