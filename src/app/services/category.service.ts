import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Category } from '@/models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/categories`;

  getCategories() {
    return this.http.get<Category[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  create(data: Category) {
    return this.http.post<Category>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  update(id: number, data: Category) {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}