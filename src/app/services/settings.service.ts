import { Injectable } from "@angular/core";
import { Setting } from "@/models/setting.model";
import { signal } from "@angular/core";
import { BaseApiService } from "./base-api.service";

@Injectable({ providedIn: 'root' })
export class SettingsService extends BaseApiService {
  private settings = signal<Record<string, string>>({});

  // Fetch all settings once at login/init
  loadSettings() {
    this.http.get<Setting[]>(`${this.baseUrl}/settings`).subscribe(data => {
      const mapped = data.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
      this.settings.set(mapped);
    });
  }

  // Quick helper to get the cipher key
  getCipherKey() {
    return this.settings()['cost_cipher_key'] || 'REPUBLICAN';
  }

  updateSetting(key: string, value: string) {
    return this.http.put(`${this.baseUrl}/settings/${key}`, { value });
  }
}