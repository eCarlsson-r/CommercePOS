// src/app/core/services/product.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(branchId?: number | null): Observable<Product[]> {
    let url = this.apiUrl;
    if (branchId) {
      url += `?branch_id=${branchId}`;
    }
    return this.http.get<Product[]>(url);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Fetches items that are low on stock.
   * If branchId is provided, it filters by that specific store.
   */
  getLowStock(branchId?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (branchId) {
      params = params.set('branch_id', branchId.toString());
    }
    // Targets the /products/low-stock endpoint in Laravel
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock`, { params });
  }
}