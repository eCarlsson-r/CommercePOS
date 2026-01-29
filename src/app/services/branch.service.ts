// src/app/core/services/branch.service.ts
import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class BranchService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/branches`;

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
    return this.http.get<Branch[]>(this.apiUrl).pipe(
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