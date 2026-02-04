import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/categories`;

  getCategories() {
    return this.http.get<Category[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  create(data: { name: string }) {
    return this.http.post<Category>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}