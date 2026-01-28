import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected http = inject(HttpClient);
  protected readonly baseUrl = 'http://localhost:8000/api/v1/admin';

  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // This identifies which branch the POS/Manager is currently "acting" for
      'X-Branch-ID': localStorage.getItem('active_branch_id') || ''
    });
  }
}