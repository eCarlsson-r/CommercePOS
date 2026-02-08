import { Injectable } from "@angular/core";
import { BaseApiService } from "./base-api.service";

@Injectable({ providedIn: 'root' })
export class ReturnService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/returns`;

  processReturn(payload: {
    sale_id: number;
    branch_id: number;
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