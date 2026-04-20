import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OfflineSyncService } from '../../../core/services/offline-sync.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-offline-sync-indicator',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  template: `
    <div class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg" 
         [ngClass]="{
           'bg-red-100 border border-red-400 text-red-700': !(isOnline$ | async),
           'bg-green-100 border border-green-400 text-green-700': (isOnline$ | async),
           'bg-blue-100 border border-blue-400 text-blue-700': (isSyncing$ | async)
         }">
      
      <div class="flex items-center gap-3">
        <!-- Icon -->
        <div class="shrink-0">
          <lucide-icon name="Upload" *ngIf="(isSyncing$ | async)" class="w-5 h-5 animate-spin" />
          <lucide-icon name="WifiOff" *ngIf="!(isOnline$ | async) && !(isSyncing$ | async)" class="w-5 h-5" />
          <lucide-icon name="Wifi" *ngIf="(isOnline$ | async) && !(isSyncing$ | async)" class="w-5 h-5" />
        </div>
        @if (isSyncing$ | async) {
          <div class="font-semibold">
            {{ 'offline.syncing' | translate }}
          </div>
        } @else if (isOnline$ | async) {
          <div class="font-semibold">
            {{ 'offline.connectionRestored' | translate }}
          </div>
        } @else {
          <div class="font-semibold">
            {{ 'offline.connectionLost' | translate }}
            <div class="text-xs mt-1">
              {{ pendingCount }} pending
            </div>
          </div>
        }
        <div *ngIf="(isOnline$ | async) && !(isSyncing$ | async)" class="font-semibold">
          {{ 'offline.connectionRestored' | translate }}
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OfflineSyncIndicatorComponent implements OnInit {
  isOnline$;
  isSyncing$;
  pendingCount = 0;

  constructor(private offlineSync: OfflineSyncService) {
    this.isOnline$ = this.offlineSync.isOnline$;
    this.isSyncing$ = this.offlineSync.isSyncing$;
  }

  ngOnInit(): void {
    // Update pending count periodically
    setInterval(() => {
      this.pendingCount = this.offlineSync.getPendingCount();
    }, 1000);
  }
}
