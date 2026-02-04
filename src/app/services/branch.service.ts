// src/app/core/services/branch.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class BranchService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/branches`;

  // Signals for state
  branches = signal<Branch[]>([]);
  selectedBranchId = signal<number | null>(null);

  // Computed signal to get the full object of the currently selected branch
  selectedBranch = computed(() => 
    this.branches().find(b => b.id === this.selectedBranchId()) || null
  );

  /**
   * Fetches all branches from the Laravel backend.
   * This is called during the App Initializer phase.
   */
  getBranches() {
    return this.http.get<Branch[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(data => {
        this.branches.set(data);
        // Default to the first active branch if nothing is selected yet
        if (!this.selectedBranchId() && data.length > 0) {
          this.selectedBranchId.set(data[0].id);
        }
      })
    );
  }

  setBranch(id: number) {
    this.selectedBranchId.set(id);
  }
}