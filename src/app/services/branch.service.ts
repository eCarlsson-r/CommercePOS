// src/app/core/services/branch.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface Branch {
  id: number;
  name: string;
  code: string;
}

@Injectable({ providedIn: 'root' })
export class BranchService {
  private http = inject(HttpClient);
  private apiUrl = '/api/branches';

  // State
  branches = signal<Branch[]>([]);
  selectedBranch = signal<Branch | null>(null);

  // 1. Fetch from Laravel
  getBranches() {
    return this.http.get<Branch[]>(this.apiUrl).pipe(
      tap(data => {
        this.branches.set(data);
        // Default to the first branch if none is selected
        if (!this.selectedBranch() && data.length > 0) {
          this.selectedBranch.set(data[0]);
        }
      })
    );
  }

  setBranch(input: Branch | number) {
    if (typeof input === 'number') {
      const found = this.branches().find(b => b.id === input);
      if (found) this.selectedBranch.set(found);
    } else {
      this.selectedBranch.set(input);
    }
  }
}