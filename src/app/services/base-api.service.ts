import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected http = inject(HttpClient);
  protected readonly baseUrl = environment.apiUrl + '/admin';

  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // This identifies which branch the POS/Manager is currently "acting" for
      'X-Branch-ID': localStorage.getItem('active_branch_id') || ''
    });
  }
}