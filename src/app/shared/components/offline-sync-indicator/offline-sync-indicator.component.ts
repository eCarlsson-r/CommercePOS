import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OfflineSyncService } from '../../../core/services/offline-sync.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-offline-sync-indicator',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  template: `
    <div class="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 shadow-sm"
         [ngClass]="{
           'bg-red-50 border-red-200 text-red-600': !(isOnline$ | async),
           'bg-green-50 border-green-200 text-green-600': (isOnline$ | async) && !(isSyncing$ | async),
           'bg-blue-50 border-blue-200 text-blue-600': (isSyncing$ | async)
         }">
      
      <div class="flex items-center gap-2">
        @if (isSyncing$ | async) {
          <lucide-icon name="refresh-cw" class="w-4 h-4 animate-spin"></lucide-icon>
          <span class="text-[10px] font-black uppercase tracking-widest">{{ 'offline.syncing' | translate }}</span>
        } @else if (!(isOnline$ | async)) {
          <lucide-icon name="wifi-off" class="w-4 h-4"></lucide-icon>
          <div class="flex flex-col leading-tight">
            <span class="text-[10px] font-black uppercase tracking-widest">{{ 'offline.connectionLost' | translate }}</span>
            <span class="text-[8px] font-bold opacity-70">{{ pendingCount }} {{ 'offline.syncPending' | translate }}</span>
          </div>
        } @else {
          <lucide-icon name="wifi" class="w-4 h-4"></lucide-icon>
          <span class="text-[10px] font-black uppercase tracking-widest">{{ 'offline.title' | translate }}</span>
        }
      </div>
    </div>
  `,
  styles: []
})
export class OfflineSyncIndicatorComponent {
  private offlineSync = inject(OfflineSyncService);
  
  isOnline$ = this.offlineSync.isOnline$;
  isSyncing$ = this.offlineSync.isSyncing$;
  
  get pendingCount() {
    return this.offlineSync.getPendingCount();
  }
}
