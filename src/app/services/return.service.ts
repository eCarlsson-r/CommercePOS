import { Injectable } from "@angular/core";
import { BaseApiService } from "./base-api.service";
import { map, catchError, of, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ReturnService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/returns`;

  getReturns(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Error fetching returns:', err);
        return of([]); // Return empty array on error
      })
    );
  }

  getReturnsBySupplier(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?supplier_id=${supplierId}`).pipe(
      catchError(err => {
        console.error('Error fetching returns by supplier:', err);
        return of([]);
      })
    );
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