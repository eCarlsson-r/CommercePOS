// src/app/services/product.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`; // Adjust to your backend URL

  getProducts(branchId?: number): Observable<any[]> {
    let url = this.apiUrl;
    if (branchId) {
      url += `?branch_id=${branchId}`;
    }
    return this.http.get<any[]>(url);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Define the missing 'create'
  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Define the missing 'update'
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}