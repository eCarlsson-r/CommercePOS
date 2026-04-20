import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationService } from '@/core/services/localization.service';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslateModule, TranslatePipe],
  template: `
    <div class="flex gap-2 items-center">
      <label class="text-sm font-semibold">{{ 'common.language' | translate }}</label>
      <select 
        [value]="currentLanguage$ | async" 
        (change)="onLanguageChange($event)"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
      >
        <option value="en">English</option>
        <option value="sv">Svenska</option>
      </select>
    </div>
  `,
  styles: []
})
export class LanguageSwitcherComponent implements OnInit {
  currentLanguage$;

  constructor(private localizationService: LocalizationService) {
    this.currentLanguage$ = this.localizationService.currentLanguage$;
  }

  ngOnInit(): void {
    // Localization service is initialized in app config
  }

  onLanguageChange(event: Event): void {
    const language = (event.target as HTMLSelectElement).value;
    this.localizationService.setLanguage(language);
  }
}
