// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/products`; // Adjust to your backend URL

  getProducts(branchId?: number): Observable<any[]> {
    let url = this.apiUrl;
    if (branchId) {
      url += `?branch_id=${branchId}`;
    }
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Define the missing 'create'
  create(data: any, files: File[]): Observable<any> {
    const formData = new FormData();
  
    // Universal data
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    
    // Gallery data
    files.forEach((file) => {
      formData.append(`images[]`, file);
    });

    return this.http.post(this.apiUrl, formData, { headers: this.getHeaders(true) });
  }

  // Define the missing 'update'
  update(id: number, data: any, files: File[]): Observable<any> {
    const formData = new FormData();
  
    // Universal data
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    // Method spoofing for Laravel
    formData.append('_method', 'PUT');
    
    // Gallery data
    files.forEach((file) => {
      formData.append(`images[]`, file);
    });
    
    return this.http.post(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders(true) });
  }
}