import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private supportedLanguages = ['en', 'sv'];
  private storageKey = 'app_language';

  constructor(private translateService: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Try to get stored language or use browser language or default to 'en'
    const storedLanguage = this.getStoredLanguage();
    const browserLanguage = this.getBrowserLanguage();
    const language = storedLanguage || browserLanguage || 'en';

    this.setLanguage(language);
  }

  private getStoredLanguage(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.storageKey);
    }
    return null;
  }

  private getBrowserLanguage(): string | null {
    if (typeof window !== 'undefined' && navigator) {
      const browserLang = navigator.language.split('-')[0];
      if (this.supportedLanguages.includes(browserLang)) {
        return browserLang;
      }
    }
    return null;
  }

  setLanguage(language: string): void {
    if (this.supportedLanguages.includes(language)) {
      this.translateService.use(language);
      this.currentLanguageSubject.next(language);

      if (typeof window !== 'undefined' && localStorage) {
        localStorage.setItem(this.storageKey, language);
      }
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  translate(key: string, params?: any): Observable<any> {
    return this.translateService.get(key, params);
  }

  instant(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }
}
