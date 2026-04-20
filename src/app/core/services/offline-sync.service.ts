import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface OfflineMutation {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
  retries: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {
  private mutations = new BehaviorSubject<OfflineMutation[]>([]);
  public mutations$ = this.mutations.asObservable();

  private isOnline = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnline.asObservable();

  private isSyncing = new BehaviorSubject<boolean>(false);
  public isSyncing$ = this.isSyncing.asObservable();

  private storageKey = 'pos_offline_mutations';

  constructor(private http: HttpClient) {
    this.loadFromStorage();
    this.setupNetworkListeners();
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  private handleOnline(): void {
    console.log('POS: Connection restored');
    this.isOnline.next(true);
    this.syncPendingMutations();
  }

  private handleOffline(): void {
    console.log('POS: Connection lost');
    this.isOnline.next(false);
  }

  /**
   * Queue a mutation for later sync
   */
  public queueMutation(type: string, payload: any): void {
    const mutation: OfflineMutation = {
      id: `${type}_${Date.now()}_${Math.random()}`,
      type,
      payload,
      timestamp: Date.now(),
      status: 'pending',
      retries: 0
    };

    const current = this.mutations.value;
    this.mutations.next([...current, mutation]);
    this.saveToStorage();
  }

  /**
   * Sync all pending mutations
   */
  public async syncPendingMutations(): Promise<void> {
    if (this.isSyncing.value || !navigator.onLine) {
      return;
    }

    this.isSyncing.next(true);
    const pending = this.mutations.value.filter(m => m.status === 'pending');

    for (const mutation of pending) {
      try {
        await this.syncMutation(mutation);
        mutation.status = 'synced';
      } catch (error) {
        mutation.retries++;
        if (mutation.retries > 3) {
          mutation.status = 'failed';
        }
      }
    }

    this.mutations.next([...this.mutations.value]);
    this.saveToStorage();
    this.isSyncing.next(false);
  }

  private syncMutation(mutation: OfflineMutation): Promise<any> {
    // Send to API endpoint based on type
    return this.http.post(`/api/mutations/${mutation.type}`, mutation.payload).toPromise();
  }

  /**
   * Get pending mutations count
   */
  public getPendingCount(): number {
    return this.mutations.value.filter(m => m.status === 'pending').length;
  }

  /**
   * Clear synced mutations
   */
  public clearSyncedMutations(): void {
    const filtered = this.mutations.value.filter(m => m.status !== 'synced');
    this.mutations.next(filtered);
    this.saveToStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const mutations = JSON.parse(stored) as OfflineMutation[];
        this.mutations.next(mutations);
      }
    } catch (error) {
      console.error('Failed to load offline mutations from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.mutations.value));
    } catch (error) {
      console.error('Failed to save offline mutations to storage:', error);
    }
  }
}
