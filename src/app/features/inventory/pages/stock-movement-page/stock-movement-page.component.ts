import { inject } from '@angular/core';
import { Subject, switchMap, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { StockService } from '@/services/stock.service';

export class StockMovementPageComponent {
  private stockService = inject(StockService);
  
  // 1. Create a "Trigger" signal
  private refreshTrigger = new Subject<void>();

  // 2. This signal automatically re-fetches whenever refreshTrigger.next() is called
  allMovements = toSignal(
    this.refreshTrigger.pipe(
      startWith(null), // Fetch immediately on load
      switchMap(() => this.stockService.getMovements())
    ),
    { initialValue: [] }
  );

  // 3. This is your loadData function!
  loadData() {
    this.refreshTrigger.next();
  }

  onReceive(id: number) {
    this.stockService.receiveTransfer(id).subscribe({
      next: () => {
        // After receiving, we "pull the lever" to update the list
        this.loadData(); 
      },
      error: (err) => console.error('Confirmation failed', err)
    });
  }
}