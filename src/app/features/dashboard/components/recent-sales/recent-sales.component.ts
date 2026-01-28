import { Component, OnInit, inject } from '@angular/core';
import { SaleService } from '@/services/sale.service';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-sales',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './recent-sales.component.html'
})
export class RecentSalesComponent implements OnInit {
  public saleService = inject(SaleService);

  ngOnInit() {
    this.saleService.fetchRecentSales();
  }
}