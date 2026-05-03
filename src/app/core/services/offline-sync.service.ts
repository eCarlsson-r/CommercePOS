import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IndexedDBService, StoreName } from './indexed-db.service';

export interface OfflineMutation {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
  retries: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {
  private http = inject(HttpClient);
  private idb = inject(IndexedDBService);

  private mutations = new BehaviorSubject<OfflineMutation[]>([]);
  public mutations$ = this.mutations.asObservable();

  private isOnline = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnline.asObservable();

  private isSyncing = new BehaviorSubject<boolean>(false);
  public isSyncing$ = this.isSyncing.asObservable();

  constructor() {
    this.loadFromDB();
    this.setupNetworkListeners();
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  private handleOnline(): void {
    this.isOnline.next(true);
    this.syncPendingMutations();
  }

  private handleOffline(): void {
    this.isOnline.next(false);
  }

  public async queueMutation(type: string, payload: any): Promise<void> {
    const mutation: OfflineMutation = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: Date.now(),
      status: 'pending',
      retries: 0
    };

    await this.idb.put(StoreName.MUTATION_QUEUE, mutation);
    const current = await this.idb.getAll<OfflineMutation>(StoreName.MUTATION_QUEUE);
    this.mutations.next(current);

    if (navigator.onLine) {
      this.syncPendingMutations();
    }
  }

  public async syncPendingMutations(): Promise<void> {
    if (this.isSyncing.value || !navigator.onLine) {
      return;
    }

    this.isSyncing.next(true);
    const allMutations = await this.idb.getAll<OfflineMutation>(StoreName.MUTATION_QUEUE);
    const pending = allMutations.filter(m => m.status === 'pending' || m.status === 'failed');

    for (const mutation of pending) {
      try {
        await this.syncMutation(mutation);
        mutation.status = 'synced';
        // Once synced, we can either keep it as 'synced' or remove it.
        // For a POS, removing it after sync is often cleaner to keep DB small.
        await this.idb.remove(StoreName.MUTATION_QUEUE, mutation.id);
      } catch (error: any) {
        mutation.retries++;
        mutation.error = error.message;
        if (mutation.retries > 5) {
          mutation.status = 'failed';
        }
        await this.idb.put(StoreName.MUTATION_QUEUE, mutation);
      }
    }

    const updatedMutations = await this.idb.getAll<OfflineMutation>(StoreName.MUTATION_QUEUE);
    this.mutations.next(updatedMutations);
    this.isSyncing.next(false);
  }

  private syncMutation(mutation: OfflineMutation): Promise<any> {
    // Mapping types to actual endpoints
    const endpointMap: Record<string, string> = {
      'sale.create': '/api/sales',
      'product.update': `/api/products/${mutation.payload.id}`,
      'product.create': '/api/products',
      'inventory.transfer': '/api/inventory/transfers'
    };

    const url = endpointMap[mutation.type] || `/api/mutations/${mutation.type}`;
    return this.http.post(url, mutation.payload).toPromise();
  }

  public getPendingCount(): number {
    return this.mutations.value.filter(m => m.status === 'pending' || m.status === 'failed').length;
  }

  private async loadFromDB(): Promise<void> {
    const data = await this.idb.getAll<OfflineMutation>(StoreName.MUTATION_QUEUE);
    this.mutations.next(data);
  }
}
