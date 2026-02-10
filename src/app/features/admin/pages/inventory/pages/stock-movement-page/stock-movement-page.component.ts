import { Component, inject, signal } from '@angular/core';
import { Subject, switchMap, startWith, map, catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { StockService } from '@/services/stock.service';
import { CommonModule } from '@angular/common';
import { StockMovementDrawerComponent } from '../../components/stock-movement-drawer/stock-movement-drawer.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stock-movement-page',
  standalone: true,
  imports: [CommonModule, StockMovementDrawerComponent, LucideAngularModule],
  templateUrl: './stock-movement-page.component.html'
})

export class StockMovementPageComponent {
  private stockService = inject(StockService);
  
  // 1. Create a "Trigger" signal
  private refreshTrigger = new Subject<void>();
  isDrawerOpen = signal(false);

  // 2. This signal automatically re-fetches whenever refreshTrigger.next() is called
  allMovements = toSignal(
    this.refreshTrigger.pipe(
      startWith(null),
      switchMap(() => this.stockService.getMovements()),
      // Add a map to ensure we are returning an array
      map((res: any) => {
        // If Laravel returns pagination, the array is in res.data
        // If it returns a direct array, use res
        return Array.isArray(res) ? res : (res?.data || []);
      })
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
        this.loadData(); 
      },
      error: (err) => console.error('Confirmation failed', err)
    });
  }
}