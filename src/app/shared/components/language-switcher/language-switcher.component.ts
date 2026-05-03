import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationService } from '@/core/services/localization.service';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  template: `
    <div class="relative inline-block text-left">
      <button (click)="toggleDropdown()" 
              class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
        <lucide-icon name="languages" class="w-4 h-4 text-primary"></lucide-icon>
        <span class="text-[10px] font-black uppercase tracking-widest text-gray-700">
          {{ (currentLanguage$ | async) }}
        </span>
        <lucide-icon name="chevron-down" class="w-3 h-3 text-gray-400"></lucide-icon>
      </button>

      @if (isOpen()) {
        <div class="absolute right-0 mt-2 w-32 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
          <div class="py-1">
            @for (lang of languages; track lang) {
              <button (click)="changeLang(lang)"
                      [class.bg-primary]="(currentLanguage$ | async) === lang"
                      [class.text-white]="(currentLanguage$ | async) === lang"
                      class="flex w-full items-center px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
                {{ lang === 'en' ? 'English' : 'Indonesia' }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class LanguageSwitcherComponent {
  private localizationService = inject(LocalizationService);
  
  currentLanguage$ = this.localizationService.currentLanguage$;
  isOpen = signal(false);
  languages = ['en', 'id'];

  toggleDropdown() {
    this.isOpen.update(v => !v);
  }

  changeLang(lang: string) {
    this.localizationService.setLanguage(lang);
    this.isOpen.set(false);
  }
}
