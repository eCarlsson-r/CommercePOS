import { Injectable } from "@angular/core";
import { BaseApiService } from "./base-api.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ReturnService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/returns`;

  getReturns(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getReturnsBySupplier(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?supplier_id=${supplierId}`);
  }

  processReturn(payload: {
    supplier_id: number;
    items: { 
      product_id: number; 
      quantity: number; 
      condition: 'good' | 'damaged' 
    }[];
    reason: string;
  }) {
    return this.http.post(this.apiUrl, payload);
  }
}