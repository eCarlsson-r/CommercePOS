import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private http = inject(HttpClient);
  private baseUrl = environment.aiUrl;

  generateDescription(context: string): Observable<{ text: string }> {
    return this.http.post<{ text: string }>(`${this.baseUrl}/generate-description`, { context });
  }

  generateImage(prompt: string): Observable<{ image_base64: string }> {
    return this.http.post<{ image_base64: string }>(`${this.baseUrl}/generate-image`, { prompt });
  }

  getRecommendations(payload: { 
    productId?: number, 
    contextTags?: string[], 
    maxResults?: number 
  }): Observable<{ items: any[] }> {
    return this.http.post<{ items: any[] }>(`${this.baseUrl}/recommendations`, payload);
  }

  visualSearch(imageUrl: string): Observable<{ items: any[] }> {
    return this.http.post<{ items: any[] }>(`${this.baseUrl}/visual-search`, { imageUrl });
  }

  chatAssistant(message: string): Observable<{ reply: string, followUps: string[] }> {
    return this.http.post<{ reply: string, followUps: string[] }>(`${this.baseUrl}/assistant`, { message });
  }
}
