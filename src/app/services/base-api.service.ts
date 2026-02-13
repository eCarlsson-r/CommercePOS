import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected http = inject(HttpClient);
  protected readonly baseUrl = environment.apiUrl;

  protected getHeaders(isFormData: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'X-Branch-ID': localStorage.getItem('active_branch_id') || ''
    });

    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }
}