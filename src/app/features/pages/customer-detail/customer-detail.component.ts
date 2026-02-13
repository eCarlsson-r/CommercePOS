import { Component, Input, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Customer } from "@/models/customer.model";
import { signal } from "@angular/core";
import { CustomerService } from "@/services/customer.service";
import { LucideAngularModule } from "lucide-angular";
import { DecimalPipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    imports: [CommonModule, LucideAngularModule, DecimalPipe],
    standalone: true
})
export class CustomerDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private customerService = inject(CustomerService);
    customer = signal<Customer>({} as Customer);
    salesHistory = signal<any[]>([]);
    topItem = signal('');
    mostSales = signal(0);

    ngOnInit() {
        // 1. Get the ID from the URL
        const id = this.route.snapshot.paramMap.get('id');
        
        if (id) {
            this.loadCustomerData(Number(id));
        }
    }

    loadCustomerData(id: number) {
        this.customerService.getCustomers().subscribe(data => {
            this.customer.set(data.find(c => c.id === id) || {} as Customer);
        });
        // Fetch both profile and their transaction history across all branches
        this.customerService.getHistory(id).subscribe(data => {
            this.salesHistory.set(data);
            this.calculateTopItem();
        });
    }

    calculateTopItem() {
        const items = this.salesHistory().flatMap((sale: any) => sale.items);
        const itemCounts = items.reduce((acc: Record<string, number>, item: any) => {
            const name = item.product?.name || 'Unknown Item';
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {});

        const topItem = Object.entries(itemCounts).reduce<[string, number]>((acc, [item, count]) => {
            return count > acc[1] ? [item, count] : acc;
        }, ['', 0]);

        this.topItem.set(topItem[0]);
        this.mostSales.set(topItem[1]);
    }
}