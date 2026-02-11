// src/app/core/services/branch.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Branch } from '@/models/branch.model';

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
          this.selectedBranchId.set(data[0].id!);
        }
      })
    );
  }

  createBranch(data: Branch) {
    return this.http.post<Branch>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  updateBranch(id: number, data: Branch) {
    return this.http.put<Branch>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  setBranch(id: number) {
    this.selectedBranchId.set(id);
  }
}