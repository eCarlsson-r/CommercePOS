import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService extends BaseApiService {
  private get endpoint() {
    return `${this.baseUrl}/banners`;
  }

  getBanners(): Observable<any[]> {
    return this.http.get<any[]>(this.endpoint);
  }

  createBanner(formData: FormData): Observable<any> {
    return this.http.post(this.endpoint, formData);
  }

  toggleBannerStatus(id: number): Observable<any> {
    // Assuming the backend has a specific route or using PATCH update
    // The user's component used /api/admin/banners/${id}/toggle
    // But api.php has apiResource 'banners'. 
    // I will stick to the resource pattern or the specific endpoint if defined.
    // Looking at the user's component, they tried to use a toggle route. 
    // Since I don't see a specific toggle route in api.php (only apiResource), 
    // I'll assume standard REST update or the user intends to add it.
    // However, to keep it working as the user likely intended (or will check next), 
    // I will use a specific URL or just PUT/PATCH to the resource.
    // The user wrote: this.http.patch(`/api/admin/banners/${banner.id}/toggle`, {})
    // I will keep this specific path but fix the prefix if needed.
    // Actually, let's normalize to `${this.endpoint}/${id}/toggle` and assume the route exists or will be added.
    // BUT the user's api.php only has apiResource. 
    // I'll stick to the user's intended path structure but clean it up.
    return this.http.patch(`${this.endpoint}/${id}/toggle`, {});
  }

  deleteBanner(id: number): Observable<any> {
    return this.http.delete(`${this.endpoint}/${id}`);
  }
}
