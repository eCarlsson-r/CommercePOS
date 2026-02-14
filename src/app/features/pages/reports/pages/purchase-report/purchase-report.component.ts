import { Component, inject, signal, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule } from "lucide-angular";
import { SupplierService } from "@/services/supplier.service";
import { Supplier } from "@/models/supplier.model";
import { PurchaseA4Component } from "../../components/purchase-a4.component";

@Component({
    selector: 'app-purchase-report',
    templateUrl: './purchase-report.component.html',
    imports: [CommonModule, FormsModule, LucideAngularModule, PurchaseA4Component]
})
export class PurchaseReportComponent {
    private supplierService = inject(SupplierService);
    suppliers = signal<Supplier[]>([]);
    reportData = signal<any[]>([]);
    supplierId = signal<number>(0);
    startDate = signal<string>('');
    endDate = signal<string>('');

    ngOnInit(): void {
        this.supplierService.getSuppliers().subscribe((res) => {
            this.suppliers.set(res);
        });
    }

    onSupplierChange() {
        const supplier = this.suppliers().find((s) => s.id === Number(this.supplierId()));
        this.report.supplierName.set(supplier?.name || 'All Suppliers');
    }

    @ViewChild(PurchaseA4Component) report!: PurchaseA4Component;

    generatePurchaseReport() {
        this.report.loadReportData(Number(this.supplierId()), this.startDate(), this.endDate());
    }

    printReport() {
        this.report.printReport();
    }
}